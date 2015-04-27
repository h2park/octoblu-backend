OctoModel = require '../../app/models/octo-model'

describe 'OctoModel', ->
  beforeEach ->
    @meshblu = {}
    @sut = new OctoModel meshblu: @meshblu

  describe '->findManager', ->
    describe 'when meshblu.mydevices yields one octo-master device', ->
      beforeEach (done) ->
        @meshblu.mydevices = sinon.stub().yields devices: [uuid: 'hello', type: 'octoblu:octo-master']
        @sut.findManager (@manager) => done()

      it 'should yield a octo-master device uuid', ->
        expect(@manager).to.deep.equal 'hello'

    describe 'when meshblu.mydevices yields another octo-master device', ->
      beforeEach (done) ->
        @meshblu.mydevices = sinon.stub().yields devices: [uuid: 'goodbye', type: 'octoblu:octo-master']
        @sut.findManager (@manager) => done()

      it 'should yield a octo-master device uuid', ->
        expect(@manager).to.deep.equal 'goodbye'

    describe 'when meshblu.mydevices yields no octo-master device', ->
      beforeEach (done) ->
        @meshblu.mydevices = sinon.stub().yields devices: []
        @sut.findManager (@manager) => done()

      it 'should call mydevices with type: octo-master a octo-master device uuid', ->
        expect(@meshblu.mydevices).to.have.been.calledWith type: 'octoblu:octo-master', online: true

      it 'should yield a octo-master device uuid', ->
        expect(@managers).not.to.exist

  describe '->messageManager', ->
    describe 'when called uuid and token', ->
      beforeEach ->
        @meshblu.message = sinon.spy()
        @sut.messageManager 'create-octo', 'master', {uuid: 'dude', token: 'bye'}

      it 'should send a meshblu message to start the octo', ->
        expect(@meshblu.message).to.have.been.calledWith
          payload:
            uuid: 'dude'
            token: 'bye'
          devices: ['master']
          topic: 'create-octo'

    describe 'when called uuid and token', ->
      beforeEach ->
        @meshblu.message = sinon.spy()
        @sut.messageManager 'create-octo', 'super-master', {uuid: 'hey you', token: '...'}

      it 'should send a meshblu message to start the octo', ->
        expect(@meshblu.message).to.have.been.calledWith
          payload:
            uuid: 'hey you'
            token: '...'
          devices: ['super-master']
          topic: 'create-octo'

  describe '->createDevice', ->
    describe 'when called a owner uuid', ->
      beforeEach (done) ->
        device =
          uuid: 'hi'
          token: 'see ya'
          type: 'octoblu:octo'
          owner: 'yo'
          configureWhitelist: ['yo']
          discoverWhitelist: ['yo']
          receiveWhitelist: ['yo']
          sendWhitelist: ['yo']

        @meshblu.register = sinon.stub().yields device
        @sut.createDevice 'yo', (@device) => done()

      it 'should call meshblu.register with the defaults', ->
        expect(@meshblu.register).to.have.been.calledWith
          type: 'octoblu:octo'
          owner: 'yo'
          name: 'Octo 1'
          configureWhitelist: ['yo']
          discoverWhitelist: ['yo']
          receiveWhitelist: ['yo']
          sendWhitelist: ['yo']

      it 'should yield an octo device', ->
        expect(@device).to.deep.equal
          uuid: 'hi'
          token: 'see ya'
          type: 'octoblu:octo'
          owner: 'yo'
          configureWhitelist: ['yo']
          discoverWhitelist: ['yo']
          receiveWhitelist: ['yo']
          sendWhitelist: ['yo']

    describe 'when called with a different owner uuid', ->
      beforeEach (done) ->
        device =
          uuid: 'heeellooo'
          token: 'peace'
          type: 'octoblu:octo'
          owner: 'hey'
          configureWhitelist: ['hey']
          discoverWhitelist: ['hey']
          receiveWhitelist: ['hey']
          sendWhitelist: ['hey']

        @meshblu.register = sinon.stub().yields device
        @sut.createDevice 'hey', (@device) => done()

      it 'should call meshblu.register with the defaults', ->
        expect(@meshblu.register).to.have.been.calledWith
          type: 'octoblu:octo'
          owner: 'hey'
          name: 'Octo 1'
          configureWhitelist: ['hey']
          discoverWhitelist: ['hey']
          receiveWhitelist: ['hey']
          sendWhitelist: ['hey']

      it 'should yield an octo device', ->
        expect(@device).to.deep.equal
          uuid: 'heeellooo'
          token: 'peace'
          type: 'octoblu:octo'
          owner: 'hey'
          configureWhitelist: ['hey']
          discoverWhitelist: ['hey']
          receiveWhitelist: ['hey']
          sendWhitelist: ['hey']

  describe '->delete', ->
    beforeEach ->
      @meshblu.mydevices = sinon.stub().yields devices: [uuid: 'not-so-super-master', type: 'octoblu:octo-master']
      @meshblu.message = sinon.spy()
      @sut.delete('hey you')

    it 'should message the octo-managers', ->
      expect(@meshblu.message).to.have.been.calledWith
        payload:
          uuid: 'hey you'
        devices: ['not-so-super-master']
        topic: 'delete-octo'
