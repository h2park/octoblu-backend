_ = require 'lodash'
octobluDB  = require './app/lib/database'
textCrypt = require './app/lib/textCrypt'

octobluDB.createConnection()
users = octobluDB.getCollection 'users'
users.find {}, (error, records) =>
  _.each records, (record) =>
    console.log record._id
    console.log record
    _.each record.api, (api) =>
      encrypt_tokens api
    users.update {_id: record._id}, $set: api: record.api, (error, res) =>
      console.error error if error?
      console.log res

encrypt_tokens = (api) =>
  {token,secret,refreshToken} = api
  if token
    api.token_crypt = textCrypt.encrypt token
    delete api.token

  if secret
    api.secret_crypt = textCrypt.encrypt secret
    delete api.secret

  if refreshToken
    api.refreshToken_crypt = textCrypt.encrypt refreshToken
    delete api.refreshToken

  api
