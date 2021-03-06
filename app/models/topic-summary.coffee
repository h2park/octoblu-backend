_    = require 'lodash'
When = require 'when'
queryTemplate = require '../../assets/json/elasticsearch/topic-summary.json'

class TopicSummary
  constructor: ( elasticSearchUrl, @ownerUuid, @ownerToken, dependencies={}) ->
    @elasticSearchUrl = elasticSearchUrl
    @request = dependencies.request ? require 'request'
    DeviceCollection = dependencies.DeviceCollection ? require '../collections/device-collection'
    @deviceCollection = new DeviceCollection @ownerUuid, @ownerToken

  fetch: =>
    @deviceCollection.fetchAll().then (devices) =>
      uuids = _.pluck devices, 'uuid'
      uuids.unshift @ownerUuid
      When.promise (resolve, reject) =>
        params = @requestParams uuids
        return resolve []

        # @request params, (error, response, body) =>
        #   return reject error if error?
        #   unless response.statusCode == 200
        #     error = new Error('elasticsearch error')
        #     error.statusCode    = response.statusCode
        #     error.body          = response.body
        #     error.requestParams = params
        #     return reject error
        #   resolve @parseResponse body

  parseResponse: (response) =>
    _.map response.aggregations.topic_summary.topics.buckets, (bucket) =>
      {topic: bucket.key, count: bucket.doc_count}

  requestParams: (uuids)=>
    method: 'POST'
    url:    "#{@elasticSearchUrl}/meshblu_events_300/_search?search_type=count"
    json:   @query uuids

  query: (uuids) =>
    queryTemplate.aggs.topic_summary.filter.or =
      _.flatten _.map uuids, (uuid) => [
        {term: {'fromUuid.raw': uuid}}
        {term: {'toUuid.raw': uuid}}
      ]

    queryTemplate


module.exports = TopicSummary
