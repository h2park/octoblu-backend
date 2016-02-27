var config = {
  'rh': {
  },
  'development': {
    promiseTimeout : 1000,
    email : {
      from: 'serveradmin@octoblu.com',
      SMTP: {
        host: 'email-smtp.us-west-2.amazonaws.com',
        port: 465,
        secure: true,
        auth: {
          user: 'AWS_ACCESS_KEY_ID',
          pass: 'AWS_SECRET_ACCESS_KEY'
        }
      },
      invitation: {
        templateUrl: '/templates/invitation.jade'
      }
    },
    skynet : {
      host : process.env.SKYNET_HOST || 'localhost',
      port : process.env.SKYNET_PORT || 3000
    },
    port: process.env.PORT || 8080,
    sslPort: process.env.SSL_PORT || 8081,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    nanocyteDeployUri: 'http://localhost:5051',
    domain: null,
    flow_logger_uuid: process.env.FLOW_LOGGER_UUID
  },
  'octoblu-dev': {
    promiseTimeout : 5000,
    skynet : {
      host:           process.env.SKYNET_HOST || 'meshblu.octoblu.dev',
      port:           process.env.SKYNET_PORT || 80
    },
    port:             process.env.PORT || 80,
    sslPort:          process.env.SSL_PORT || 443,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    nanocyteDeployUri:'http://nanocyte-flow-deploy.octoblu.dev',
    domain:           '.octoblu.dev',
    flow_logger_uuid: process.env.FLOW_LOGGER_UUID
  },
  'production': {
    promiseTimeout : 5000,
    skynet : {
      host:           process.env.SKYNET_HOST || 'meshblu.octoblu.com',
      port:           process.env.SKYNET_PORT || 443
    },
    port:             process.env.PORT || 80,
    sslPort:          process.env.SSL_PORT || 443,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    nanocyteDeployUri:'https://nanocyte-flow-deploy.octoblu.com',
    domain:           '.octoblu.com',
    flow_logger_uuid: process.env.FLOW_LOGGER_UUID
  }
};

module.exports = config[process.env.NODE_ENV] || config['development'];
