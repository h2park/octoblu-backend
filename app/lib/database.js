"use strict"
var config = require("../../config/database"),
  when = require("when"),
  nodefn = require("when/node/function"),
  _ = require("lodash"),
  path = require("path")

var debug = require("debug")("octoblu:lib/database")

var nedbCollections = {}
function createNeDBCollection(collection) {
  if (!nedbCollections[collection]) {
    var Datastore = require("nedb")

    nedbCollections[collection] = new Datastore({
      filename: path.join(config.databaseDirectory, collection + ".db"),
      autoload: true,
    })
  }

  return nedbCollections[collection]
}

function createObjectId(id) {
  var mongojs = require("mongojs")
  return mongojs.ObjectId(id)
}

function handleFatalError(error, callback) {
  if (!error) return callback()
  if (!(/ECONNREFUSED/.test(error.message) || /no primary server available/.test(error.message))) return callback()
  console.error("FATAL: database error", error)
  process.exit(1)
}

function wrapFunction(fn) {
  return function() {
    var self = this
    var args = arguments
    var ogCallback = args[arguments.length - 1]
    if (!_.isFunction(ogCallback)) {
      fn.apply(self, args)
      return self
    }
    var callback = function() {
      var cbArgs = arguments
      var error = _.first(cbArgs)
      handleFatalError(error, function() {
        ogCallback.apply(self, cbArgs)
      })
    }
    args[arguments.length - 1] = callback
    fn.apply(self, args)
    return self
  }
}

function wrapCollection(collection) {
  var _find = _.bind(collection.find, collection)
  var _findOne = _.bind(collection.findOne, collection)
  var _remove = _.bind(collection.remove, collection)
  var _insert = _.bind(collection.insert, collection)
  var _update = _.bind(collection.update, collection)
  return {
    find: nodefn.lift(_.bind(wrapFunction(_find), collection)),
    originalFind: _find,
    findOne: nodefn.lift(_.bind(wrapFunction(_findOne), collection)),
    remove: nodefn.lift(_.bind(wrapFunction(_remove), collection)),
    insert: nodefn.lift(_.bind(wrapFunction(_insert), collection)),
    update: nodefn.lift(_.bind(wrapFunction(_update), collection)),
    ObjectId: createObjectId,
  }
}

var collections = {}

// Returns a hash of collections
function Database() {
  return this
}

Database.prototype.createConnection = function() {
  var self = this
  self.config = config

  if (config.databaseType === "nedb") {
    self.getCollectionBase = createNeDBCollection
  } else {
    if (self.db && self.getCollectionBase) {
      return self
    }
    debug("instantiating new database")
    var mongojs = require("mongojs")
    self.db = mongojs(config.mongojsUrl)
    self.getCollectionBase = _.bind(self.db.collection, self.db)
    self.db.on("ready", function() {
      debug('received mongo "ready" event')
    })
    self.db.on("connect", function() {
      debug('received mongo "connect" event')
    })
    self.db.on("reconnect", function() {
      debug('received mongo "reconnect" event')
    })
  }

  return self
}

Database.prototype.getCollection = function(collectionName) {
  if (collections[collectionName]) {
    return collections[collectionName]
  }
  collections[collectionName] = wrapCollection(this.getCollectionBase(collectionName))
  return collections[collectionName]
}

module.exports = new Database()
