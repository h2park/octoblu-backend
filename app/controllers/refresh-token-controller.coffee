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
    @getAccessToken userUuid, type, (error, auth) =>
      debug 'got token', auth, error
      console.error 'Error refreshing token', error.stack if error?
      return response.status(401).send("Error refreshing token: #{error.toString()}") if error?
      response.sendStatus(204)

  verifyDevice: (uuid) =>
    return uuid == process.env.REFRESH_TOKEN_WORKER_UUID

  getAccessToken: (uuid, type, callback=(->)) =>
    debug 'getAccessToken', uuid, type
    User.findUserAndApiByChannelType(uuid, type)
    .catch callback
    .then (channelAuth) =>
      debug 'foundAuth', channelAuth
      @refreshToken uuid, channelAuth, type, callback

  refreshToken: (uuid, channelAuth, type, callback=(->)) =>
    debug 'refreshToken', channelAuth.refreshToken, channelAuth.expiresOn
    passportRefresh.requestNewAccessToken _.last(type.split(':')), channelAuth.refreshToken, (error, accessToken, refreshToken, results) =>
      return callback error if error?
      return callback new Error 'Invalid results' if _.isEmpty results
      
      expiresOn = Date.now() + (results.expires_in * 1000)
      channelAuth.token = accessToken
      channelAuth.refreshToken = refreshToken
      channelAuth.expiresOn = expiresOn
      User.addApiToUserByChannelType uuid, type, channelAuth
      .catch callback
      .then ->
        callback null, token: accessToken, expiresOn: expiresOn, refreshToken: refreshToken

module.exports = RefreshTokenController
