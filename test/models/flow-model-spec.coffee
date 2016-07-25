_ = require 'lodash'
MeshbluHttp = require 'meshblu-http'
shmock = require 'shmock'
sinon = require 'sinon'
enableDestroy = require 'server-destroy'

myFlows = require '../data/my-flows'
flowsToMigrate = require '../data/flows-to-migrate'
myOtherFlows = require '../data/my-other-flows'

describe 'Flow Model V2', ->
  beforeEach ->
    @meshblu = shmock 0xd00d
    enableDestroy @meshblu
    @request = get: sinon.stub()
    @dependencies = request: @request
    @sut = require '../../app/models/flow-v2'
    @ownerUUID = 'ownerId'

    @meshbluJSON =
      uuid: 'batman-and-robin'
      token: 'joker-kills-robin'
      server: '127.0.0.1'
      port: 0xd00d

  afterEach (done) ->
    @meshblu.destroy done

  describe '->migrateNoDraftFlows', ->
    describe 'when given a valid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.post('/search/devices')
          .send({owner: 'duckman', flow: {$exists: true}, draft: {$exists: false}, type: 'octoblu:flow'})
          .reply(200, flowsToMigrate)

        @flow1UpdateHandler = @meshblu.patch('/v2/devices/1')
          .send(
            name: "og flow"
            draft: flowsToMigrate[0].flow
            octoblu:
              links: [
                  title: 'Publish IoT App Bluprint'
                  url: 'https://bluprinter.octoblu.dev/bluprints/new/1'
                ])
          .reply(200)
        @flow3UpdateHandler = @meshblu.patch('/v2/devices/3')
          .send(
            name: "sdadad"
            draft: flowsToMigrate[1].flow
            octoblu:
              links: [
                  title: 'Publish IoT App Bluprint'
                  url: 'https://bluprinter.octoblu.dev/bluprints/new/3'
                ])
          .reply(200)
        @sut.migrateNoDraftFlows 'duckman', @meshbluJSON, done

      it 'should migrate the flows', ->
        @flow1UpdateHandler.done()
        @flow3UpdateHandler.done()

  describe '->getFlows', ->
    describe 'when given a valid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.post('/search/devices')
          .send({owner: @ownerUUID, type: 'octoblu:flow'})
          .reply(200, myFlows)

        @sut.getFlows @ownerUUID, @meshbluJSON, (@error, @body) => done()

      it 'should retreive all of my flows', ->
        expect(@body).to.have.lengthOf(4)

      it 'should return the messed-up old flow format', ->
        expectedKeys = ['flowId', 'name', 'online']
        expect(@body[0]).to.contain.keys(expectedKeys)
        expect(@body[1]).to.contain.keys(expectedKeys)
        expect(@body[2]).to.contain.keys(expectedKeys)
        expect(@body[3]).to.contain.keys(expectedKeys)

    describe 'when given an invalid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.post('/search/devices').reply(401)

        @sut.getFlows @ownerUUID, @meshbluJSON, (@error, @body) => done()

      it 'should respond with an error', ->
        expect(@error).to.exist

  describe '->getSomeFlows', ->
    describe 'when given a valid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.post('/search/devices')
          .send({owner: @ownerUUID, type: 'octoblu:flow'})
          .reply(200, myFlows)

        @sut.getSomeFlows @ownerUUID, @meshbluJSON, 2, (@error, @body) => done()

      it 'should retreive some of my flows', ->
        expect(@body).to.have.lengthOf(2)

      it 'should return the messed-up old flow format', ->
        expectedKeys = ['flowId', 'name', 'online']
        expect(@body[0]).to.contain.keys(expectedKeys)
        expect(@body[1]).to.contain.keys(expectedKeys)

    describe 'when given an invalid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.post('/search/devices')
          .send({owner: @ownerUUID, type: 'octoblu:flow'})
          .reply(401)

        @sut.getSomeFlows @ownerUUID, @meshbluJSON, 2, (@error, @body) => done()

      it 'should respond with an error', ->
        expect(@error).to.exist
