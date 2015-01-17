'use strict';
var octobluDB  = require('../lib/database');
var _          = require('lodash');
var when       = require('when');
var uuid       = require('node-uuid');
var bcrypt     = require('bcrypt');
var crypto     = require('crypto');
var configAuth = require('../../config/auth');
var request    = require('request');
var Channel    = require('./channel');

function UserModel() {
  var collection = octobluDB.getCollection('users');

  var methods = {
    createLocalUser : function(data){
      var self = this;

      var userParams = {
        email: data.email,
        local: {
          email: data.email,
          password: self.generateHash(data.password)
        }
      };
      return self.createUser(userParams);
    },

    createOAuthUser: function(data) {
      var self = this;
      return self.createUser(data);
    },

    createUser: function(data){
      var self = this;
      return self.registerWithMeshblu(data.email).then(function(skynetData){
        if (!skynetData.uuid) {
          throw new Error("Unable to register with Meshblu");
        }

        var userParams = _.extend({}, data, {
          resource: {
            type: 'user',
            uuid: skynetData.uuid
          },
          skynet: {
            uuid: skynetData.uuid,
            token: skynetData.token
          },
          api : []
        });

        return self.insert(userParams).then(function(users){
          return _.first(users);
        });
      });
    },

    findBySkynetUUID : function (skynetuuid) {
      var self = this;
      return self.findOne({'skynet.uuid': skynetuuid});
    },

    findLeanBySkynetUUID : function (skynetuuid) {
      var self = this;
      return self.findOne({'skynet.uuid': skynetuuid});
    },

    findByEmail : function (email) {
      var self = this;
      return self.findOne({ email: email });
    },

    findByResetToken : function (resetToken) {
      var self = this;
      var userQuery;

      userQuery = {
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: (new Date().getTime()) }
      };

      return self.findOne(userQuery);
    },

    findBySkynetUUIDAndToken : function (skynetuuid, skynettoken) {
      var self = this;
      return self.findOne({'skynet.uuid': skynetuuid, 'skynet.token': skynettoken});
    },

    generateHash : function (password) {
      var self = this;
      return bcrypt.hashSync(password, 8);
    },

    acceptTerms : function (user, termsAccepted) {
      var self = this;
      if (!termsAccepted) {
        throw new Error("termsAccepted must be true");
      }

      user.terms_accepted_at = new Date();
      return self.update({_id: user._id}, user);
    },

    addApiAuthorization: function(user, type, options) {
      var self = this;
      self.overwriteOrAddApiByChannelType(user, type, options);
      return self.update({_id: user._id}, user);
    },

    findApiByChannel : function(apis, channel){
      return _.findWhere(apis, function(api){
        var channelid = api.channelid;
        if(channelid && !_.isString(channelid)){
          channelid = channelid.toString();
        }
        return channel.type === api.type || channel._id === channelid;
      });
    },

    overwriteOrAddApi : function(user, channel, options){
      var self = this;
      var index, new_api, old_api, oldUuid;

      if (_.isUndefined(user.api)) {
        user.api = [];
      }

      index = _.findIndex(user.api, { type : channel.type });

      if(index > -1){
        old_api = user.api[index];
        oldUuid = old_api.uuid;
        user.api.splice(index, 1);
      }

      new_api = options || {};
      if(old_api && !new_api.defaultParams && old_api.defaultParams){
        new_api.defaultParams = old_api.defaultParams;
      }
      new_api.channelid = self.ObjectId(channel._id);
      new_api._id = self.ObjectId();

      new_api.type = channel.type;
      new_api.uuid = oldUuid || uuid.v1();

      user.api.push(new_api);
    },

    overwriteOrAddApiByChannelId : function (user, channelid, options) {
      var self = this;

      if(channelid && !_.isString(channelid)){
        channelid = channelid.toString();
      }

      var channel = Channel.syncFindById(channelid);

      self.overwriteOrAddApi(user, channel, options);
    },

    overwriteOrAddApiByChannelType : function (user, type, options) {
      var self = this;

      var channel = Channel.syncFindByType(type);

      self.overwriteOrAddApi(user, channel, options);
    },

    removeApiByChannelId: function(user, channelid){
      // Old channel activations used strings, new ones use ObjectIds
      user.api = _.reject(user.api, {channelid: channelid});
      user.api = _.reject(user.api, {channelid: this.ObjectId(channelid)});
      return this.update({_id: user._id}, user);
    },

    setResetPasswordToken: function(user){
      var self = this;
      user.resetPasswordToken = self.generateToken();
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      return self.update({_id: user._id}, user).then(function(){
        return user;
      });
    },

    updatePassword : function (user, oldPassword, newPassword) {
      var self = this;
      if (!self.validPassword(user, oldPassword)) {
        throw new Error('Password is invalid');
      }
      user.local.password = self.generateHash(newPassword);
      return self.update({_id: user._id}, user);
    },

    validPassword : function (user, password) {
      var self = this;
      return bcrypt.compareSync(password, user.local.password);
    },

    generateToken : function() {
      var self = this;
      return crypto.createHash('sha1').update((new Date()).valueOf().toString() + Math.random().toString()).digest('hex');
    },

    registerWithMeshblu : function(email) {
      var self = this;
      var uri = 'http://' + configAuth.skynet.host + ':' + configAuth.skynet.port + '/devices';
      var params = {
        json: {
          type: 'user',
          email: email
        }
      };

      return when.promise(function(resolve, reject) {
        request.post(uri, params, function(error, response, body) {
          if (error) {
            reject(error);
            return;
          }
          resolve(body);
        });
      });
    }
  };

  return _.extend({}, collection, methods);
}

module.exports = new UserModel();
