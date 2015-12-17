THREE_MONTHS_IN_MS=1000*60*60*24*30*3

class SessionController
  @ERROR_RETRIEVING_SESSION = 'Error retrieving session'
  constructor: (@dependencies={}) ->
    @dependencies.UserSession ?= require '../models/user-session-model'

  show: (request, response) =>
    {uuid,token,callbackUrl} = request.query
    userSession = new @dependencies.UserSession
    userSession.create uuid, token, (error, user, sessionToken) =>
      return response.status(500).send(SessionController.ERROR_RETRIEVING_SESSION) if error?
      request.user = user
      response.cookie 'meshblu_auth_uuid', uuid, {maxAge: THREE_MONTHS_IN_MS}
      response.cookie 'meshblu_auth_token', sessionToken, {maxAge: THREE_MONTHS_IN_MS}
      response.redirect(callbackUrl ? '/')

module.exports = SessionController
