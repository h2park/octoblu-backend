MessageSummary = require '../models/message-summary'

class MessageSummaryController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    uuid = request.uuid
    token = request.token
    message_summary = new MessageSummary @elasticSearchUri, uuid, token
    message_summary.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.sendError error

module.exports = MessageSummaryController
