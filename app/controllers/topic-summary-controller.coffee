TopicSummary = require '../models/topic-summary'
airbrake = require('airbrake').createClient process.env.AIRBRAKE_KEY

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
        response.send 500, error: error.message
        airbrake.notify error


module.exports = TopicSummaryController
