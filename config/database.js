var path = require('path');

var config = {
    development: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis', // redis or nedb
        databaseType: 'mongodb', // mongodb or nedb
        databaseDirectory : path.join(__dirname, '../database'),
        url : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        mongojsUrl : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        redisSessionUrl: process.env.REDIS_URL || 'redis://localhost'
    },
    production: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis',
        databaseType : 'mongodb',
        url : 'mongodb://[user]:[password]@lighthouse.4.mongolayer.com:10212,lighthouse.5.mongolayer.com:10212/octoblu?replicaSet=set-5654a6a9e73ab307ec000ca8',
        mongojsUrl : 'octoblu:VPXrCesMmXayJzSET3qW@lighthouse.4.mongolayer.com:10212,lighthouse.5.mongolayer.com:10212/octoblu?replicaSet=set-5654a6a9e73ab307ec000ca8',
        redisSessionUrl: process.env.REDIS_URL || 'redis://meshblu-redis.csy8op.0001.usw2.cache.amazonaws.com'
    },
    nedb: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'nedb', // nedb or nedb
        databaseType: 'nedb', // nedb or nedb
        databaseDirectory : path.join(__dirname, '../database')
    }
};

module.exports = config[process.env.NODE_ENV] || config['development'];
