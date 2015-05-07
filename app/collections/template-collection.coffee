When = require 'when'

class TemplateCollection
  constructor: (options) ->
    @userId = options?.userId

  create: (flow)=>
    When.reject new Error('a user is required in order to create a template')

  hasUser: =>
    @userId?

module.exports = TemplateCollection
