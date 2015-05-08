When = require 'when'
class TemplateTransformer

  constructor: (dependencies) ->
    {@User} = dependencies || require '../models/user'

  addOwnerName: (bluprint) =>
    @User.findBySkynetUUID(bluprint.owner).then (user) =>
      if user.firstName?
        bluprint.ownerName = "#{user.firstName} #{user.lastName?[0]}."
      else
        bluprint.ownerName = 'Anonymous'

      bluprint

  addOwnerNames: (bluprints) =>
    When.map bluprints, @addOwnerName

module.exports = TemplateTransformer
