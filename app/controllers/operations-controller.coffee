fs = require 'fs'
operations = JSON.parse(fs.readFileSync('assets/json/operations.json'))

class OperationsController
  constructor: ->

  list: (req, res) =>
    res.send operations

module.exports = OperationsController;
