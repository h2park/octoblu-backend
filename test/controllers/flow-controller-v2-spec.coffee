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

    @response =
      send: sinon.spy()


  afterEach (done) ->
    @meshblu.destroy done

  describe '->getSomeFlows', ->
    describe 'should call Flow.getSomeFlows', ->
      beforeEach () ->
        meshbluJSON =
          uuid: 'batman-and-robin'
          token: 'joker-kills-robin'
          server: '127.0.0.1'
          port: 0xd00d

        request =
          params:
            limit: 2
          user:
            resource:
              uuid: 'ownerId'

        @sut = new FlowController { meshbluJSON: meshbluJSON }

        @meshblu.get('/mydevices')
          .reply(200, myFlows)

        @sut.getSomeFlows request, @response

      it 'should retreive all of my flows', ->
        expect(@response.send).to.have.been.calledWith(200);
