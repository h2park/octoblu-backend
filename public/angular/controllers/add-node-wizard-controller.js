angular.module('octobluApp')
.controller('AddNodeWizardController', function($scope, $state, NodeTypeService) {
  'use strict';

  var STATES = {
    'channel': 'ob.nodewizard.addchannel.existing',
    'device': 'ob.nodewizard.adddevice',
    'genblu': 'ob.nodewizard.addgenblu',
    'microblu': 'ob.nodewizard.addmicroblu',
    'subdevice': 'ob.nodewizard.addsubdevice.selectgateway'
  };

  NodeTypeService.getById($state.params.nodeTypeId).then(function(nodeType){
    $state.go(STATES[nodeType.category], {nodeTypeId : $state.params.nodeTypeId}, {location: 'replace'});
  });
});
