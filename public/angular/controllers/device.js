angular.module('octobluApp')
    .controller('DeviceController', function ($rootScope, $scope, $q, $log, $state,  $http, $cookies, $modal, $timeout, channelService, ownerService, deviceService ) {

        var ownerId = $cookies.skynetuuid;
        var token = $cookies.skynettoken;

        $scope.socket = $rootScope.skynetSocket;
        //TODO this will be handled by route checking at the root scope level. Should be changed then.
        if( ownerId === undefined || token === undefined ){
             $state.go('login');
        }

        $scope.saveHubName = function(hub){
            var elementSelector = '#' + hub.uuid;
            var hubNameField = $(elementSelector).find('input[name="hub-name"]');
            hubNameField.attr('readonly' , 'readonly');

            var errors = $scope.validateName(hub);
            if(errors.length > 0 ){
                hub.validationErrors = errors;
            } else {
                var hubData = {
                    uuid : hub.uuid,
                    owner : hub.owner,
                    name : hub.name,
                    token : hub.token,
                    keyvals : [{}]
                }

                deviceService.updateDevice(hub.owner, hubData, function( data ){
                    console.log(JSON.stringify(data));

                } ) ;
                hub.isNameEditable = false;
            }
        };

        $scope.toggleNameEditable = function( hub ){
            var elementSelector = '#' + hub.uuid;
            var hubNameField = $(elementSelector).find('input[name="hub-name"]');
            hubNameField.removeAttr('readonly');
        };

        $scope.validateName = function(hub){
            var errors = [];
            if(hub.name === undefined || hub.name.length === 0){
                errors.push(
                    {
                        type : 'danger',
                        summary : 'Missing Name',
                        msg : 'Hub Name is required. Please enter a valid name for Hub.'
                    }
                )
            }
            var duplicateHubs = _.findWhere(hub.subdevices, {'name' : hub.name });

            if(duplicateHubs && duplicateHubs.count > 1){
                errors.push({
                    type: 'danger',
                    summary: 'Duplicate Hub Name',
                    msg: 'Please enter a unique name for the Hub'
                });
            }
            return errors;
        };

        $scope.deleteHub = function(hub){
          $rootScope.confirmModal($modal, $scope, $log, 'Delete Hub ' + hub.name ,'Are you sure you want to delete this Hub?',
              function() {
                  $log.info('ok clicked');
                  deviceService.deleteDevice(hub.uuid, hub.token, function( data ) {
                      var claimedGateways = $scope.claimedGateways;
                      $scope.claimedGateways = _.without(claimedGateways, hub);
                  });
              },
              function() {
                  $log.info('cancel clicked');
              });

      };

      this.getClaimedGateways = function(){
          var claimedGateways = [];
          ownerService.getGateways(ownerId, token, false, function(error, data){
              if(error || data.gateways === undefined ){
                  console.log(error);
                  claimedGateways = [];
              } else{
                  claimedGateways = _.filter(data.gateways, function(gateway){
                      return gateway.owner === ownerId;
                  });
              }

          });
          return claimedGateways;
      };


      ownerService.getGateways(ownerId, token, false, function(error, data){
            if(error || data.gateways === undefined ){
                console.log(error);
                $scope.claimedGateways = [];
            } else{
                $scope.claimedGateways = _.filter(data.gateways, function(gateway){
                    return gateway.owner === ownerId;
                });
            }
      });

        channelService.getSmartDevices(function(error, data){
             if(error){
                 console.log('Error: ' + error);
             }
            // Added to support drag and drop
            for (var i = 0; i < data.length; i++) {
              if (data[i].enabled){
                data[i].drag = true;
              }
            }
            $scope.smartDevices = data;
        });

      $scope.addSmartDevice = function(smartDevice ){
          var installedhubs;
          if (smartDevice.enabled) {

              var hubsMissingPlugin = _.filter($scope.claimedGateways, function (hub) {
                  var plugin = _.findWhere(hub.plugins, {'name': smartDevice.plugin });
                  return plugin === undefined || plugin === null;
              });

              //They need to be installed so we are going to create an array of promises that we will resolve
              //after all the hubs have the missing plugin installed.
              var installedhubs = undefined;
              if (hubsMissingPlugin) {
                  //Iterate over each hub and install
                  var promises = hubsMissingPlugin.map(function (hub) {
                      var deferred = $q.defer();
                      $rootScope.skynetSocket.emit('gatewayConfig', {
                          "uuid": hub.uuid,
                          "token": hub.token,
                          "method": "installPlugin",
                          "name": smartDevice.plugin
                      }, function (data) {
                          console.log(JSON.stringify(data));
                          return deferred.resolve(data);
                      });
                      return deferred.promise;
                  });
                  installedhubs = $q.all(promises).then(function(data){
                      console.log(JSON.stringify(data));
                     $scope.claimedGateways = getClaimedGateways();
                  });


              }
              var subdeviceModal = $modal.open({
                  templateUrl: 'pages/connector/devices/subdevice/add.html',
                  controller: 'AddSubDeviceController',
                  backdrop: true,
                  resolve: {
                      mode: function () {
                          return 'ADD';
                      },
                      hubs: function () {
                          return $scope.claimedGateways;
                      },
                      smartDevice: function () {
                          return smartDevice;
                      },
                      selectedHub : function(){
                         return null;
                      },
                      installedHubs: function () {
                          return installedhubs;
                      }
                  }

              });

              subdeviceModal.result.then(function (result) {
                  $rootScope.skynetSocket.emit('gatewayConfig', {
                      "uuid": result.hub.uuid,
                      "token": result.hub.token,
                      "method": "createSubdevice",
                      "type": result.device.plugin,
                      "name": result.name,
                      "options": result.options
                  }, function (addResult) {
                      console.log(addResult);
                  });

                  result.hub.subdevices.push({
                      name: result.name,
                      type: result.device.plugin,
                      options: result.options
                  });
              }, function () {

              });
          }
      }

        this.editSubDevice = function(subdevice, hub){

            /*
              TODO
             * Check if the sub device is installed for the current hub
             * install the sub device refresh the current device to get the list of updated plugins installed
             * pass the installed plugin for the sub-device to the modal to the modal
             *
             */
            var subDeviceModal = $modal.open({
                templateUrl : 'pages/connector/devices/subdevice/edit.html',
                controller : 'EditSubDeviceController',
                backdrop : true,
                resolve : {
                    mode : function(){
                        return 'EDIT';
                    },

                    subdevice : function(){
                        return subdevice;
                    },

                    hub : function(){
                        return hub;
                    },
                    smartDevices : function(){
                        return $scope.smartDevices;
                    },
                    plugins : function(){
                        return hub.plugins;
                    }
                }
            });

            subDeviceModal.result.then(function( options){
                $rootScope.skynetSocket.emit('gatewayConfig', {
                    "uuid": hub.uuid,
                    "token": hub.token,
                    "method": "updateSubdevice",
                    "type": subdevice.type,
                    "name": subdevice.name,
                    "options": options
                }, function (updateResult) {
                    console.log(updateResult);
                });
                subdevice.options = options;
            }, function(){

            });

        }

        this.deleteSubDevice = function(subdevice, hub){
            $rootScope.confirmModal($modal, $scope, $log,
                    'Delete Subdevice' + subdevice.name ,
                    'Are you sure you want to delete' + subdevice.name + ' attached to ' + hub.name + ' ?',
                function() {
                    $log.info('ok clicked');
                        $rootScope.skynetSocket.emit('gatewayConfig', {
                            "uuid": hub.uuid,
                            "token": hub.token,
                            "method": "deleteSubdevice",
                            "name": subdevice.name
                        },
                        function (deleteResult) {
                            if(deleteResult.result === 'ok'){
                                hub.subdevices = _.without(hub.subdevices, subdevice);
                            }
                        });
                });
        };

        this.getSubDeviceLogo = function(subdevice){
            var smartDevice = _.findWhere($scope.smartDevices, {
                plugin : subdevice.type
            });

            if(smartDevice){
                return smartDevice.logo;
            }
            return 'assets/images/robots/robot5.png';
        };

        $scope.startCallback = function(event, ui, title) {
          console.log('You started draggin: ' + title.description);
          $scope.draggedTitle = title.description;
          $scope.draggedObject = title;
        };

        $scope.stopCallback = function(event, ui) {
          console.log('Why did you stop draggin me?');
        };

        $scope.dragCallback = function(event, ui) {
          console.log('hey, look I`m flying');
        };

        $scope.dropCallback = function(event, ui) {
          console.log('event', event);
          console.log('ui', ui);
          console.log('hey, you dumped me :-(' , $scope.draggedTitle);
          console.log('subdevice', $scope.draggedObject);
          console.log('hub', event.target.dataset.jqyouiOptions);
          $scope.addSmartDevice($scope.draggedObject, event.target.dataset.jqyouiOptions);
        };

        $scope.overCallback = function(event, ui) {
          console.log('Look, I`m over you');
        };

        $scope.outCallback = function(event, ui) {
          console.log('I`m not, hehe');
        };

    } )

    .controller('DeviceWizardController', function ($rootScope, $cookies, $scope,  $state , $http,  deviceService, GatewayService )

    {


        $scope.isopen = false;
        $scope.wizardStates = {
            instructions: {
                name: 'instructions',
                id: 'connector.devices.wizard.instructions',
                title: 'Install a new Hub'
            },
            findhub: {
                name: 'findhub',
                id: 'connector.devices.wizard.findhub',
                title: 'Add Available Hub'
            }
        }

        $scope.availableGateways = [];
        GatewayService.get(function(data){
            if(data.gateways){
                $scope.availableGateways = _.filter(data.gateways, function(gateway){
                   return gateway.owner === undefined;
                });
            }
        });

        $scope.getNextState = function(){
            return $scope.wizardStates.findhub.id;
        };

        $scope.getPreviousState = function( ){
            return $scope.wizardStates.instructions.id;
        };

        $scope.canClaim = function(name, hub){
            console.log('checkFinish');
            if(name && name.trim().length > 0 && hub ){
                return true;
            }
            return false;
        };
        //Function to enable or disable the Finish and Claim Hub buttons
        $scope.checkClaim = function(name, hub){
            if($scope.canClaim(name, hub)){
                $('#wizard-finish-btn').removeAttr('disabled');
                $('#wizard-claim-btn').removeAttr('disabled');
            } else {
                $('#wizard-finish-btn').attr('disabled');
                $('#wizard-claim-btn').attr('disabled');
            }
        }

        //Notify the parent scope that a new hub has been selected
        $scope.notifyHubSelected = function(hub){
            console.log('hub selected notifying parent scope');
            $scope.$emit('hubSelected', hub);
        };

        //Notify the parent scope that the hub name has been changed
        $scope.notifyHubNameChanged = function(name){
            console.log('name changed notifying parent scope');
            $scope.$emit('hubNameChanged', name);
        }

        //event handler for updating the hubName selected in the child scope
        $scope.$on('hubNameChanged', function(event, name){

            $scope.hubName = name;
        });

        //event handler for updating the hub selected in the child scope.
        $scope.$on('hubSelected', function(event, hub){

            $scope.selectedHub = hub;
        });

        $scope.saveHub = function(hub, hubName){
           if(hub && hubName && hubName.trim().length > 0 ){

               var hubData =
               {
                   uuid : hub.uuid,
                   token : hub.token,
                   owner : $cookies.skynetuuid,
                   name  : hubName,
                   keyvals : []

               };

                 $http.put('/api/devices/' + $cookies.skynetuuid , hubData)
                     .success(function(data){
                         console.log('success');
                         console.log('Data returned ' + data);
                     $state.go('connector.devices', {}, {
                         reload : true
                     }) ;

                })
                 .error(function(data){
                         console.log('error');
                         console.log(data);
                 } );

           }
        } ;

        $scope.toggleOpen = function(){
            $scope.isopen = ! $scope.isopen;
        };

    })
  ;
