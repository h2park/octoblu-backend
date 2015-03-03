USE_MONGO = process.env.USE_MONGO == 'true'

console.log "================================================"
console.log "  using #{if USE_MONGO then 'mongo' else 'nedb'}"
console.log "================================================"

class TestDatabase
  @open: (callback=->) =>
    if USE_MONGO
      mongojs = require 'mongojs'
      db = mongojs 'octoblu-test', ['users']
      db.devices.remove (error) =>
        callback error, db
    else
      Datastore = require 'nedb'
      datastore = new Datastore
        inMemoryOnly: true
        autoload: true
        onload: => callback null, {users: datastore}


module.exports = TestDatabase
