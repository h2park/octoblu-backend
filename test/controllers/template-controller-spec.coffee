TemplateController = require '../../app/controllers/template-controller'
When = require 'when'
describe 'TemplateController', ->
  beforeEach ->
    @templateModel =
      findByPublic: sinon.stub().returns When.resolve()
      like: sinon.stub().returns When.resolve()
      unlike: sinon.stub().returns When.resolve()

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
        return

      it 'should call Template.findByPublic', ->
        expect(@templateModel.findByPublic).to.have.been.called

    describe 'when called with a query string with a list of tags', ->
      beforeEach ->
        @req =
          query:
             tags: ['espresso', 'americano']

        @sut.findByPublic @req, @res, => @res.send req.templates
        return

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
        return

      it 'should respond with the templates', ->
        expect(@res.send).to.have.been.calledWith 200, [ {name: 'asdf'}, {name: 'bleh'} ]

    describe 'when templateModel rejects its promise', ->
      beforeEach (next) ->
        @templateModel.findByPublic.returns When.reject new Error('error')
        @req =
          query:
             tags: ['green', 'herbal']

        @sut.findByPublic(@req, @res, next).then => next()
        return

      it 'should respond with 422 and error', ->
        expect(@res.send).to.have.been.calledWith 422, 'error'

  xdescribe '->like', ->
    it 'should exist', ->
      expect(@sut.like).to.exist

    describe 'when called', ->
      beforeEach ->
        @req =
          uuid: 'jobots'
          params:
            id: 'dtphx'
        @sut.like(@req, @res).then => @res.send 201
        return

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
        return

      it 'should respond with 201', ->
        expect(@res.send).to.have.been.calledWith 201

    describe 'when templateModel rejects the promise', ->
      beforeEach ->
        @templateModel.like.returns When.reject new Error 'NO LIKE'
        @req =
          uuid: 'cartel'
          params:
            id: 'espresso'
        @sut.like(@req, @res).catch (error) => @res.send(422, error.message)
        return

      it 'should respond with 422 and the error', ->
        expect(@res.send).to.have.been.calledWith 422, 'NO LIKE'

  xdescribe '->unlike', ->
    it 'should exist', ->
      expect(@sut.unlike).to.exist

    describe 'when called', ->
      beforeEach ->
        @req =
          uuid: 'youme'
          params:
            id: 'ghost'
        @sut.unlike(@req, @res).then => @res.send 201
        return

      it 'should call templateModel.unlike with the bluprintID and userUUID', ->
        expect(@templateModel.unlike).to.have.been.calledWith @req.uuid, @req.params.id

    describe 'when templateModel resolves the promise', ->
      beforeEach ->
        @templateModel.unlike.returns When.resolve {}
        @req =
          uuid: 'little sister'
          params:
            id: 'big daddy'
        @sut.unlike(@req, @res).then => @res.send 200
        return

      it 'should respond with 200', ->
        expect(@res.send).to.have.been.calledWith 200

    describe 'when templateModel rejects the promise', ->
      beforeEach ->
        @templateModel.unlike.returns When.reject new Error 'YOU CANNOT ESCAPE MY LOVE'
        @req =
          uuid: 'adam'
          params:
            id: 'plasmids'
        @sut.unlike(@req, @res).catch (error) => @res.send(422, error.message)
        return

      it 'should respond with 422 and the error', ->
        expect(@res.send).to.have.been.calledWith 422, 'YOU CANNOT ESCAPE MY LOVE'
