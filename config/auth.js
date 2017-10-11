var config = {
  rh: {},
  development: {
    promiseTimeout: 1000,
    email: {
      from: "serveradmin@octoblu.com",
      SMTP: {
        host: "email-smtp.us-west-2.amazonaws.com",
        port: 465,
        secure: true,
        auth: {
          user: "AWS_ACCESS_KEY_ID",
          pass: "AWS_SECRET_ACCESS_KEY",
        },
      },
      invitation: {
        templateUrl: "/templates/invitation.jade",
      },
    },
    skynet: {
      hostname: process.env.MESHBLU_HOSTNAME || "localhost",
      port: process.env.MESHBLU_PORT || 3000,
      protocol: process.env.MESHBLU_PROTOCOL || "http",
    },
    port: process.env.PORT || 8080,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    nanocyteDeployUri: "http://localhost:5051",
    domain: ".octoblu.test",
  },
  production: {
    promiseTimeout: 5000,
    skynet: {
      hostname: process.env.MESHBLU_HOSTNAME || "meshblu.octoblu.com",
      port: process.env.MESHBLU_PORT || 443,
      protocol: process.env.MESHBLU_PROTOCOL || "https",
    },
    port: process.env.PORT || 80,
    elasticSearchUri: process.env.ELASTIC_SEARCH_URI,
    nanocyteDeployUri: process.env.NANOCYTE_DEPLOY_URI || "https://nanocyte-flow-deploy.octoblu.com",
    domain: process.env.CLUSTER_DOMAIN || ".octoblu.com",
  },
}

module.exports = config[process.env.NODE_ENV] || config["development"]
