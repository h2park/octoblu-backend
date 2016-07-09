_ = require 'lodash'
MeshbluHttp = require 'meshblu-http'
shmock = require 'shmock'
sinon = require 'sinon'
enableDestroy = require 'server-destroy'
myFlows = require '../data/my-flows'
FlowController = require '../../app/controllers/flow-controller-v2'

describe.only 'Flow Controller V2', ->
  beforeEach ->
    @meshblu = shmock 0xd00d
    enableDestroy @meshblu

    @meshblu.get('/mydevices')
      .reply(200, myFlows)

    meshbluJSON =
      uuid: 'batman-and-robin'
      token: 'joker-kills-robin'
      server: '127.0.0.1'
      port: 0xd00d

    @sut = new FlowController { meshbluJSON: meshbluJSON }

    @response =
      send: (status, reply) =>
        @statusCode = status
        @body = reply

    @expectedKeys = ['flowId', 'name', 'online', 'nodes', 'description']

  afterEach (done) ->
    @meshblu.destroy done

  describe '->getSomeFlows', ->
    describe 'should call Flow.getSomeFlows', ->
      beforeEach () ->
        request =
          params:
            limit: 2
          user:
            resource:
              uuid: 'ownerId'

        @sut.getSomeFlows request, @response

      it 'should return a 200 OK', ->
        expect(@statusCode).to.be.equal(200)

      it 'should retreive SOME of my flows', ->
        expect(@body[0]).to.contain.keys(@expectedKeys)
        expect(@body[1]).to.contain.keys(@expectedKeys)

  describe '->getFlows', ->
    describe 'should call Flow.getFlows', ->
      beforeEach () ->
        request =
          user:
            resource:
              uuid: 'ownerId'
        @sut.getFlows request, @response

      it 'should return a 200 OK', ->
        expect(@statusCode).to.be.equal(200)

      it 'should return ALL of my flows', ->
        expect(@body[0]).to.contain.keys(@expectedKeys)
        expect(@body[1]).to.contain.keys(@expectedKeys)
        expect(@body[2]).to.contain.keys(@expectedKeys)
        expect(@body[3]).to.contain.keys(@expectedKeys)
