class LoginController
  constructor: (AUTHENTICATOR_URIS, $location) ->
    protocol = $location.protocol()
    host     = $location.host()
    port     = $location.port()
    
    loginParams = $.param callback: "#{protocol}://#{host}:#{port}/api/session"

    @emailPasswordLoginUri = AUTHENTICATOR_URIS.EMAIL_PASSWORD + '?' + loginParams
    @googleLoginUri        = AUTHENTICATOR_URIS.GOOGLE + '?' + loginParams
    @twitterLoginUri       = AUTHENTICATOR_URIS.TWITTER + '?' + loginParams
    @githubLoginUri        = AUTHENTICATOR_URIS.GITHUB + '?' + loginParams
    @facebookLoginUri      = AUTHENTICATOR_URIS.FACEBOOK + '?' + loginParams

angular.module('octobluApp').controller 'LoginController', LoginController
