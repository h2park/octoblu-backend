_ = require 'lodash'
When = require 'when'

class TemplateCollection
  @updateProperties : ['name', 'tags', 'description', 'public']
  constructor: (options={}, dependencies={}) ->
    @owner = options.owner
    @collection = dependencies.collection
    @uuid = dependencies.uuid

  create: (template={})=>
    @requireUser().then =>
      template.uuid = @uuid.v4()
      template.owner = @owner
    .then =>
      @collection.insert template

  update: (query={}, template={}) =>
    @requireUser().then =>
      query.owner = @owner
      template = _.pick template, TemplateCollection.updateProperties
    .then =>
      @collection.update query, $set: template

  delete: (query={}) =>
    @requireUser().then =>
      query.owner = @owner
      @collection.remove query

  get: (query={}) =>
    query = @allowPublic query
    @collection.findOne query

  list: (query={}) =>
    query = @allowPublic query
    @collection.find query

  allowPublic: (query) =>
    query = _.clone query
    if @owner?
      query.owner = @owner
    else
      query.public = true
    query

  requireUser: (errorMsg='a user is required for this operation') =>
    return When.reject new Error(errorMsg) unless @owner?
    When.resolve()

module.exports = TemplateCollection
