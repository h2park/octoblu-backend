nodefn    = require 'when/node/function'
_         = require 'lodash'
USE_MONGO = process.env.USE_MONGO == 'true'

console.error "================================================"
console.error "  using #{if USE_MONGO then 'mongo' else 'nedb'}"
console.error "================================================"

class TestDatabase
  @collectionNames : ['users', 'templates']
  @open: (callback=->) =>
    if USE_MONGO
      mongojs = require 'mongojs'
      callCallback = _.after @collectionNames.length, callback
      db = mongojs 'octoblu-test', @collectionNames
      _.each @collectionNames, (name) =>
        db[name].remove (error) =>
          callCallback error, @wrap(db)

    else
      Datastore = require 'nedb'
      db = {}
      callCallback = _.after @collectionNames.length, => callback null, @wrap(db)
      _.each @collectionNames, (name) =>
        db[name] = new Datastore
          inMemoryOnly: true
          autoload: true
          onload: callCallback

  @wrap: (db) =>
    functionsToWrap = ['find', 'findOne', 'remove', 'insert', 'update', 'count']
    wrappedDatabase = {}

    _.each @collectionNames, (name) =>
      wrappedDatabase[name] = {}
      _.each functionsToWrap, (fn) =>
        wrappedDatabase[name][fn] = nodefn.lift(_.bind(db[name][fn], db[name]))

    wrappedDatabase
module.exports = TestDatabase
