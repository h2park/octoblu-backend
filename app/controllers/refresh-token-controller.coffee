'use strict'
_ = require 'lodash'
debug = require('debug')('octoblu:refresh-token-controller')
textCrypt = require '../lib/textCrypt'
moment = require 'moment'
passportRefresh = require 'passport-oauth2-refresh'

class RefreshTokenController
  constructor: (@meshbluJSON, @dependencies={}) ->
    @MeshbluHttp = @dependencies.MeshbluHttp ? require 'meshblu-http'

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
    return @customRefreshStrategy passportName, uuid, channelAuth, type, callback if passportRefresh[passportName]?
    return @passportRefreshStrategy passportName, uuid, channelAuth, type, callback if passportRefresh.has passportName
    callback new Error('Missing Refresh Token Strategy')

  customRefreshStrategy: (passportName, uuid, channelAuth, type, callback) =>
    passportRefresh[passportName] passportName, channelAuth, @refreshTokenResult(uuid, channelAuth, type, callback)

  passportRefreshStrategy: (passportName, uuid, channelAuth, type, callback) =>
    passportRefresh.requestNewAccessToken passportName, channelAuth.refreshToken, @refreshTokenResult(uuid, channelAuth, type, callback)

  refreshTokenResult: (uuid, channelAuth, type, callback) =>
    return (error, accessToken, refreshToken, results) =>
      return @refreshTokenError uuid, type, channelAuth, error, callback if error?

      expiresOn = Date.now() + (results.expires_in * 1000)
      channelAuth.token_crypt = textCrypt.encrypt accessToken if accessToken?
      channelAuth.refreshToken_crypt = textCrypt.encrypt refreshToken if refreshToken?
      channelAuth.expiresOn = expiresOn
      channelAuth.validToken = true
      channelAuth.refreshTokenError = null

      @updateChannelAuth uuid, type, channelAuth, callback

module.exports = RefreshTokenController
