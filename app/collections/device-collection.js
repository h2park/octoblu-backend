var config = require('../../config/auth'),
  _ = require('lodash'),
  when = require('when'),
  MeshbluHttp = require('meshblu-http');

var DeviceCollection = function (userUUID, userToken) {
  var self = this;
  var User = require('../models/user');

  self.fetch = function () {
    return self.fetchAll().then(function(devices){
      return _.reject(devices, function(device){
        return device.type === 'octoblu:flow' || device.type === 'octoblu:user'
      });
    });
  };

  self.fetchAll = function(){
    return self.getDevicesByOwner();
  };

  self.getDevicesByOwner = function () {
    var meshbluHttp = new MeshbluHttp({
      hostname: config.skynet.hostname,
      port: config.skynet.port,
      protocol: config.skynet.protocol,
      uuid: userUUID,
      token: userToken
    });

    var deferred = when.defer();
    meshbluHttp.mydevices({}, function(error, result){
      if (error) {
        return deferred.reject(error);
      }
      if (!result) {
        return deferred.reject(new Error('no devices found'));
      }
      deferred.resolve(result.devices);
    });
    return deferred.promise;
  };
};

module.exports = DeviceCollection;
