TemplateController = require '../../app/controllers/template-controller'
When = require 'when'
describe 'TemplateController', ->
  beforeEach ->
    @templateModel =
      findByPublic: sinon.stub().returns When.resolve()
      like: sinon.stub().returns When.resolve()

    @res = send: sinon.stub()

    @Template = => return @templateModel

    @dependencies = Template: @Template
    @sut = new TemplateController meshblu: {}, @dependencies

  describe '->findByPublic', ->
    it 'should exist', ->
      expect(@sut.findByPublic).to.exist

    describe 'when called', ->
      beforeEach ->
        @sut.findByPublic {query: ''}, @res, => @res.send req.templates

      it 'should call Template.findByPublic', ->
        expect(@templateModel.findByPublic).to.have.been.called


    describe 'when called with a query string with a list of tags', ->
      beforeEach ->
        @req =
          query:
             tags: ['espresso', 'americano']

        @sut.findByPublic @req, @res, => @res.send req.templates


      it 'should call templateModel.findByPublic with those tags', ->
        expect(@templateModel.findByPublic).to.have.been.calledWith ['espresso', 'americano']

    describe 'when templateModel resolves with templates', ->
      beforeEach (next) ->
        @templateModel.findByPublic.returns When.resolve [{name:'asdf'}, {name: 'bleh'}]
        @req =
          query:
             tags: ['lolas', 'cartel']

        @sut.findByPublic @req, @res, =>
          @res.send 200, @req.templates
          next()

      it 'should respond with the templates', ->
        expect(@res.send).to.have.been.calledWith 200, [ {name: 'asdf'}, {name: 'bleh'} ]

    describe 'when templateModel rejects its promise', ->
      beforeEach (next) ->
        @templateModel.findByPublic.returns When.reject new Error('error')
        @req =
          query:
             tags: ['green', 'herbal']

        @sut.findByPublic(@req, @res, next).then => next()

      it 'should respond with 422 and error', ->
        expect(@res.send).to.have.been.calledWith 422, 'error'

  describe '->like', ->
    it 'should exist', ->
      expect(@sut.like).to.exist

    describe 'when called', ->
      beforeEach ->
        @req =
          uuid: 'jobots'
          params:
            id: 'dtphx'
        @sut.like(@req, @res).then => @res.send 201

      it 'should call templateModel.like with the bluprintID and userUUID', ->
        expect(@templateModel.like).to.have.been.calledWith @req.uuid, @req.params.id

    describe 'when templateModel resolves the promise', ->
      beforeEach ->
        @templateModel.like.returns When.resolve {}
        @req =
          uuid: 'cartel'
          params:
            id: 'espresso'
        @sut.like(@req, @res).then => @res.send 201

      it 'should respond with 201', ->
        expect(@res.send).to.have.been.calledWith 201

    describe 'when templateModel rejects the promise', ->
      beforeEach ->
        @templateModel.like.returns When.reject new Error 'Error'
        @req =
          uuid: 'cartel'
          params:
            id: 'espresso'
        @sut.like(@req, @res).catch (error) => @res.send(422, error.message)

      it 'should respond with 422 and the error', ->
        expect(@res.send).to.have.been.calledWith 422, 'Error'
