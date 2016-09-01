var request            = require('request'),
    crypto             = require('crypto'),
    url                = require('url'),
    _                  = require('lodash'),
    referrer           = require('./middleware/referrer.js'),
    querystring        = require('querystring'),
    User               = require('../models/user'),
    Channel            = require('../models/channel');
var SecurityController = require('./middleware/security-controller');
var isAuthenticated    = (new SecurityController()).isAuthenticated;
var UserSession        = require('../models/user-session-model');

module.exports = function (app, passport, config) {
    var userSession = new UserSession();
    app.post('/api/auth', passport.authenticate('local'), loginRoute);
    app.get('/api/auth/login', passport.authenticate('local'), loginRoute);

    app.delete('/api/auth', logoutRoute);
    app.get('/api/auth/logout', logoutRoute);
    app.put('/api/auth/accept_terms', isAuthenticated, updateTerms);
    app.put('/api/auth/password', isAuthenticated, updatePassword);

    app.get('/api/auth', function (req, res) {
        res.send(req.user);
    });

    app.get('/auth/logout', logoutAndRedirectRoute);

    function loginRoute(req, res) {
        var user = req.user;

        if (! user || ! user._id) {
            res.send(401, {error: 'unauthorized'});
            return;
        }
        res.send(user);
    }

    function clearCookies(res) {
        res.clearCookie('skynetuuid');
        res.clearCookie('skynettoken');
        res.clearCookie('meshblu_auth_uuid');
        res.clearCookie('meshblu_auth_token');
        res.clearCookie('skynet_auth_uuid');
        res.clearCookie('skynet_auth_token');
    }

    function logoutRoute(req, res) {
        var cookies = req.cookies || {};
        var uuid = req.uuid;
        var token = req.token;
        clearCookies(res);

        delete req.user;

        userSession.invalidateOneTimeToken(uuid, token, function(error){
            if(error) {
              res.sendError(error);
              return
            }

            res.send(204);
        })
    }

    function logoutAndRedirectRoute(req, res) {
        clearCookies(res);
        delete req.user;

        res.redirect('/');
    }

    function updatePassword (req, res) {
        var oldPassword, newPassword;

        oldPassword = req.body.oldPassword;
        newPassword = req.body.newPassword;

        User.updatePassword(req.user, oldPassword, newPassword).then(function(){
            return res.send(204);
        }).catch(function(){
            return res.send(422, {errors: {oldPassword: ['is incorrect.']}});
        });
    }

    function updateTerms (req, res) {
        User.acceptTerms(req.user, req.body.accept_terms).then(function(){
            return res.send(204);
        })
        .catch(function(err){
            return res.send(422, {errors: {accept_terms: ['must be true']}});
        })
    }

    var getApiHashCode = function (clientSecret, requestCode) {
        var toHash = clientSecret + "|" + requestCode;
        return crypto.createHash("sha256")
            .update(toHash)
            .digest("hex");
    };

    var generateCSRFToken = function () {
        return crypto.randomBytes(18).toString('base64')
            .replace(/\//g, '-').replace(/\+/g, '_');
    };

    var handleOauth1 = function (channelid, req, res, next) {
        var user = req.user,
            token = req.param('oauth_token'),
            verifier = req.param('oauth_verifier');

        User.addOrUpdateApiByChannelId(user, channelid, 'oauth', null, token, null, verifier, null);
        User.update({_id: user._id}, user).then(function () {
            return handleApiCompleteRedirect(res, channelid);
        }).catch(function(error){
            return handleApiCompleteRedirect(res, channelid, error);
        });
    };

    var getOauth1Instance = function (req, api) {
        var OAuth = require('oauth');
        var creds = getOAuthCredentials(api.oauth);
        return new OAuth.OAuth(
            creds.requestTokenURL,
            creds.accessTokenURL,
            creds.key,
            creds.secret,
            creds.version,
            getOAuthCallbackUrl(req, api._id),
            'HMAC-SHA1'
        );
    };

    var getOAuthCredentials = function(oauth) {
        return oauth[process.env.NODE_ENV] || oauth;
    };

    var getOauth2AccessInstance = function (api) {
        var creds = getOAuthCredentials(api.oauth);
        var oauth_creds = {
            clientID: creds.clientId || creds.key,
            clientSecret: creds.secret,
            site: creds.baseURL,
            tokenPath: creds.accessTokenPath
        };
        return require('simple-oauth2')(oauth_creds);
    };

    var getOauth2TokenInstance = function (api) {
        var creds = getOAuthCredentials(api.oauth);
        var oauth_creds = {
            clientID: creds.clientId || creds.key,
            clientSecret: creds.secret,
            site: creds.tokenBaseURL || creds.baseURL,
            tokenPath: creds.authTokenPath
        };
        return require('simple-oauth2')(oauth_creds);
    };

    var getOauth2Instance = function (api) {
        var creds = getOAuthCredentials(api.oauth);
        var oauth_creds = {
            clientID: creds.clientId || creds.key,
            clientSecret: creds.secret,
            site: creds.baseURL,
            tokenPath: creds.authTokenPath,
            scope: creds.scope,
            authorizationPath : creds.accessTokenPath
        };
        return require('simple-oauth2')(oauth_creds);
    };

    var getOAuthCallbackUrl = function (req, channelid) {
        var protocol = req.protocol
        if (req.headers.host.indexOf('octoblu.com') > -1) {
          protocol = 'https'
        }
        return req.protocol + '://' + req.headers.host + '/api/auth/' + channelid + '/callback/custom';
    };

    var handleApiCompleteRedirect = function (res, channelid, err) {
        if (!err) {
            return res.redirect('/connect/nodes/channel/' + channelid);
        } else {
            console.error(err.stack);
            return res.redirect('/node-wizard/node-wizard/add-channel/'+channelid+'/oauth');
        }
    };

    var parseHashResponse = function (body) {
        var ar1 = body.split('&');
        var result = {};
        for (var l = 0; l < ar1.length; l++) {
            var pair = ar1[l].split('=');
            result[pair[0]] = pair[1];
        }
        return result;
    };

    app.get('/api/auth/:id/custom', function (req, res) {
        var channelid = req.params.id;
        var user = req.user;

        Channel.findById(channelid).then(function (api) {
            var creds = getOAuthCredentials(api.oauth);
            if(creds.version==='1.0' && creds.is0LegAuth==true) {
                // add api to user record
                var token = '0LegAuth';
                User.overwriteOrAddApiByChannelId(user, api._id, api.type, {authtype: 'oauth', token: token});
                User.update({_id: user._id}, user).then(function (err) {
                    res.redirect('/connect/nodes/channel/' + api._id);
                });
            } else if (creds.version === '2.0') {
                if (creds.isManual) { // shoot yourself
                    // manually handle oauth...
                    var csrfToken = generateCSRFToken();
                    var timestamp = (new Date()).getTime();
                    var nonce = (new Date()).getTime() * 1000;

                    res.cookie('csrf', csrfToken);
                    var query;
                    if (creds.useOAuthParams) {
                        query = {
                            oauth_consumer_key: creds.clientId,
                            response_type: 'code',
                            oauth_signature: csrfToken,
                            oauth_signature_method: 'HMAC-SHA1',
                            oauth_timestamp: timestamp,
                            oauth_nonce: nonce,
                            oauth_callback: getOAuthCallbackUrl(req, api._id)
                        };
                    } else {
                        query = {
                            client_id: creds.clientId,
                            response_type: 'code',
                            state: csrfToken,
                            redirect_uri: getOAuthCallbackUrl(req, api._id)
                        };
                    }

                    if(creds.auth_use_client_id_value) {
                        query.client_id = creds.auth_use_client_id_value;
                    }
                    if(creds.auth_use_api_key === true && creds.clientId) {
                        query.api_key = creds.clientId;
                    }

                    if (creds.scope && creds.scope.length > 0) {
                        query.scope = creds.scope;
                    }

                    var redirectURL = url.format({
                        protocol: creds.protocol,
                        hostname: creds.host,
                        pathname: creds.authTokenPath,
                        query: query
                    });
                    res.redirect(url.format({
                        protocol: creds.protocol,
                        hostname: creds.host,
                        pathname: creds.authTokenPath,
                        query: query
                    }));

                } else {
                    var oauth2 = getOauth2Instance(api);
                    var authorization_uri = oauth2.AuthCode.authorizeURL({
                        redirect_uri: getOAuthCallbackUrl(req, api._id),
                        scope: creds.scope,
                        state: '3(#0/!~'
                    });
                    res.redirect(authorization_uri);
                }
            } else {
                // oauth 1.0..
                var oa = getOauth1Instance(req, api);
                oa.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
                    if (error) {
                        console.error(error.stack);
                        res.send('yeah no. didn\'t work.')
                    }
                    else {
                        req.session.oauth = {};
                        req.session.oauth.token = oauth_token;
                        req.session.oauth.token_secret = oauth_token_secret;
                        var callbackURL = getOAuthCallbackUrl(req, api._id);

                        var authURL = creds.authTokenURL + '?oauth_token=' + oauth_token;

                        if (api.name != 'Tumblr') {
                            authURL += '&oauth_consumer_key=' + creds.key
                                + '&callback=' + callbackURL;
                        }
                        res.redirect(authURL);
                    }
                });
            }

        });

    });
    app.get('/api/auth/:id/callback/custom', isAuthenticated, function (req, res) {
        // handle oauth response....
        var channelid = req.params.id;
        var user = req.user;

        Channel.findById(channelid).then(function (api) {
            var creds = getOAuthCredentials(api.oauth);
            if (creds.version == '2.0') {
                if (creds.isManual) {
                    if (req.query.error) {
                        return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
                    }
                    // check CSRF token
                    if (creds.checkCSRFOnCallback && (req.query.state !== req.cookies.csrf || req.query.state.indexOf(req.cookies.csrf) < 0)) {
                        return res.status(401).send('CSRF token mismatch, possible cross-site request forgery attempt.');
                    }

                    var form = {
                        code: req.query.code,
                        grant_type: creds.grant_type || 'client_credentials',
                        redirect_uri: getOAuthCallbackUrl(req, api._id)
                    };
                    if (api.name === 'Bitly') {
                        delete form.grant_type;
                    }
                    if (creds.accessTokenIncludeClientInfo || api.name === 'Box' || api.name === 'GoogleDrive' || api.name == 'Facebook') {
                        form.client_id = creds.clientId;
                        form.client_secret = creds.secret;
                    }
                    if (api.name === 'Smartsheet') {
                        form.client_id = creds.clientId;
                        form.hash = getApiHashCode(creds.secret, req.query.code);
                    }

                    var auth = {
                        user: creds.clientId,
                        pass: creds.secret
                    };

                    var query = {};
                    if(creds.auth_use_client_id_value) {
                        form.client_id = creds.auth_use_client_id_value;
                    }
                    if(creds.auth_use_api_key === true && creds.clientId) {
                        query.api_key = creds.clientId;
                    }

                    if (api.name === 'Bitly') auth = null;
                    if (api.name === 'Paypal') {
                        delete form.redirect_uri;
                        delete form.code;
                    }

                    // exchange access code for bearer token
                    var opts = {
                        form: form,
                        auth: auth,
                        qs: query
                    };
                    request.post(creds.accessTokenURL, opts, function (error, response, body) {
                        var data;

                        if (response.statusCode != '200') {
                            return res.send('ERROR: HTTP Status ' + response.statusCode);

                        } else if (body == 'INVALID_LOGIN') {
                            return res.send('ERROR: ' + body);
                        }

                        if (api.name === 'Facebook' || api.name === 'Bitly') {
                            data = parseHashResponse(body);
                        } else {
                            data = JSON.parse(body);
                        }

                        if (data.error) {
                            return res.send('ERROR: ' + data.error);
                        }

                        // extract bearer token
                        var token = data.access_token;

                        if (token) {
                            User.overwriteOrAddApiByChannelId(user, api._id, {authtype: 'oauth', token: token});
                            User.update({_id: user._id}, user).then(function (err) {
                                res.redirect('/design');
                            });
                        }
                    });
                } else {
                    var OAuth2 = getOauth2TokenInstance(api);
                    OAuth2.AuthCode.getToken({
                        code: req.query.code,
                        redirect_uri: getOAuthCallbackUrl(req, api._id),
                        client_id : creds.clientId || creds.key,
                        client_secret : creds.secret
                    }, function (error, result) {
                        if (error) {
                            console.error('Access Token Error', error.stack);
                            return res.sendError(error);
                        }

                        var token = result;
                        token = token.access_token || token;
                        if(_.contains(result, 'access_token')) {
                            token = querystring.parse(result).access_token;
                        }

                        User.overwriteOrAddApiByChannelId(user, api._id, {authtype: 'oauth', token: token});
                        User.update({_id: user._id}, user).then(function (err) {
                            res.redirect('/design');
                        });
                    });
                }

            } else {
                // oauth 1.0 here
                req.session.oauth.verifier = req.query.oauth_verifier;
                var oauth = req.session.oauth;

                var oa = getOauth1Instance(req, api);
                oa.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
                    function (error, oauth_access_token, oauth_access_token_secret, results) {
                        if (error) {
                            console.error(error.stack);
                            res.redirect(500, '/node-wizard/node-wizard/add-channel/'+channelid+'/oauth');
                        } else {
                            User.addOrUpdateApiByChannelId(user, channelid, 'oauth', null,
                                oauth_access_token, oauth_access_token_secret, null, null);
                            User.update({_id : user._id}, user).then(function (err) {
                                return handleApiCompleteRedirect(res, channelid, err);
                            });
                        }
                    }
                );
            }
        });

    });
    function completeLogin(req, res){
        res.redirect('/home');
    }
};
