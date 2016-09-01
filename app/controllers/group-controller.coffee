Group = require '../models/group-model'

class GroupController
  getGroups: (request, response) =>
    group = new Group request.user.resource.uuid
    group.find request.query.type
      .then (groups) =>
        res.send groups
      .catch (error) =>
        res.sendError error

  getGroupById: (request, response) =>
    group = new Group request.user.resource.uuid
    group.findByUuid request.params.uuid
      .then (group) =>
        return response.sendStatus(404) unless group?
        response.send group
      .catch (error) =>
        res.sendError error

  addGroup: (request, response) =>
    group = new Group request.user.resource.uuid
    group.create request.body.name
      .then (device) =>
        response.send device
      .catch (error) =>
        response.sendError error

  deleteGroup: (request, response) =>
    group = new Group request.user.resource.uuid
    group.removeByUuid request.params.uuid
      .then =>
        response.sendStatus(204)
      .catch (error) =>
        response.sendError error

  updateGroup: (request, response) =>
    uuid = request.params.uuid
    group = new Group request.user.resource.uuid
    group.findByUuid uuid
      .then (group) =>
        return response.sendStatus(404) unless group?

        group.update(request.params.uuid, request.body).then response.status(204).send
      .catch (error) =>
        response.sendError error

  getOperatorsGroup: (request, response) =>
    group = new Group request.user.resource.uuid
    group.ensureOperatorsGroup()
      .then group.getOperatorsGroup
      .then (operatorsGroup) =>
        response.send operatorsGroup
      .catch (error) =>
        response.sendError error

  getGroupsContainingResource: (request, response) =>
    group = new Group request.user.resource.uuid
    group.findGroupsContainingResource(req.params.uuid)
      .then (groups) =>
        response.send groups
      .catch (error) =>
        res.sendError error

module.exports = GroupController
