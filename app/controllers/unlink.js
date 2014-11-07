'use strict';

var request = require('request'),
    User = request('../models/user');

module.exports = function (app) {
    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        User.update(user).then(function(){
            res.redirect('/home');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        User.update(user).then(function(){
            res.redirect('/home');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        User.update(user).then(function(){
            res.redirect('/home');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user = req.user;
        user.google.token = undefined;
        User.update(user).then(function(){
            res.redirect('/home');
        });
    });
};
