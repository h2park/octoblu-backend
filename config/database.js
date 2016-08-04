var path = require('path');

var config = {
    test: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis',
        databaseType: process.env.USE_MONGO == 'true' ? 'mongodb' : 'nedb',
        databaseDirectory : path.join(__dirname, '../database'),
        url : 'mongodb://localhost:27017/meshines-test',
        mongojsUrl : 'mongodb://localhost:27017/meshines-test',
        redisSessionUrl: 'redis://localhost'
    },
    development: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis', // redis or nedb
        databaseType: 'mongodb', // mongodb or nedb
        databaseDirectory : path.join(__dirname, '../database'),
        url : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        mongojsUrl : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        redisSessionUrl: 'redis://foo.bar'
    },
    production: {
        sessionSecret: process.env.SESSION_SECRET || 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : process.env.SESSION_DATABASE || 'redis',
        databaseType : process.env.DATABASE_TYPE || 'mongodb',
        url : process.env.MONGO_URI,
        mongojsUrl : process.env.MONGOJS_URI,
        redisSessionUrl: process.env.REDIS_URL
    },
    nedb: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'nedb', // nedb or nedb
        databaseType: 'nedb', // nedb or nedb
        databaseDirectory : path.join(__dirname, '../database')
    }
};

module.exports = config[process.env.NODE_ENV] || config['development'];
