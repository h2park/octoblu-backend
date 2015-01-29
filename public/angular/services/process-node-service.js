angular.module('octobluApp')
  .service('ProcessNodeService', function ($q, deviceService, skynetService) {
  'use strict';
  return {
    
    getProcessDevices: function() {  
      var self, skynetConnection;
      self = this;
      return $q.all([
        self.getSkynetConnection(),
        self.getDevices()
      ]).then(function(results) {
        skynetConnection = results[0];
        self.devices = results[1];
        _.map(self.devices, skynetConnection.subscribe);
        self.listenToMessages()
        return self.devices;
      });
    },

    listenToMessages: function() {
      var self = this;
      return self.getSkynetConnection().then(function(skynetConnection){
        skynetConnection.on('message', function(message) {
          self.incrementMessagesReceivedCount(message);
          self.incrementMessagesSentCount(message);
        });
      });
    },

    incrementMessagesReceivedCount: function(message) {
      var self = this;
      if(!_.isArray(message.devices)){
        message.devices = [message.devices];
      }
      var devices = _.filter(self.devices, function(device) {
        if(_.contains(message.devices, device.uuid)){
          return device; 
        }
      });

      _.each(devices, function(device) {
        device.messagesReceived = device.messagesReceived || 0;
        device.messagesReceived++;
      });
    },

    incrementMessagesSentCount: function(message) {
      var self = this;
      var devices = _.filter(self.devices, function(device) {
        if(message.fromUuid === device.uuid){
          return device; 
        }
      });

      _.each(devices, function(device) {
        device.messagesSent = device.messagesSent || 0;
        device.messagesSent++;
      });
    },

    getDevices: function() {
      return deviceService.getDevices().then(function(devices){
        _.each(devices, function(device){
          device.messagesReceived = 0;
        });
        return devices;
      });
    },

    getSkynetConnection: function() {
      return skynetService.getSkynetConnection()
    },

    stopProcess: function(processUUID) {
      this.getSkynetConnection().then(function(skynetConnection){
        skynetConnection.message(processUUID, null, {topic: 'device-stop'});
      });
    },

    startProcess: function(processUUID) {
      this.getSkynetConnection().then(function(skynetConnection){
        skynetConnection.message(processUUID, null, {topic: 'device-start'});
      });
    }
  };
});
