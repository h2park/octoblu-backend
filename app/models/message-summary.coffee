_             = require 'lodash'
When          = require 'when'
queryTemplate = require '../../assets/json/elasticsearch/message-summary.json'

class MessageSummary
  constructor: (elasticSearchUrl, ownerUuid, dependencies)->
    @elasticSearchUrl = elasticSearchUrl
    @ownerUuid = ownerUuid
    DeviceCollection = dependencies.DeviceCollection ? require '../collections/device-collection'
    @request         = dependencies.request ? require 'request'
    @deviceCollection = new DeviceCollection ownerUuid


  fetch: =>
    @deviceCollection.fetchAll().then (devices) =>
      When.promise (resolve, reject) =>
        uuids = [@ownerUuid].concat _.pluck(devices, 'uuid')
        @request @requestParams(uuids), (error, response, body) =>
          return reject error if error?
          resolve @processResponse body.aggregations

  processResponse: (aggregations) =>
    results = {}

    _.each aggregations.sent.buckets, (bucket) =>
      results[bucket.key] =
        uuid: bucket.key
        sent: bucket.doc_count
        received: 0

    _.each aggregations.received.buckets, (bucket) =>
      results[bucket.key] ?= uuid: bucket.key, sent: 0
      results[bucket.key].received = bucket.doc_count

    _.values results



  requestParams: (uuids) =>
    fromUuids = _.map uuids, (uuid) =>
      term: {'@fields.fromUuid.raw': uuid}

    toUuids = _.map uuids, (uuid) =>
      term: {'@fields.toUuid.raw': uuid}

    queryTemplate.aggs.sent.filter.and[1].or = fromUuids
    queryTemplate.aggs.received.filter.and[1].or = toUuids

    url: @elasticSearchUrl
    method: 'POST',
    json: queryTemplate

module.exports = MessageSummary
