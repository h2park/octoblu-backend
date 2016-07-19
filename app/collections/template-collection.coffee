_ = require 'lodash'
When = require 'when'
octobluDb = require '../lib/database'

class TemplateCollection
  @updateProperties : ['name', 'tags', 'description', 'public', 'flow']
  constructor: (options={}, dependencies={}) ->
    @owner = options.owner
    @collection = dependencies.collection || octobluDb.getCollection 'templates'
    @uuid = dependencies.uuid || require 'node-uuid'

  create: (template={})=>
    @requireUser().then =>
      template.uuid = @uuid.v4()
      template.owner = @owner
      template.created = new Date()
      template.likedBy = template.likedBy || []
      template.description = template.flow.description || ''
    .then =>
      @collection.insert template
    .then =>
      template.uuid

  update: (query={}, template={}) =>
    @requireUser().then =>
      query.owner = @owner
      template = _.pick template, TemplateCollection.updateProperties
    .then =>
      @collection.update(@shimQuery(query), $set: template)
    .then (response) =>
      When.reject(new Error 'could not find a template to update') if response.n == 0

  delete: (query={}) =>
    @requireUser().then =>
      query.owner = @owner
      @collection.remove @shimQuery(query)

  get: (query={}) =>
    query = @allowPublic query
    @collection.findOne query

  list:  (query={}, limit, offset, name) =>
    query = @allowPublic query
    offset = Math.max(0, offset - 1) * limit

    if name?
      @collection.find(query)
      .then (result) ->
        filteredCollection = []
        _.filter result, (item) ->
          if _.includes(item.name.toLowerCase(), name.toLowerCase())
            item.flow = nodes: item.flow.nodes
            filteredCollection.push item
        return filteredCollection

    else
      return @collection.find query unless limit?

      When.promise (resolve, reject) =>
        @collection.originalFind(query).skip(offset).limit limit, (error, docs) =>
          return reject error if error?
          resolve docs

  recent:  (query={}, limit) =>
    query = @allowPublic query
    When.promise (resolve, reject) =>
      @collection.originalFind(query).sort({_id: -1}).limit limit, (error, docs) =>
        return reject error if error?
        resolve docs

  like: (userUuid, bluprintId) =>
    query = {uuid: bluprintId}
    @collection.findOne(query)
      .then (template) =>
        if _.contains template.likedBy, userUuid
          return When.reject(new Error 'bluprint already liked')
        @collection.update(uuid: template.uuid, {$push: likedBy: userUuid})

  unlike: (userUuid, bluprintId) =>
    query = {uuid: bluprintId}
    @collection.findOne(query)
      .then (template) =>
        if _.contains template.likedBy, userUuid
          return @collection.update(uuid: template.uuid, {$pull: likedBy: userUuid})
        When.reject new Error 'Error unliking bluprint'

  allowPublic: (query={}) =>
    query = _.clone query
    if @owner?
      query.owner = @owner unless query.public? || query.uuid?
    else
      query.public = true

    @shimQuery query

  shimQuery: (query) =>
    return query unless query.owner?

    query.$or = [
        { owner: query.owner},
        {'resource.owner.uuid': query.owner}
      ]

    delete query.owner

    query


  requireUser: (errorMsg='a user is required for this operation') =>
    return When.reject new Error(errorMsg) unless @owner?
    When.resolve()

module.exports = TemplateCollection
