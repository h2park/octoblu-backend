describe('RubberService', function () {
  beforeEach(function () {
    var _this = this;

    module('octobluApp');

    inject(function(RubberService){
      _this.sut = RubberService;
    });
  });

  it('should instantiate', function () {
    expect(this.sut).to.exist
  });

  describe('->buildDevices', function () {
    describe('with nothing passed in', function () {
      it('should return an empty string', function () {
        expect(this.sut.buildDevices()).to.equal("");
      });
    });

    describe('with an empty array of devices', function () {
      it('should return an empty string', function () {
        expect(this.sut.buildDevices([])).to.equal("");
      });
    });

    describe('with an array containing a single device', function () {
      it('should return "uuid=the_uuid"', function () {
        var devices = [{uuid: 'the_uuid'}];
        expect(this.sut.buildDevices(devices)).to.equal("uuid=the_uuid");
      });
    });

    describe('with an array containing two devices', function () {
      it('should return "uuid=the_uuid OR uuid=the_other_uuid"', function () {
        var devices = [{uuid: 'the_uuid'}, {uuid: 'the_other_uuid'}];
        expect(this.sut.buildDevices(devices)).to.equal("uuid=the_uuid OR uuid=the_other_uuid");
      });
    });
  });
});
