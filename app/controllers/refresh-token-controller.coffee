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

  refreshTokenError: (uuid, type, channelAuth, error, callback) =>
    channelAuth.validToken = false
    channelAuth.refreshTokenError = error
    @updateChannelAuth uuid, type, channelAuth, (updateError) =>
      return callback updateError unless updateError?
      callback 'Invalid Refresh Token'

  updateChannelAuth: (uuid, type, channelAuth, callback) =>
    delete channelAuth.refreshToken
    User.addApiToUserByChannelType uuid, type, channelAuth
      .catch callback
      .then -> callback null

  refreshToken: (uuid, channelAuth, type, callback) =>
    debug 'refreshToken', channelAuth.refreshToken, channelAuth.expiresOn
    return callback null unless channelAuth.refreshToken?
    passportName = _.last(type.split(':'))
    return @customRefreshStrategy passportName, channelAuth, callback if passportRefresh[passportName]?
    return @passportRefreshStrategy passportName, channelAuth, callback if passportRefresh.has passportName
    callback new Error('Missing Refresh Token Strategy')

  customRefreshStrategy: (passportName, channelAuth, callback) =>
    passportRefresh[passportName] passportName, channelAuth, (error, accessToken, refreshToken, results) =>
      @refreshTokenResult error, accessToken, refreshToken, results, callback

  passportRefreshStrategy: (passportName, channelAuth, callback) =>
    passportRefresh.requestNewAccessToken passportName, channelAuth.refreshToken, (error, accessToken, refreshToken, results) =>
      @refreshTokenResult error, accessToken, refreshToken, results, callback

  refreshTokenResult: (error, accessToken, refreshToken, results, callback) =>
    return @refreshTokenError uuid, type, channelAuth, error, callback if error?

    expiresOn = Date.now() + (results.expires_in * 1000)
    channelAuth.token_crypt = textCrypt.encrypt accessToken
    channelAuth.refreshToken_crypt = textCrypt.encrypt refreshToken
    channelAuth.expiresOn = expiresOn
    channelAuth.validToken = true
    channelAuth.refreshTokenError = null

    @updateChannelAuth uuid, type, channelAuth, callback

module.exports = RefreshTokenController
