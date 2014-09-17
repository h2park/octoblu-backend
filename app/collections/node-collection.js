var _ = require('lodash');
var when = require('when');
var ChannelCollection  = require('./channel-collection');
var DeviceCollection   = require('./device-collection');
var NodeTypeCollection = require('./node-type-collection');
var config = require('../../config/auth')();

var NodeCollection = function (userUUID) {
  var self = this;

  self.mergedNodes = function(){
    return when.all([self.getDevices(), self.getChannels()]).then(function (nodeResults) {
      return _.flatten(nodeResults, true);
    });
  };

  self.fetch = function () {
    return self.mergedNodes().then(self.mergeNodeTypes);
  };

  self.getChannelCollection = function () {
    return new ChannelCollection();
  };

  self.getDevices = function () {
    var deviceCollection = self.getDeviceCollection();

    return deviceCollection.fetch()
    .then(function (devices) {
      return _.map(devices, self.convertDeviceToNode);
    });
  };

  self.getChannels = function () {
    var channelCollection = self.getChannelCollection();

    return channelCollection.fetch(userUUID)
    .then(function (channels) {
      return _.map(channels, self.convertChannelToNode);
    });
  };

  self.mergeNodeTypes = function(nodes){
    var nodeTypeCollection = self.getNodeTypeCollection();
    return nodeTypeCollection.fetch().then(function(nodeTypes){
      return _.map(nodes, function(node){
        var nodeType;

        nodeType = _.findWhere(nodeTypes, function(nodeType) {
          if(node.subtype){
            return nodeType.type === node.subtype;
          }
          return nodeType.type === node.type;
        });

        if (nodeType) {
          logo = nodeType.logo;
        }
        return _.extend({nodeType: {logo: logo}}, node);
      });
    });
  };

  self.convertChannelToNode = function(channel) {
    return _.extend({}, channel, {
      category: 'channel',
      online: true,
      logo: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/' + channel.type.replace(':', '/') + '.svg'
    });
  };

  self.convertDeviceToNode = function (device) {
    return _.extend({}, device, {
      category: 'device',
      logo: 'https://s3-us-west-2.amazonaws.com/octoblu-icons/' + device.type.replace(':', '/') + '.svg'
    });
  };

  self.getDeviceCollection = function () {
    return new DeviceCollection(userUUID);
  };

  self.getNodeTypeCollection = function () {
    return new NodeTypeCollection(userUUID);
  };

  return self;
};

module.exports = NodeCollection;
