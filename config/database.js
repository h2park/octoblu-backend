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
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis',
        databaseType : 'mongodb',
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

console.log('### USING "'+ process.env.NODE_ENV+'" DATABASE CONFIGURATION ###')

if(!config[process.env.NODE_ENV]) {
  console.log("===> Actually scratch that, you'll be using development since that NODE_ENV doesn't exist in the config")
}else if(process.env.NODE_ENV === 'production') {
  console.log("===> You are running in PRODUCTION, this will do dangerous things if you are not actually in production")
}

module.exports = config[process.env.NODE_ENV] || config['development'];
