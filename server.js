'use strict';
require('coffee-script/register');

var _                  = require('lodash');
var octobluExpress     = require('express-octoblu');
var path               = require('path');
var cookieParser       = require('cookie-parser');
var passport           = require('passport');
var flash              = require('connect-flash');
var fs                 = require('fs');
var MeshbluAuth        = require('express-meshblu-auth');
var session            = require('cookie-session');
var SigtermHandler     = require('sigterm-handler')
var debug              = require('debug')('octoblu:server');

var databaseConfig     = require('./config/database');
var configAuth         = require('./config/auth.js');
var SecurityController = require('./app/controllers/middleware/security-controller');
var Routes             = require('./app/routes.js');
var privateKey         = fs.readFileSync('config/server.key', 'utf8');
var certificate        = fs.readFileSync('config/server.crt', 'utf8');
var credentials        = {key: privateKey, cert: certificate};
var app                = octobluExpress();
var port               = process.env.OCTOBLU_PORT || configAuth.port;
var sslPort            = process.env.OCTOBLU_SSLPORT || configAuth.sslPort;

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

app.use(cookieParser()); // read cookies (needed for auth)

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
    domain: 'app' + configAuth.domain,
    secureProxy: (process.env.NODE_ENV !== 'development')
  }
));

app.use(passport.initialize());

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

app.use(meshbluAuth.get());
app.use(function(req, res, next) {
  if (canBypassAuth(req)) {
    return next();
  }
  meshbluAuth.gateway()(req, res, next);
});

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

  console.log('Octoblu API listening on port ' + server.address().port);
})

var sigtermHandler = new SigtermHandler({ events: ['SIGTERM', 'SIGINT']})
if(server == null && _.isFunction(server.close)) {
  sigtermHandler.register(server.close)
}
