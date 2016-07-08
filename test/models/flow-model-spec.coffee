_ = require 'lodash'
MeshbluHttp = require 'meshblu-http'
shmock = require 'shmock'
sinon = require 'sinon'
enableDestroy = require 'server-destroy'
myFlows = require '../data/my-flows'

describe.only 'Flow Model', ->
  beforeEach ->
    @meshblu = shmock 0xd00d
    enableDestroy @meshblu
    @request = get: sinon.stub()
    @dependencies = request: @request
    @sut = require '../../app/models/flow-v2'


  afterEach (done) ->
    @meshblu.destroy done

  describe '->getFlowsV2', ->
    describe 'when given a valid Meshblu config', ->
      beforeEach (done) ->
        meshbluJSON =
          uuid: 'batman-and-robin'
          token: 'joker-kills-robin'
          server: '127.0.0.1'
          port: 0xd00d


        @meshblu.get('/mydevices')
          .reply(200, myFlows)

        @sut.getFlows meshbluJSON, (@error, @body) => done()

      it 'should retreive all of my flows', ->
        expect(@body).to.have.lengthOf(4)

      it 'should return the messed-up old flow format', ->
        expect(@body).to.containSubset [
          {flowId: '1', resource: {nodeType: 'flow'}}
          {flowId: '2', resource: {nodeType: 'flow'}}
          {flowId: '3', resource: {nodeType: 'flow'}}
          {flowId: '4', resource: {nodeType: 'flow'}}
        ]
    describe 'when given an invalid Meshblu config', ->
      beforeEach (done) ->
        meshbluJSON =
          uuid: 'blah'
          server: '127.0.0.1'
          port: 0xd00d

        @meshblu.get('/mydevices')
          .reply( 403, 'not sure' )

        @sut.getFlows meshbluJSON, (@error, @body) => done()

      it 'should respond with an error', ->
        expect(@error).to.exist
