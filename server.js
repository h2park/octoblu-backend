'use strict';
require('coffee-script/register');

var _                  = require('lodash');
var express            = require('express');
var path               = require('path');
var morgan             = require('morgan');
var cookieParser       = require('cookie-parser');
var bodyParser         = require('body-parser');
var cors               = require('cors');
var passport           = require('passport');
var flash              = require('connect-flash');
var fs                 = require('fs');
var meshbluHealthcheck = require('express-meshblu-healthcheck');
var MeshbluAuth        = require('express-meshblu-auth');
var sendError          = require('express-send-error');
var expressVersion     = require('express-package-version');
var session            = require('cookie-session');
var OctobluRaven       = require('octoblu-raven');
var debug              = require('debug')('octoblu:server');

var databaseConfig     = require('./config/database');
var configAuth         = require('./config/auth.js');
var SecurityController = require('./app/controllers/middleware/security-controller');
var Routes             = require('./app/routes.js');
var privateKey         = fs.readFileSync('config/server.key', 'utf8');
var certificate        = fs.readFileSync('config/server.crt', 'utf8');
var credentials        = {key: privateKey, cert: certificate};
var app                = express();

var port               = process.env.OCTOBLU_PORT || configAuth.port;
var sslPort            = process.env.OCTOBLU_SSLPORT || configAuth.sslPort;

var octobluRaven = new OctobluRaven();
octobluRaven.patchGlobal();

var ravenExpress = octobluRaven.express();
app.use(ravenExpress.handleErrors());
app.use(sendError());


var databaseOptions = {
	collections : [
		'invitations'
	]
};

var octobluDB = require('./app/lib/database');
octobluDB.createConnection(databaseOptions);

// Initialize Models

//moved all the models initialization into here, because otherwise when we include the schema twice,
var PassportStrategyLoader = require('./config/passport-strategy-loader');
var passportStrategyLoader = new PassportStrategyLoader();
passportStrategyLoader.load();

app.use(meshbluHealthcheck());
app.use(expressVersion({ format: '{"version": "%s"}' }));

// set up our express application
app.use(morgan('dev', { immediate:false })); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// increasing body size for resources
app.use(bodyParser.urlencoded({ extended : true, limit : '1mb' }));
app.use(bodyParser.json({ limit : '1mb' }));

var meshbluJSON;
try {
  meshbluJSON  = require('./meshblu.json');
} catch (error) {
  meshbluJSON = {
    uuid:   process.env.OCTOBLU_UUID,
    token:  process.env.OCTOBLU_TOKEN,
    server: configAuth.skynet.host,
    port:   configAuth.skynet.port
  }
}

if ( !meshbluJSON || meshbluJSON.uuid == null ) {
  console.error("Octoblu UUID not defined in meshblu.json or OCTOBLU_UUID environment variable");
  process.exit(1);
}

if ( !meshbluJSON || meshbluJSON.token == null ) {
  console.error("Octoblu token not defined in meshblu.json or OCTOBLU_TOKEN environment variable");
  process.exit(1);
}

app.use(session(
  {
    name: 'octoblu:sess',
    secret: meshbluJSON.uuid + meshbluJSON.token,
    domain: configAuth.domain,
    secureProxy: (process.env.NODE_ENV !== 'development')
  }
));

app.use(passport.initialize());
app.use(cors());

// begin bypass and heartache
var bypassedAuthRoutes = [
  {method: 'POST', path: '/api/webhooks/.*'},
  {method: 'GET', path: '/api/session'},
  {method: 'POST', path: '/api/auth'}
];

var bypassedTermsRoutes = [
  {method: 'GET', path: '/api/session'},
  {method: '*', path: '/api/auth'},
  {method: '*', path: '/api/auth/.*'},
  {method: '*', path: '/api/flow-auth-credentials/*'}
];

var canBypassAuth = function(req) {
  var result = _.find(bypassedAuthRoutes, function(route) {
    return (route.method === req.method || route.method === '*') &&
      req.path.match(route.path)
  });
  debug('canBypassAuth', req.path, !!result);
  return !!result;
}

var canBypassTerms = function(req) {
  var result = _.find(bypassedTermsRoutes, function(route) {
    return (route.method === req.method || route.method === '*') &&
      req.path.match(route.path)
  });
  debug('canBypassTerms', req.path, !!result);
  return !!result;
}
var meshbluAuth = new MeshbluAuth(meshbluJSON);

app.use(meshbluAuth.retrieve());
app.use(function(req, res, next) {
  if (canBypassAuth(req)) {
    return next();
  }
  meshbluAuth.gateway()(req, res, next);
});

app.use(ravenExpress.meshbluAuthContext());

var security = new SecurityController();
app.use(function(req, res, next) {
  if (canBypassAuth(req)) {
    return next();
  }
  security.isAuthenticated(req, res, next);
});

app.use(function(req, res, next) {
  if (canBypassAuth(req) || canBypassTerms(req)) {
    return next();
  }
  security.enforceTerms(req, res, next);
});

// end bypass, but still heartache

Routes(app, passport, configAuth, meshbluJSON);

var server = app.listen(port, function(error) {
  if(error)  {
    console.error(error.stack);
    process.exit(1);
  }

  console.log('HTTP listening on port ' + port);
})

process.on('SIGTERM', function(){
  console.log('SIGTERM received, exiting');
  server.close(function(){
    process.exit(0);
  });
});
