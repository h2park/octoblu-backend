process.env.NODE_ENV = 'test'
var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var chaiSubset = require('chai-subset');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiSubset);


global.expect = chai.expect;
global.sinon  = sinon;
