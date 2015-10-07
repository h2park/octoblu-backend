FlowIntervalNodesTransform =
  require '../../../app/controllers/middleware/flow-interval-nodes-transform'
_                   = require 'lodash'
When                = require 'when'

describe 'FlowIntervalNodesTransform', ->
  beforeEach ->
    @Flow =
      getFlowWithOwner : sinon.stub().returns When.resolve()
      updateByFlowIdAndUser : sinon.stub().returns When.resolve()
      update: sinon.stub().returns When.resolve()

    @dependencies = Flow : @Flow
    @sut = new FlowIntervalNodesTransform(@dependencies)
    # @User =
    #   findBySkynetUUID: sinon.stub()
    # @sut = new FlowIntervalNodesTransform User: @User
  it 'should exist', ->
    expect(FlowIntervalNodesTransform).to.exist

  describe '->updateIntervalNodes', ->

    it 'should exist', ->
      expect(@sut.updateIntervalNodes).to.exist

    describe 'when there is no user', ->
      beforeEach () ->
        @request = {}
        @response = {}
        @next = sinon.spy()
        @sut.updateIntervalNodes @request, @response, @next

      it 'should call the next function', ->
        expect(@next).to.have.been.called

    describe 'when the flow does not have interval nodes', ->
      beforeEach ->
        @Flow.getFlowWithOwner.returns When.resolve({
          flowId : '1'
          nodes:[
            {
             uuid: "1234"
             class : "Foo"
          }]
        })

        @request = {
          params :
            id : "1738"
          user :
            uuid :  "ABRACADABRA"
            token : "4567"
        }

        @response = {}
        @next = sinon.spy()
        @sut.updateIntervalNodes(@request, @response, @next)

      it 'should not update the flow', ->
        expect(@next).to.have.been.called

    describe 'when the flow has interval nodes without a deviceId', ->
      beforeEach ->
        @Flow.getFlowWithOwner.returns When.resolve({
          flowId : "RIDING-CANDY"
          resource : {
            owner : {
              uuid : "RIDING-SLABS"
            }
          }
          nodes:[{
             uuid: "mystery"
             class : "Foo"
          },
          {
            uuid : "chessboxing"
            class : "delay"
          }]
        })

        @Flow.update.returns When.resolve({
          "nMatched" : 1
          "nUpserted" : 0
          "nModified" : 1
          })

        @request = {
          params :
            id : "12345"
          user :
            uuid :  "ABRACADABRA"
            token : "4567"
        }

        @response = {}
        @next = sinon.spy()
        @sut.updateIntervalNodes(@request, @response, @next)

      it 'should update the flow and add the deviceId to the interval nodes', ->
        expect(@Flow.updateByFlowIdAndUser).to.have.been.calledWith( @request.params.id, @request.user.uuid,
        {
          nodes:[{
             uuid: "mystery"
             class : "Foo"
          },
          {
            uuid : "chessboxing"
            class : "delay"
            deviceId : "765bd3a4-546d-45e6-a62f-1157281083f0"
          }]
          })

    describe 'when the flow has interval nodes with a deviceId', ->
      beforeEach ->
        @Flow.getFlowWithOwner.returns When.resolve({
          flowId : "1738"
          resource : {
            owner : {
              uuid : "ABRACADABRA"
            }
          }
          nodes:[{
             uuid: "1234"
             class : "Foo"
          },
          {
            uuid : "456"
            class : "interval"
            deviceId : "765bd3a4-546d-45e6-a62f-1157281083f0"
          }]
        })

        @Flow.update.returns When.resolve({
          "nMatched" : 1
          "nUpserted" : 0
          "nModified" : 1
          })

        @request = {
          params :
            id : "1738"
          user :
            uuid :  "ABRACADABRA"
            token : "4567"
        }

        @response = {}
        @next = sinon.spy()
        @sut.updateIntervalNodes(@request, @response, @next)

      it 'should not update the flow and just call next', ->
        expect(@Flow.updateByFlowIdAndUser).to.not.have.been.called
