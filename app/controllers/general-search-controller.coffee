GeneralSearch = require '../models/general-search'

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
        response.sendError error

module.exports = GeneralSearchController
