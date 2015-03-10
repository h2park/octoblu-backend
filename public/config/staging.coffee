angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'https://login-staging.octoblu.com'
    GOOGLE: 'https://google-oauth-staging.octoblu.com/login'
    FACEBOOK: 'https://facebook-oauth-staging.octoblu.com/login'
    TWITTER: 'https://twitter-oauth-staging.octoblu.com/login'
    GITHUB: 'https://github-oauth-staging.octoblu.com/login'
  }
  .constant 'MESHBLU_HOST', 'wss://meshblu-staging.octoblu.com'
  .constant 'MESHBLU_POST', '443'
