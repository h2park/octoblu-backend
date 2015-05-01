GeneralSearch = require '../models/general-search'
airbrake = require('airbrake').createClient process.env.AIRBRAKE_KEY

class GeneralSearchController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    uuid = request.uuid
    token = request.token
    general_search = new GeneralSearch @elasticSearchUri, request.query.q, uuid, token
    general_search.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.send 500, error: error.message
        airbrake.notify error

module.exports = GeneralSearchController
