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

  list: (query={}) =>
    query = @allowPublic query
    @collection.find query

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
