class TemplateCollection
  constructor: (options) ->
    @userId = options?.userId

  create: =>

  hasUser: =>
    @userId?

module.exports = TemplateCollection
