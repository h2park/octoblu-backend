OctoController = require '../../app/controllers/octo-controller'

describe 'OctoController', ->
  beforeEach ->
    @OctoModel = {}
    dependencies = OctoModel : @OctoModel
    @sut = new OctoController meshblu: {}, dependencies

  describe '->create', ->
    describe 'when called', ->
      beforeEach ->
        @request =
          user:
            resource: {}
        @response = {}
        @response.status = sinon.stub().returns @response
        @response.send = sinon.spy()
        @OctoModel.create = sinon.stub().yields {uuid: 'boom'}

        @sut.create(@request, @response)

      it 'should call status(201).send({})', ->
        expect(@response.status).to.have.been.calledWith 201
        expect(@response.send).to.have.been.calledWith {uuid: 'boom'}

  describe '->delete', ->
    describe 'when called', ->
      beforeEach ->
        @request = {}
        @request.params = octoUuid: 'octo-uuid'
        @response = {}
        @response.status = sinon.stub().returns @response
        @response.end = sinon.spy()

        @OctoModel.delete = sinon.stub().yields()
        @sut.delete(@request, @response)

      it 'should call OctoModel.delete', ->
        expect(@OctoModel.delete).to.have.been.called

      it 'should call status(200).end()', ->
        expect(@response.status).to.have.been.calledWith 200
        expect(@response.end).to.have.been.called
