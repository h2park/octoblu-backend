var _ = require('lodash');
var when              = require('when');
var octobluDB = require('../../app/lib/database');
var ChannelCollection = require('../../app/collections/channel-collection');

describe('ChannelCollection', function () {
  var sut, fetchChannelsByIds, getUser, result;

  beforeEach(function(){
    var getUserDefer, fetchChannelByIdDefer, fetchChannelsByIdsDefer;
    octobluDB.createConnection();

    sut     = new ChannelCollection();

    fetchChannelsByIdsDefer = when.defer();
    fetchChannelsByIds = sinon.stub(sut, 'fetchChannelsByIds');
    fetchChannelsByIds.returns(fetchChannelsByIdsDefer.promise);
    fetchChannelsByIds.resolve = fetchChannelsByIdsDefer.resolve;

    getUserDefer = when.defer();
    getUser = sinon.stub(sut, 'getUser');
    getUser.returns(getUserDefer.promise);
    getUser.resolve = getUserDefer.resolve;
  });

  describe('fetch', function () {
    beforeEach(function () {
      result = sut.fetch('uselessUUID');
    });

    it('should getUser', function () {
      expect(getUser).to.have.been.called;
    });

    describe('when the user returns no api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: []};
        getUser.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with no channel', function () {
        beforeEach(function(){
          fetchChannelsByIds.resolve([]);
        });

        it('should be empty', function(done){
          result.then(function(apis){
            expect(apis).to.deep.equal([]);
            done();
          }).catch(done);
        });
      });
    });

    describe('when the user returns an api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: [{_id: '321', channelid: '123', whatever: 'somethingelse', whoosawhatsit: 'floosenhousen'}]};
        getUser.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with a channel', function () {
        beforeEach(function(){
          fetchChannelsByIds.resolve([{_id: '123', name: 'FooNetwork'}]);
        });

        it('should have called fetchByChannelIds on channel', function (done) {
          result.then(function(apis){
            expect(fetchChannelsByIds).to.have.been.calledWith(['123']);
            done();
          }).catch(done);
        });

        it('should merge the channel in with the user api', function (done) {
          result.then(function(apis){
            var api = _.first(apis);
            expect(apis).to.have.a.lengthOf(1);
            expect(api.channelid).to.equal('123');
            expect(api.channelActivationId).to.equal('321');
            expect(api.name).to.equal('FooNetwork');
            done();
          }).catch(done);
        });
      });
    });

    describe('when the user returns an api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: [{_id: '999', channelid: '888', whatever: 'something'}]};
        getUser.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with a channel', function () {
        beforeEach(function(){
          var channel = {_id: '888', name: 'TheOcho', params: {}};
          fetchChannelsByIds.resolve([channel]);
        });

        it('should have called fetchByChannelIds on channel', function (done) {
          result.then(function(apis){
            expect(fetchChannelsByIds).to.have.been.calledWith(['888']);
            done();
          }).catch(done);
        });

        it('should merge the channel in with the user api', function (done) {
          result.then(function(apis){
            var api = _.first(apis);
            expect(apis).to.have.a.lengthOf(1);
            expect(api.channelid).to.equal('888');
            expect(api.channelActivationId).to.equal('999');
            expect(api.name).to.equal('TheOcho');
            done();
          }).catch(done);
        });
      });
    });
  });
});
