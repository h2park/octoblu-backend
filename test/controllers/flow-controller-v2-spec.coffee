_ = require 'lodash'
MeshbluHttp = require 'meshblu-http'
shmock = require 'shmock'
sinon = require 'sinon'
enableDestroy = require 'server-destroy'
myFlows = require '../data/my-flows'
FlowController = require '../../app/controllers/flow-controller-v2'

describe 'Flow Controller V2', ->
  beforeEach ->
    @meshblu = shmock 0xd00d
    enableDestroy @meshblu
    @meshblu.post('/search/devices')
      .reply(200, myFlows)

    meshbluJSON =
      uuid: 'batman-and-robin'
      token: 'joker-kills-robin'
      hostname: 'localhost'
      port: 0xd00d
      protocol: 'http'

    @sut = new FlowController { meshbluJSON: meshbluJSON }

    @expectedKeys = ['flowId', 'name', 'online', 'nodes', 'description']

  afterEach (done) ->
    @meshblu.destroy done

  describe '->getFlows', ->
    describe 'should call Flow.getFlows', ->
      beforeEach (done) ->
        request =
          user:
            resource:
              uuid: 'ownerId'
        response =
          sendError: (@error) => done()
          status: (@statusCode) =>
            return response
          send: (@body) => done()
        @sut.getFlows request, response
        return

      it 'should return a 200 OK', ->
        expect(@statusCode).to.equal 200

      it 'should return ALL of my flows', ->
        expect(@body[0]).to.contain.keys(@expectedKeys)
        expect(@body[1]).to.contain.keys(@expectedKeys)
        expect(@body[2]).to.contain.keys(@expectedKeys)
        expect(@body[3]).to.contain.keys(@expectedKeys)

  describe '->getSomeFlows', ->
    describe 'should call Flow.getSomeFlows', ->
      beforeEach (done) ->
        request =
          params:
            limit: 2
          user:
            resource:
              uuid: 'ownerId'

        response =
          sendError: (@error) => done()
          status: (@statusCode) =>
            return response
          send: (@body) => done()
        @sut.getSomeFlows request, response
        return

      it 'should return a 200 OK', ->
        expect(@statusCode).to.be.equal(200)

      it 'should retreive SOME of my flows', ->
        expect(@body[0]).to.contain.keys(@expectedKeys)
        expect(@body[1]).to.contain.keys(@expectedKeys)
