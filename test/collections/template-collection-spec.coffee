TemplateCollection = require '../../app/collections/template-collection'

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
        @sut = new TemplateCollection({userId: 5})

      it 'should return true', ->
        expect(@sut.hasUser()).to.be.true



  describe 'TemplateCollection#create', ->
    it 'should exist', ->
      expect(@sut.create).to.exist
