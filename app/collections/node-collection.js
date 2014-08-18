var _                 = require('lodash');
var when              = require('when');
var ChannelCollection = require('./channel-collection');

var NodeCollection = function(userUUID){
  var self = this;

  self.fetch = function(){
    var collection = self.getChannelCollection();

    return collection.fetch().then(function(channels){
      return _.map(channels, function(channel){
        return self.convertChannelToNode(channel);
      });
    });
  };

  self.getChannelCollection = function() {
    return new ChannelCollection(userUUID);
  };

  self.convertChannelToNode = function(channel) {
    return _.defaults(channel, {type: 'channel'});
  };

  return self;
};

module.exports = NodeCollection;
