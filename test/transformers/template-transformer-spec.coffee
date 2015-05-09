TemplateTransformer = require '../../app/transformers/template-transformer'
_                   = require 'lodash'
When                = require 'when'

describe 'TemplateTransformer', ->
  beforeEach ->
    @User =
      findBySkynetUUID: sinon.stub()
    @sut = new TemplateTransformer User: @User

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->addOwnerName', ->
    it 'should exist', ->
      expect(@sut.addOwnerName).to.exist

    describe 'when called with a bluprint', ->
      describe 'and the user has a name', ->
        beforeEach ->
          @bluprint =
            name: 'bluprint number one'
            owner: 1234

          @User.findBySkynetUUID.returns When.resolve
            userDevice:
              octoblu:
                firstName: 'self'
                lastName: 'immolation'
          @sut.addOwnerName(@bluprint).then (@result) =>

        it 'should return the bluprint with the owner name added', ->
          expect(@result.ownerName).to.equal 'self i.'

      describe 'and the user does not have a name', ->
        beforeEach ->
          @bluprint =
            name: 'horse'
            owner: 999

          @User.findBySkynetUUID.returns When.resolve userDevice: octoblu: {}
          @sut.addOwnerName(@bluprint).then (@result) =>

        it 'should return the bluprint with the ownerName Anonymous', ->
          expect(@result.ownerName).to.equal 'Anonymous'

      describe 'and the user does not have a userDevice property containing a name', ->
        beforeEach ->
          @bluprint =
            name: 'horse'
            owner: 999

          @User.findBySkynetUUID.returns When.resolve email: 'cats@awesome.com'
          @sut.addOwnerName(@bluprint).then (@result) =>

        it 'should return the bluprint with the ownerName Anonymous', ->
          expect(@result.ownerName).to.equal 'Anonymous'

  describe '->addOwnerNames', ->

    it 'should exist', ->
      expect(@sut.addOwnerNames).to.exist

    describe 'when called with a list of bluprints', ->
      beforeEach ->
        @bluprints = [
          {
            name: 'bluprint number one'
            owner: 123
          },
          {
            name: 'cats'
            owner: 456
          },
          {
            name: 'blue ringed octopus'
            owner: 666
          }
        ]
        @authors =
          123:
            userDevice:
              octoblu:
                firstName: 'self'
                lastName: 'immolation'
          456:
            userDevice:
              octoblu:
                firstName: 'non-lethal'
                lastName: 'shot'
          666:
            userDevice:
              octoblu:
                firstName: 'robotify'
                lastName: 'SCIENCE'

        @User.findBySkynetUUID.onCall(0).returns When.resolve @authors[123]
        @User.findBySkynetUUID.onCall(1).returns When.resolve @authors[456]
        @User.findBySkynetUUID.onCall(2).returns When.resolve @authors[666]
        @sut.addOwnerNames(@bluprints).then (@results) =>

      it 'should return the list of bluprints with the ownerNames properties added', ->
        expect(_.pluck @results, 'ownerName').to.contain.same.members ['self i.', 'non-lethal s.', 'robotify S.']
