describe('channelService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function(channelService, _$httpBackend_){
      sut          = channelService;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('/pages/octoblu.html').respond(200);
      $httpBackend.whenGET('/pages/home.html').respond(200);
      $httpBackend.whenGET('/pages/material.html').respond(200);
      $httpBackend.whenGET('/api/nodes').respond(200, []);
      $httpBackend.flush();
    });
  });

  describe('getById', function (){
    it('should call GET /api/channels/:channel_id', function(){
      $httpBackend.expectGET('/api/channels/1234').respond(200);
      sut.getById(1234);
      $httpBackend.flush();
    });

    it('should return a promise for a channel', function(done){
      $httpBackend.expectGET('/api/channels/1234').respond(200, {blarg: 1234});

      sut.getById(1234).then(function(channel){
        expect(channel).to.deep.equal({blarg: 1234});
        done();
      }).catch(done);

      $httpBackend.flush();
    });
  });
});
