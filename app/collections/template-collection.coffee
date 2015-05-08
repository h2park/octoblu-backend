_ = require 'lodash'
When = require 'when'

class TemplateCollection
  constructor: (options={}, dependencies={}) ->
    @owner = options.owner
    @collection = dependencies.collection
    @uuid = dependencies.uuid

  create: (template={})=>
    return When.reject new Error('a user is required in order to create a template') unless @hasUser()
    template.uuid = @uuid.v4()
    template.owner = @owner

    @collection.insert template

  update: (query={}, template) =>
    return When.reject new Error('a user is required in order to update a template') unless @hasUser()
    query.owner = @owner
    template = _.pick template, 'name', 'tags', 'description'
    @collection.update query, $set: template


  hasUser: =>
    @owner?

module.exports = TemplateCollection
