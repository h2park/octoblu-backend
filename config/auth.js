var config = {
  rh: {
  },
  development: {
    'promiseTimeout' : 1000,
    betaInvites : {
      betaId : 4829,
      apiKey : 'UrswKVa4CaC6aaXtN6Zh',
      baseUrl: 'https://octoblu.prefinery.com/api/v2'
    },
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
      override_token : process.env.SKYNET_OVERRIDE_TOKEN || 'w0rldd0m1n4t10n',
      host : process.env.SKYNET_HOST || 'localhost',
      port : process.env.SKYNET_PORT || 3000
    },
    designer: {
      host: process.env.DESIGNER_HOST || 'http://designer.octoblu.com',
      port: process.env.DESIGNER_PORT || 1025,
      docker_port: process.env.DESIGNER_DOCKER_PORT
    },
    port: process.env.PORT || 8080,
    sslPort: process.env.SSL_PORT || 8081,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    flowDeployUri: 'http://localhost:8899',
    domain: null,
    flow_logger_uuid: process.env.FLOW_LOGGER_UUID
  },
  test: {
    promiseTimeout : 100,
    betaInvites : {
      betaId : 4829,
      apiKey : 'UrswKVa4CaC6aaXtN6Zh',
      baseUrl: 'https://octoblu.prefinery.com/api/v2'
    },
    designer: {
      host: process.env.DESIGNER_HOST || 'http://designer.octoblu.com',
      port: process.env.DESIGNER_PORT || 1025,
      docker_port: process.env.DESIGNER_DOCKER_PORT
    },
    flow_logger_uuid: process.env.FLOW_LOGGER_UUID
  },
  production: {
    promiseTimeout : 5000,
    skynet : {
      host:           process.env.SKYNET_HOST || 'meshblu.octoblu.com',
      override_token: process.env.SKYNET_OVERRIDE_TOKEN || 'w0rldd0m1n4t10n',
      port:           process.env.SKYNET_PORT || 443
    },
    designer: {
      host: process.env.DESIGNER_HOST || 'http://designer.octoblu.com',
      port: process.env.DESIGNER_PORT || 1025,
      docker_port: process.DESIGNER_DOCKER_PORT
    },
    port:             process.env.PORT || 80,
    sslPort:          process.env.SSL_PORT || 443,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    flowDeployUri: 'https://flow-deploy.octoblu.com',
    domain: '.octoblu.com',
    flow_logger_uuid: process.env.FLOW_LOGGER_UUID
  },
  staging: {
    promiseTimeout : 5000,
    betaInvites : {
      betaId : 4829,
      apiKey : 'UrswKVa4CaC6aaXtN6Zh',
      baseUrl: 'https://octoblu.prefinery.com/api/v2'
    },
    skynet: {
      host:           process.env.SKYNET_HOST || 'meshblu-staging.octoblu.com',
      override_token: process.env.SKYNET_OVERRIDE_TOKEN || 'w0rldd0m1n4t10n',
      port:           process.env.SKYNET_PORT || 80
    },
    designer: {
      host: process.env.DESIGNER_HOST || 'http://designer.octoblu.com',
      port: process.env.DESIGNER_PORT || 1025,
      docker_port: process.DESIGNER_DOCKER_PORT
    },
    port :             process.env.PORT || 80,
    sslPort:          process.env.SSL_PORT || 443,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    flowDeployUri:    'https://flow-deploy.octoblu-staging.com',
    domain:           '.octoblu.com',
    flow_logger_uuid: process.env.FLOW_LOGGER_UUID
  }
};

module.exports = config[process.env.NODE_ENV] || config['development'];
