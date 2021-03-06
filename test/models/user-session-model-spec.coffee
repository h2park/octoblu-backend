_ = require 'lodash'
UserSession = require '../../app/models/user-session-model'
TestDatabase = require '../test-database'

xdescribe 'UserSession', ->
  beforeEach ->
    @config = skynet: {host: 'meshblu.octoblu.com', port: 80}
    @request = sinon.stub()
    @sut = new UserSession request: @request, config: @config, database: {users: {}}

  describe '->create', ->
    describe 'when called with a uuid', ->
      beforeEach ->
        sinon.spy(@sut, 'exchangeOneTimeTokenForSessionToken')
        @sut.create 'buried', 'leads'

      it 'should call exchangeOneTimeTokenForSessionToken', ->
        expect(@sut.exchangeOneTimeTokenForSessionToken).to.have.been.calledWith 'buried', 'leads'

    describe 'when exchangeOneTimeTokenForSessionToken yields an error', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields new Error('Cannibalism')
        @sut.create 'buried', 'leads', (@error) => done()

      it 'should yield and error', ->
        expect(@error).to.exist

    describe 'when and exchangeOneTimeTokenForSessionToken yields an error', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields new Error('Lighthouse out of order')
        @sut.create 'chemicals', 'periodical', (@error) => done()

      it 'should yield an error', ->
        expect(@error).to.exist

    describe 'when and exchangeOneTimeTokenForSessionToken yields a token and invalidateOneTimeToken yields nothing', ->
      beforeEach ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields null, 'i-am-a-session-token-trust-me'
        sinon.stub(@sut,  'ensureUserExists')
        @sut.create 'chemicals', 'periodical'

      it 'should call ensureUserExists', ->
        expect(@sut.ensureUserExists).to.have.been.calledWith 'chemicals'

    describe 'when and exchangeOneTimeTokenForSessionToken yields a token and invalidateOneTimeToken yields nothing and ensureUserExists yields an error', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields null, 'i-am-a-session-token-trust-me'
        sinon.stub(@sut, 'ensureUserExists').yields new Error('Revenge. You know what you did.')
        @sut.create 'chemicals', 'periodical', (@error) => done()

      it 'should yield an error', ->
        expect(@error).to.exist

    describe 'when and exchangeOneTimeTokenForSessionToken yields a token and ensureUserExists yields a user', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'exchangeOneTimeTokenForSessionToken').yields null, 'i-am-a-session-token-trust-me'
        sinon.stub(@sut, 'ensureUserExists').yields null, {skynet: {uuid: 'i-am-a-uuid'}}
        @sut.create 'chemicals', 'periodical', (@error, @user) => done()

      it 'should call the callback and yield a user', ->
        expect(@user).to.deep.equal skynet: {uuid: 'i-am-a-uuid'}

  describe '->createNewSessionToken', ->
    beforeEach ->
      @sut.createNewSessionToken 'uuid', 'token'

    it 'should call request', ->
      headers = meshblu_auth_uuid: 'uuid', meshblu_auth_token: 'token'
      expect(@request).to.have.been.calledWith uri: 'http://meshblu.octoblu.com:80/devices/uuid/tokens', method: 'POST', headers: headers, json: true

    describe 'when request returns an error', ->
      beforeEach (done) ->
        @request.yields new Error("Luge, I'm gonna let this one slide")
        @sut.createNewSessionToken 'uuid', 'token', (@error) => done()

      it 'should have an error', ->
        expect(@error).to.exist

    describe 'when meshblu yields a 400', ->
      beforeEach (done) ->
        @request.yields null, statusCode: 400
        @sut.createNewSessionToken 'uuid', 'token', (@error) => done()

      it 'should have an error', ->
        expect(@error.message).to.equal UserSession.ERROR_FAILED_TO_GET_SESSION_TOKEN

    describe 'when meshblu yields a 200', ->
      beforeEach (done) ->
        @request.yields null, {statusCode: 200}, {uuid: 'uuid', token: 'session-token'}
        @sut.createNewSessionToken 'uuid', 'token', (@error, @result) => done()

      it 'should have an error', ->
        expect(@result).to.deep.equal 'session-token'

  describe '->ensureUserExists', ->
    beforeEach (done) ->
      TestDatabase.open (error, database) =>
        @database = database
        @sut = new UserSession request: @request, config: @config, database: @database

        done error

    afterEach ->
      @database.close?()

    describe 'when a user exists in the database', ->
      beforeEach ->
        @database.users.insert {skynet: {uuid: 'drill'}, foo: 'bar', resource: {uuid: 'drill'}}

      describe 'when called with a uuid and token', ->
        beforeEach (done) ->
          @sut.ensureUserExists 'drill', (error, @user) => done error

        it 'should yield the user', ->
          expect(_.omit @user, '_id').to.deep.equal {foo: 'bar', skynet: {uuid: 'drill'}, resource: {uuid: 'drill'}}

        it 'should update the record with the new token',  ->
          @database.users
            .findOne 'skynet.uuid': 'drill'
            .then (user) =>
              expect(user).to.exist

        it 'should not touch foo', ->
          @database.users
            .findOne 'skynet.uuid': 'drill'
            .then (user) =>
              expect(user).to.exist

    describe 'when there is not user in the database', ->
      describe 'when called with a uuid and token', ->
        beforeEach (done) ->
          @sut.ensureUserExists 'boilerplate', (error, @user) => done error

        it 'should yield the user', ->
          expect(_.omit @user, '_id').to.deep.equal {skynet: {uuid: 'boilerplate'}, resource: {uuid: 'boilerplate'}}

        it 'should insert a record with the uuid and token', ->
          @database.users.findOne('skynet.uuid': 'boilerplate').then (user) =>
            expect(user).to.exist

  describe '->getDeviceFromMeshblu', ->
    describe 'when called with uuid and token', ->
      beforeEach ->
        @sut.getDeviceFromMeshblu 'uuid', 'token'

      it 'should try to retrieve the device from Meshblu', ->
        options =
          uri: 'http://meshblu.octoblu.com:80/v2/whoami'
          headers:
            meshblu_auth_uuid: 'uuid'
            meshblu_auth_token: 'token'
          method: 'GET'
          json: true
        expect(@request).to.have.been.calledWith options

    describe 'when called with a different uuid and token', ->
      beforeEach ->
        @sut.getDeviceFromMeshblu 'forgot', 'to-breathe'

      it 'should try to retrieve the device from Meshblu', ->
        options =
          uri: 'http://meshblu.octoblu.com:80/v2/whoami'
          headers:
            meshblu_auth_uuid: 'forgot'
            meshblu_auth_token: 'to-breathe'
          method: 'GET'
          json: true
        expect(@request).to.have.been.calledWith options

    describe 'when called with a different meshblu configuration', ->
      beforeEach ->
        @config.skynet = host: 'localhost', port: 3000
        @sut.getDeviceFromMeshblu 'forgot', 'to-breathe'

      it 'should try to retrieve the device from Meshblu', ->
        options =
          uri: 'http://localhost:3000/v2/whoami'
          headers:
            meshblu_auth_uuid: 'forgot'
            meshblu_auth_token: 'to-breathe'
          method: 'GET'
          json: true
        expect(@request).to.have.been.calledWith options

    describe 'when the meshblu configuration uses port 443', ->
      beforeEach ->
        @config.skynet = host: 'meshblu.octoblu.com', port: 443
        @sut.getDeviceFromMeshblu 'abandoned', 'in-space'

      it 'should use the https protocol', ->
        options =
          uri: 'https://meshblu.octoblu.com:443/v2/whoami'
          json: true
          method: 'GET'
          headers:
            meshblu_auth_uuid: 'abandoned'
            meshblu_auth_token: 'in-space'
        expect(@request).to.have.been.calledWith options

    describe 'when called and meshblu responds with an error', ->
      beforeEach (done) ->
        @request.yields new Error('unspecified error')
        @sut.getDeviceFromMeshblu 'bear', 'grizzly', (@error) => done()

      it 'should call its callback with the error', ->
        expect(@error.message).to.equal 'unspecified error'

    describe 'when called and meshblu responds with a device', ->
      beforeEach (done) ->
        @request.yields null, null, {uuid: 'bear', name: 'rustle'}
        @sut.getDeviceFromMeshblu 'bear', 'grizzly', (@error, @result) => done()

      it 'should call its callback with no error', ->
        expect(@error).not.to.exist

      it 'should call its callback with the device', ->
        expect(@result).to.deep.equal uuid: 'bear', name: 'rustle'

    describe 'when called and meshblu responds with no device', ->
      beforeEach (done) ->
        @request.yields null, null, null
        @sut.getDeviceFromMeshblu 'bear', 'grizzly', (@error, @result) => done()

      it 'should call its callback with an error', ->
        expect(@error.message).to.equal UserSession.ERROR_DEVICE_NOT_FOUND

  describe '->invalidateOneTimeToken', ->
    describe 'when called with a uuid and token', ->
      beforeEach ->
        sinon.spy(@sut, 'getDeviceFromMeshblu')
        @sut.invalidateOneTimeToken 'uuid', 'token'

      it 'should call getDeviceFromMeshblu', ->
        expect(@sut.getDeviceFromMeshblu).to.have.been.calledWith 'uuid', 'token'

    describe 'when called with another uuid and token', ->
      beforeEach ->
        sinon.spy(@sut, 'getDeviceFromMeshblu')
        @sut.invalidateOneTimeToken 'bear', 'hear'

      it 'should call getDeviceFromMeshblu', ->
        expect(@sut.getDeviceFromMeshblu).to.have.been.calledWith 'bear', 'hear'

    describe 'when called and getDeviceFromMeshblu returns an error', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'getDeviceFromMeshblu').yields new Error('Bad Cheese')
        @sut.invalidateOneTimeToken 'old-age', 'this-cheese-tastes-weird', (@error) => done()

      it 'should yield an error', ->
        expect(@error).to.exist

    describe 'when it returns a device', ->
      beforeEach (done) ->
        sinon.stub(@sut, 'getDeviceFromMeshblu').yields null, {uuid: 'uuid', tokens: [{hash: '$2a$08$R7p9xj2FM1gRgUbmdI7n5uddh92c0ci/F25fiWoibBewIIcQDA41i'}]}
        sinon.stub(@sut, 'updateDevice').yields new Error()
        @sut.invalidateOneTimeToken 'uuid', 'token', => done()

      it 'should call updateDevice with the token removed', ->
        expect(@sut.updateDevice).to.have.been.calledWith 'uuid', 'token', {uuid: 'uuid', tokens: []}

    describe 'when it returns a device with other tokens', ->
      beforeEach (done) ->
        device = {uuid: 'uuid', tokens: [{hash: '$2a$08$8BeLFJ/vNcEAuQY49bAas.f2gU6kx8fdiV7AOdnglWK.RAXZhxh6a'}, {hash: 'other-token'}]}
        sinon.stub(@sut, 'getDeviceFromMeshblu').yields null, device
        sinon.stub(@sut, 'updateDevice').yields new Error()
        @sut.invalidateOneTimeToken 'uuid', 'token', => done()

      it 'should call updateDevice with the token removed', ->
        expect(@sut.updateDevice).to.have.been.calledWith 'uuid', 'token', {uuid: 'uuid', tokens: [{hash: 'other-token'}]}

  describe '->updateDevice', ->
    describe 'when called with a uuid, token, and some properties', ->
      beforeEach ->
        @sut.updateDevice 'operator-error', 'whoops, my bad', {uuid: 'operator-error', tokens: []}

      it 'should call request', ->
        options =
          uri: 'http://meshblu.octoblu.com:80/devices/operator-error'
          headers:
            meshblu_auth_uuid: 'operator-error'
            meshblu_auth_token: 'whoops, my bad'
          method: 'PUT'
          json:
            uuid: 'operator-error'
            tokens: []
        expect(@request).to.have.been.calledWith options

    describe 'when called with a different uuid, token, and some properties', ->
      beforeEach ->
        @sut.updateDevice 'dream', 'becomes real', {uuid: 'dream', tokens: []}

      it 'should call request', ->
        options =
          uri: 'http://meshblu.octoblu.com:80/devices/dream'
          headers:
            meshblu_auth_uuid: 'dream'
            meshblu_auth_token: 'becomes real'
          method: 'PUT'
          json:
            uuid: 'dream'
            tokens: []
        expect(@request).to.have.been.calledWith options

    describe 'when called and request yields an error', ->
      beforeEach (done) ->
        @request.yields new Error('Never forget')
        @sut.updateDevice 'vengeful', 'elephant', {}, (@error) => done()

      it 'should yield an error', ->
        expect(@error).to.exist

    describe 'when called and meshblu yields a non 200', ->
      beforeEach (done) ->
        @request.yields null, {statusCode: 500}
        @sut.updateDevice 'vengeful', 'elephant', {}, (@error) => done()

      it 'should yield an error', ->
        expect(@error.message).to.equal UserSession.ERROR_FAILED_TO_UPDATE_DEVICE

    describe 'when called and meshblu yields 200', ->
      beforeEach (done) ->
        @request.yields null, {statusCode: 200}
        @sut.updateDevice 'vengeful', 'elephant', {}, (@error) => done()

      it 'should yield nothing!', ->
        expect(@error).not.to.exist
