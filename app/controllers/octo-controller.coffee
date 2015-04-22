OctoModel = require '../models/octo-model'

class OctoController
  constructor: (meshblu, dependecies={}) ->
    @octoModel = dependecies.OctoModel ? new OctoModel meshblu: meshblu

  create: (request, response) =>
    @octoModel.create request.user.resource.uuid, (newDevice) =>
      response.status(201).send newDevice

  delete: (request, response) =>
    {octoUuid} = request.params
    @octoModel.delete octoUuid, =>
      response.status(200).end()

module.exports = OctoController
