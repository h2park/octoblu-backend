class SessionController
  @ERROR_RETRIEVING_SESSION = 'Error retrieving session'

  constructor: (@dependencies={}) ->
    @dependencies.UserSession ?= require '../models/user-session-model'

  show: (request, response) =>
    {uuid,token,callbackUrl} = request.query
    userSession = new @dependencies.UserSession
    userSession.create uuid, token, (error, user, sessionToken) =>
      console.error error if error?
      return response.status(500).send(SessionController.ERROR_RETRIEVING_SESSION) if error?
      request.user = user
      response.cookie 'meshblu_auth_uuid', uuid
      response.cookie 'meshblu_auth_token', sessionToken
      response.redirect(callbackUrl ? '/')

module.exports = SessionController
