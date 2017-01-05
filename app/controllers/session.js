'use strict';

var nodemailer         = require('nodemailer');
var request            = require('request');
var User               = require('../models/user');
var PasswordResetter   = require('../models/password-resetter');

module.exports = function ( app, passport, config ) {

  app.post('/api/reset', function(req, res, next) {
    var passwordResetter = new PasswordResetter;
    passwordResetter.resetByEmail(req.body.email, req.headers.host).then(function(){
      res.sendStatus(201);
    }).catch(function(error){
      res.sendError(error);
    });
  });

  app.put('/api/reset/:token', function(req, res, next){
    User.findByResetToken(req.params.token).then(function(user){
      if(!user){
        return res.status(402).send({error: 'Password reset token is invalid or has expired.', arguments: arguments});
      }

      user.local.password       = User.generateHash(req.body.password);
      user.resetPasswordToken   = null;
      user.resetPasswordExpires = null;

      return User.update({_id: user._id}, user).then(function(returnedUser) {
        return res.sendStatus(204);
      });
    }).catch(function(error){
      return res.status(402).send({error: error});
    });
  });

  app.post('/api/reset-token', function(req, res, next){
    User.resetToken(req.uuid, req.token).then(function(token){
      res.send(token);
    }).catch(function(error){
      res.send(error);
    });
  });
};
