'use strict'
_ = require 'lodash'
debug = require('debug')('octoblu:refresh-token-controller')
textCrypt = require '../lib/textCrypt'
moment = require 'moment'
passportRefresh = require 'passport-oauth2-refresh'

class RefreshTokenController
  constructor: (@meshbluJSON, @dependencies={}) ->
    @MeshbluHttp = @dependencies.MeshbluHttp ? require 'meshblu-http'
    @meshbluDb = @dependencies.meshbluDb ? require '../lib/database'

  refresh: (request, response) =>
    return response.sendStatus(401) unless @verifyDevice request.uuid
    {userUuid, type} = request.body
    return response.sendStatus(422) unless userUuid?
    return response.sendStatus(422) unless type?
    @getAndRefreshToken userUuid, type, (error) =>
      debug 'got token', error
      console.error 'Error refreshing token', error, error.stack if error?
      return response.status(401).send("Error refreshing token #{JSON.stringify error}") if error?
      response.sendStatus(204)

  verifyDevice: (uuid) =>
    return uuid == process.env.REFRESH_TOKEN_WORKER_UUID

  getAndRefreshToken: (uuid, type, callback) =>
    debug 'getAndRefreshToken', uuid, type
    User.findUserAndApiByChannelType(uuid, type)
      .catch callback
      .then (channelAuth) =>
        channelAuth.refreshToken = textCrypt.decrypt channelAuth.refreshToken_crypt if channelAuth.refreshToken_crypt?
        debug 'foundAuth', channelAuth
        @refreshToken uuid, channelAuth, type, callback

  removeExpiredOn: (uuid, type, channelAuth, callback) =>
    delete channelAuth.expiresOn
    @updateChannelAuth uuid, type, channelAuth, (updateError) =>
      return callback updateError unless updateError?
      callback 'Removed From Expired On'

  updateChannelAuth: (uuid, type, channelAuth, callback) =>
    User.addApiToUserByChannelType uuid, type, channelAuth
      .catch callback
      .then -> callback null

  refreshToken: (uuid, channelAuth, type, callback) =>
    debug 'refreshToken', channelAuth.refreshToken, channelAuth.expiresOn
    return callback null unless channelAuth.refreshToken?
    passportRefresh.requestNewAccessToken _.last(type.split(':')), channelAuth.refreshToken, (error, accessToken, refreshToken, results) =>
      return @removeExpiredOn uuid, type, channelAuth, callback if error?

      expiresOn = Date.now() + (results.expires_in * 1000)
      channelAuth.token_crypt = textCrypt.encrypt accessToken
      channelAuth.refreshToken_crypt = textCrypt.encrypt refreshToken
      channelAuth.expiresOn = expiresOn

      @updateChannelAuth uuid, type, channelAuth, callback

module.exports = RefreshTokenController
