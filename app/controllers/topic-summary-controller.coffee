TopicSummary = require '../models/topic-summary'

class TopicSummaryController
  constructor: (@elasticSearchUri) ->

  show: (request, response) =>
    uuid = request.uuid
    token = request.token
    topic_summary = new TopicSummary @elasticSearchUri, uuid, token
    topic_summary.fetch()
      .then (result) =>
        response.send result
      .catch (error) =>
        response.sendError error


module.exports = TopicSummaryController
