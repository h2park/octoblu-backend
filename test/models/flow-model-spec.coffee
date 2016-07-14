_ = require 'lodash'
MeshbluHttp = require 'meshblu-http'
shmock = require 'shmock'
sinon = require 'sinon'
enableDestroy = require 'server-destroy'
myFlows = require '../data/my-flows'

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

  describe '->getFlows', ->
    describe 'when given a valid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.get('/mydevices').reply(200, myFlows)
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
        @meshblu.get('/mydevices').reply(401, 'not sure')
        @sut.getFlows @ownerUUID, @meshbluJSON, (@error, @body) => done()

      it 'should respond with an error', ->
        expect(@error).to.exist

  describe '->getSomeFlows', ->
    describe 'when given a valid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.get('/mydevices').reply(200, myFlows)
        @sut.getSomeFlows @ownerUUID, @meshbluJSON, 2, (@error, @body) => done()

      it 'should retreive some of my flows', ->
        expect(@body).to.have.lengthOf(2)

      it 'should return the messed-up old flow format', ->
        expectedKeys = ['flowId', 'name', 'online']
        expect(@body[0]).to.contain.keys(expectedKeys)
        expect(@body[1]).to.contain.keys(expectedKeys)

    describe 'when given an invalid Meshblu config', ->
      beforeEach (done) ->
        @meshblu.get('/mydevices').reply(401, 'not sure')
        @sut.getSomeFlows @ownerUUID, @meshbluJSON, 2, (@error, @body) => done()

      it 'should respond with an error', ->
        expect(@error).to.exist
  
