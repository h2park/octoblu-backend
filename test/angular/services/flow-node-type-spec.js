describe('FlowNodeTypeService', function () {
    var sut, $httpBackend;

    beforeEach(function () {
        module('octobluApp');

        inject(function (FlowNodeTypeService, _$httpBackend_) {
            sut = FlowNodeTypeService;
            $httpBackend = _$httpBackend_;
            $httpBackend.whenGET('/api/auth').respond(200);
            $httpBackend.whenGET('pages/octoblu.html').respond(200);
            $httpBackend.whenGET('pages/home.html').respond(200);
            $httpBackend.flush();
        });
    });

    it('should instantiate', function () {
        expect(sut).to.exist;
    });

    describe('.getFlowNodeTypes', function () {
        it('should return an array', function (done) {
            $httpBackend.expectGET('/api/flow/node_types').respond(200, ['hi']);

            sut.getFlowNodeTypes().then(function (flows) {
                expect(flows.length).to.eq(1);
                done();
            }, done);

            $httpBackend.flush();
        });
        it('should return an array with objects', function (done) {
            $httpBackend.expectGET('/api/flow/node_types').respond(200, [{}]);

            sut.getFlowNodeTypes().then(function (flows) {
                expect(flows[0]).to.be.instanceof(Object);
                done();
            }, done);

            $httpBackend.flush();
        });
    });
});