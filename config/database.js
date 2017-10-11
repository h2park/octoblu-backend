var path = require("path")

var config = {
  test: {
    databaseType: process.env.USE_MONGO == "true" ? "mongodb" : "nedb",
    databaseDirectory: path.join(__dirname, "../database"),
    mongojsUrl: "mongodb://localhost:27017/meshines-test",
    redisSessionUrl: "redis://localhost",
  },
  development: {
    databaseType: "mongodb", // mongodb or nedb
    databaseDirectory: path.join(__dirname, "../database"),
    mongojsUrl:
      process.env.MONGODB_URI ||
      process.env.MONGOJS_URI ||
      process.env.OCTOBLU_DB ||
      "mongodb://localhost:27017/meshines",
  },
  production: {
    databaseType: process.env.DATABASE_TYPE || "mongodb",
    mongojsUrl: process.env.MONGODB_URI || process.env.MONGOJS_URI,
  },
  nedb: {
    databaseType: "nedb", // nedb or nedb
    databaseDirectory: path.join(__dirname, "../database"),
  },
}

module.exports = config[process.env.NODE_ENV] || config["development"]
