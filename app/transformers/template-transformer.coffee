When = require 'when'
class TemplateTransformer

  constructor: (dependencies) ->
    dependencies = dependencies || {}
    @User = dependencies.User || require '../models/user'

  addOwnerName: (bluprint) =>
    bluprint.owner = bluprint.resource.owner.uuid unless bluprint.owner?
    @User.findBySkynetUUID(bluprint.owner).then (user) =>
      if user.userDevice.octoblu.firstName?
        bluprint.ownerName = "#{user.userDevice.octoblu.firstName} #{user.userDevice.octoblu.lastName?[0]}."
      else
        bluprint.ownerName = 'Anonymous'

      bluprint.tags || []
      bluprint

  addOwnerNames: (bluprints) =>
    When.map bluprints, @addOwnerName


module.exports = TemplateTransformer
