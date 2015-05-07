TemplateCollection = require '../../app/collections/template-collection'
When = require 'when'

describe 'TemplateCollection', ->
  beforeEach ->
    @sut = new TemplateCollection()

  it 'should exist', ->
    expect(@sut).to.exist

  describe 'TemplateCollection.hasUser', ->
    it 'should exist', ->
      expect(@sut.hasUser).to.exist

    describe 'when a TemplateCollection is contructed without a user', ->
      beforeEach ->
        @sut = new TemplateCollection()

      it 'should return false', ->
        expect(@sut.hasUser()).to.be.false

    describe 'when a TemplateCollection is contructed with a user', ->
      beforeEach ->
        @sut = new TemplateCollection userId: 5

      it 'should return true', ->
        expect(@sut.hasUser()).to.be.true

  describe '->create', ->
    it 'should exist', ->
      expect(@sut.create).to.exist

    describe "when called and hasUser returns false", ->
      beforeEach ->
        @sut.hasUser = sinon.stub().returns false

      it 'should reject its promise with an error saying a user is required in order to create a template', ->
        @sut.create().catch (error) =>
          expect(error.message).to.equal 'a user is required in order to create a template'

    describe "when called and hasUser returns true", ->
      beforeEach ->
        @sut.hasUser = sinon.stub().returns true

      it 'should reject its promise with an error saying a user is required in order to create a template', ->
        @sut.create().catch (error) =>
          expect(error.message).to.equal 'a user is required in order to create a template'
