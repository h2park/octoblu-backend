TemplateCollection = require '../../app/collections/template-collection'
TestDatabase = require '../test-database'
When = require 'when'

describe 'TemplateCollection', ->
  beforeEach (done)->
    @uuid = v4: sinon.stub()
    @dependencies = {uuid: @uuid}
    TestDatabase.open (error, database) =>
      @collection = database.templates
      @dependencies.collection = @collection
      done error

    @sut = new TemplateCollection()

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->create', ->
    it 'should exist', ->
      expect(@sut.create).to.exist

    describe "when called and hasUser returns false", ->
      it 'should reject its promise with an error saying a user is required in order to create a template', ->
        @sut.create().catch (error) =>
          expect(error).to.exist

    describe "when called and hasUser returns true", ->
      beforeEach ->
        @sut = new TemplateCollection({owner: 'Michael'}, @dependencies)

      it 'should insert template into the database', ->
        @sut.create(name: 'repetered').then =>
          @collection.find(name: 'repetered')
          .then (templates) => expect(templates.length).to.equal 1

      it 'should set the owner of the template', ->
        @sut.create(name: 'repetered').then =>
          @collection.findOne(name: 'repetered')
          .then (template) => expect(template.owner).to.equal 'Michael'

      it 'should insert a different template into the database', ->
        @sut.create(name: 'awesomepeter').then =>
          @collection.find(name: 'awesomepeter')
          .then (records) => expect(records.length).to.equal 1

      describe 'when creating a template and the uuid generator generates "ID1"', ->
        beforeEach ->
          @uuid.v4.returns 'ID1'

        it 'should give the template that uuid', ->
          @sut.create(name: 'repetered').then =>
            @collection.findOne(name: 'repetered')
            .then (template) => expect(template.uuid).to.equal 'ID1'

      describe 'when creating a template and the uuid generator generates "ID2"', ->
        beforeEach ->
          @uuid.v4.returns 'ID2'

        it 'should give the template that uuid', ->
          @sut.create(name: 'repetered').then =>
            @collection.findOne(name: 'repetered')
            .then (template) =>
              expect(template.uuid).to.equal 'ID2'

    describe 'when constructed with a different uuid', ->
      beforeEach ->
          @sut = new TemplateCollection({owner: 'Aaron'}, @dependencies)

      it 'should set the owner of the template', ->
        @sut.create(name: 'repetered').then =>
          @collection.findOne(name: 'repetered')
        .then (template) =>
          expect(template.owner).to.equal 'Aaron'

  describe '->update', ->
    it 'should exist', ->
      expect(@sut.update).to.exist

    describe "We don't have a user", ->
      it 'should reject its promise with an error', ->
        @sut.update().catch (error) =>
          expect(error).to.exist

    describe "when called and the user owns the template", ->
      beforeEach () ->
        @sut = new TemplateCollection({owner: 'Erik'}, @dependencies)
        @collection.insert uuid: 2, name: 'reaaroned', owner: 'Erik'

      it 'should update template in the database', ->
        @sut.update({uuid: 2}, {name: 'repetered'}).then =>
          @collection.find(name: 'repetered')
          .then (templates) => expect(templates.length).to.equal(1)

      describe "when called and the template doesn't exist", ->
        beforeEach ->
          @sut = new TemplateCollection({owner: 1}, @dependencies)
          @collection.insert(
            uuid: 3
            owner: 1
            name: 'reaaroned'
          )

        it 'shouldn\'t update template in the database', ->
          @sut.update({uuid: 4}, {name: 'repetered'}).then =>
            @collection.find(name: 'repetered')
            .then (templates) => expect(templates.length).to.be.empty

      describe "when called and user doesn't own the template", ->
        beforeEach ->
            @sut = new TemplateCollection({owner: 1}, @dependencies)
            @collection.insert(
              uuid: 3
              owner: 2
              name: 'reaaroned'
            )

        it "shouldn't update template in the database", ->
          @sut.update({uuid: 3}, {name: 'repetered'}).then =>
            @collection.find(name: 'repetered')
              .then (templates) => expect(templates).to.be.empty

      describe "When called with a bunch of data", ->
        beforeEach ->
          @sut = new TemplateCollection {owner: 1}, @dependencies
          oldTemplate =
            uuid: 3
            owner: 1
            name: 'reaaroned'
            flow: 'whatevs'
            public: true

          newTemplate =
            uuid: 5
            name: 'mine'
            owner: 44
            tags: ['hey', 'lo']
            flow: 'simian'
            public: false
            description: 'basically a monkey'

          @collection.insert(oldTemplate)
            .then =>
              @sut.update({uuid: 3}, newTemplate)
            .then =>
              @collection.findOne(name: 'mine')
            .then (template) =>
               @template = template

        it "should update the name", ->
          expect(@template.name).to.equal 'mine'

        it "should update the tags", ->
          expect(@template.tags).to.deep.equal ['hey', 'lo']

        it "should update public", ->
          expect(@template.public).to.equal false

        it "should update the description", ->
          expect(@template.description).to.equal 'basically a monkey'


        it "should not update the uuid", ->
          expect(@template.uuid).to.equal 3

        it "should not update the owner", ->
          expect(@template.owner).to.equal 1
