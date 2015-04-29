TemplateController = require '../../app/controllers/template-controller'
When = require 'when'
describe 'TemplateController', ->
  beforeEach ->
    @templateModel =
      findByPublic: sinon.stub().returns When.resolve()

    @res = send: sinon.stub()

    @Template = => return @templateModel
    
    @dependencies = Template: @Template
    @sut = new TemplateController meshblu: {}, @dependencies

  describe '->findByPublic', ->
    it 'should exist', ->
      expect(@sut.findByPublic).to.exist

    describe 'when called', ->
      beforeEach ->
        @sut.findByPublic {query: ''}, @res

      it 'should call Template.findByPublic', ->
        expect(@templateModel.findByPublic).to.have.been.called


    describe 'when called with a query string with a list of tags', ->
      beforeEach ->
        @req =
          query:
             tags: ['espresso', 'americano']

        @sut.findByPublic @req, @res


      it 'should call templateModel.findByPublic with those tags', ->
        expect(@templateModel.findByPublic).to.have.been.calledWith ['espresso', 'americano']

    describe 'when templateModel resolves with templates', ->
      beforeEach (next) ->
        @templateModel.findByPublic.returns When.resolve [{name:'asdf'}, {name: 'bleh'}]
        @req =
          query:
             tags: ['lolas', 'cartel']

        @sut.findByPublic(@req, @res).then => next()

      it 'should respond with the templates', ->
        expect(@res.send).to.have.been.calledWith 200, [ {name: 'asdf'}, {name: 'bleh'} ]

    describe 'when templateModel rejects its promise', ->
      beforeEach (next) ->
        @templateModel.findByPublic.returns When.reject 'error'
        @req =
          query:
             tags: ['green', 'herbal']

        @sut.findByPublic(@req, @res).catch => next()

      it 'should respond with 422 and error', ->
        expect(@res.send).to.have.been.calledWith 422, 'error'
