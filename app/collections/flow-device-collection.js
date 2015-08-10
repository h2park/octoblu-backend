var config = require('../../config/auth'),
  _ = require('lodash'),
  when = require('when'),
  MeshbluHttp = require('meshblu-http');

var FlowDeviceCollection = function (userUUID, userToken) {
  var self = this;
  var User = require('../models/user');

  self.fetch = function () {
    return self.getDevicesByOwner();
  };

  self.getDevicesByOwner = function () {
    var meshbluHttp = new MeshbluHttp({
      server: config.skynet.host,
      port: config.skynet.port,
      uuid: userUUID,
      token: userToken
    });

    var deferred = when.defer();
    meshbluHttp.mydevices({type: 'octoblu:flow'}, function(error, result){
      if (error) {
        deferred.reject(error);
      }
      deferred.resolve(result.devices);
    });
    return deferred.promise;
  };
};

module.exports = FlowDeviceCollection;
