var when = require('when');
var DeviceCollection = require('../../app/collections/device-collection');

describe('DeviceCollection', function () {
  var sut, result, getUser, getDevicesByOwner, users;

  beforeEach(function () {
    users = {
      'u1': {
        skynetuuid: 'u1',
        skynettoken: 't1'
      },
      'u2': {
        skynetuuid: 'u2',
        skynettoken: 't2'
      }
    };

    sut = new DeviceCollection('u1');

    getUser = sinon.stub(sut, 'getUser', function (userId) {
      return when.resolve(users[userId]);
    });

  });

  describe('fetch', function () {
    describe('when getDevicesByOwner returns an empty array', function () {
      beforeEach(function () {
        var defer = when.defer();
        getDevicesByOwner = sinon.stub(sut, 'getDevicesByOwner');
        getDevicesByOwner.returns(defer.promise);
        defer.resolve([]);
      });

      it('should call getUser', function () {
        result = sut.fetch();
        expect(getUser).to.have.been.called;
      });

      it('should return an array', function (done) {
        sut.fetch().then(function (devices) {
          expect(devices).to.be.instanceof(Array);
          done();
        })
        .catch(done);
      });

      it('should return a list of devices that the user owns', function (done) {
        sut.fetch().then(function (results) {
          expect(getDevicesByOwner).to.have.been.calledWith(users['u1']);
          done();
        })
        .catch(done);
      });
    });

    describe('when getDevicesByOwner returns an octoblu flow', function () {
      beforeEach(function () {
        var defer = when.defer();
        getDevicesByOwner = sinon.stub(sut, 'getDevicesByOwner');
        getDevicesByOwner.returns(defer.promise);
        defer.resolve([{type: 'octoblu:flow'}]);
      });

      it('should filter them out of the response', function (done) {
        result = sut.fetch();
        result.then(function(devices){
          expect(devices).to.have.be.empty;
          done();
        }).catch(done);
      });
    });
  });
});
