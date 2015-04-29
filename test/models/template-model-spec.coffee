TemplateModel = require '../../app/models/template-model'
When = require 'when'

describe 'TemplateModel', ->
  beforeEach ->
    @Database =
      getCollection: sinon.stub().returns
        find: sinon.stub()

    @Flow = {}
    @dependencies = Database: @Database, Flow: @Flow
    @sut = new TemplateModel @dependencies

  describe '->findByPublic', ->
    it 'should exist', ->
      expect(@sut.findByPublic).to.exist

    describe 'when called without tags', ->
      beforeEach ->
        @sut.findByPublic()

      it 'should call find on itself with the public property equal to "true"', ->
        expect(@sut.find).to.have.been.calledWithMatch public:true

    describe 'when called with tags', ->
      beforeEach ->
        @sut.findByPublic(['whatevs', 'ok'])

      it 'should call find on itself with the public property equal to "true"', ->
        expect(@sut.find).to.have.been.calledWith {public: true, tags: $all: ['whatevs', 'ok']}

    describe 'when find resolves with some templates', ->
      beforeEach (done) ->
        @sut.find.returns When.resolve [ {name: 'doc1'}, {name: 'doc2'} ]
        @sut.findByPublic().then (results) =>
          @results = results
          done()

      it 'should return a promise containing those documents', ->
        expect(@results).to.deep.equal [ {name: 'doc1'}, {name: 'doc2'} ]

    describe 'when find rejects with an error', ->
      beforeEach (done) ->
        @sut.find.returns When.reject 'error'
        @sut.findByPublic().catch (error) =>
          @results = error
          done()

      it 'should return a promise containing those documents', ->
        expect(@results).to.equal 'error'
