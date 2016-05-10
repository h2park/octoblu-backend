ChannelCollection = require '../collections/channel-collection'

class UserChannelsController
  constructor: ->
    @channelCollection = new ChannelCollection

  list: (req, res) =>
    @channelCollection.fetch(req.user.resource.uuid).then (channels) =>
      res.send channels
    .catch (error) =>
      res.send(error: error.message).status 500

module.exports = UserChannelsController;
