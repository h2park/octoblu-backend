'use strict';

angular.module('octobluApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, skynetConfig, elasticService, ownerService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {

            // Get user devices
            console.log("getting devices from ownerService");
            ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
		$scope.logic_devices = "";
                $scope.devices = data;
                $scope.deviceLookup = {};
                for (var i in $scope.devices) {
                    if($scope.devices[i].type == 'gateway'){
                        $scope.devices.splice(i,1);
                    }
		    $scope.logic_devices +=  $scope.devices[i].uuid + " OR ";
                    $scope.deviceLookup[$scope.devices[i].uuid] = $scope.devices[i].name;
                }
                $scope.devices[$scope.devices.length] = { _id: "_all", name: "All Devices" };
		console.log("logging devices");
                console.log($scope.devices);
		console.log($scope.logic_devices);
            });


            $scope.currentPage = 1;

            $scope.$watch('currentPage', function(newValue, oldValue) {
              $scope.currentPage = newValue;
              $scope.search(newValue);
            });
	   
            $scope.$watch('devices', function(newValue, oldValue) {
		if (newValue) {
			console.log("New Value for Devices");
			elasticService.paramSearch("now-1d/d","now", 0, {}, newValue, function(err,data){
                        	if (err) { return console.log(err); }
				console.log("function=paramSearch callback");
                        	console.log(data);
                	});
		    // LOAD GRAPHS
	            $scope.loadTop();


		}
	    });
            $scope.search = function (currentPage) {
              $scope.results="searching...";
                if ($scope.searchText !== undefined) {
                    elasticService.searchAdvanced($scope.searchText, $scope.skynetuuid, currentPage, $scope.eventCode, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                          $scope.results = response;

                          $scope.totalItems = response.hits.total;
                          $scope.maxSize = 10;

                        }
                    });

                } else {
                    $scope.results="";

                }

            };

	    //Load Top Counts Panels On init of page
	$scope.loadTop = function(){
		$scope.step1open = true;
		console.log("Searching LoadTop");
                $scope.loadTopfacetObject = { 
			"toUuids": {"terms": {"script_field": "doc['toUuid.uuid'].value"}}, 
                        "fromUuids": { "terms": { "script_field": "doc['fromUuid.uuid'].value" } },
			"eventCodes": {"terms": { "field": "eventCode" } }
    		};
		elasticService.facetSearch("now-1d/d","now", $scope.skynetuuid, 0, $scope.loadTopfacetObject, function (err, data) {
                    if (err) { return console.log(err); }
		    console.log("Total Top Hits: " + data.hits.total);
		    $scope.topResults =	{
                        total: data.hits.total,
                        fromUuid: _.map(data.facets.fromUuids.terms, function (item) {
                            return {
                                label: item.term,
                                value: item.count
                            };
                        }),
		        toUuid: _.map(data.facets.toUuids.terms, function(item) {
			   return {
				label: item.term,
				value: item.count
			  };
			}),
			eventCodes: _.map(data.facets.eventCodes.terms, function(item) {
			  return {
				label: item.term,
				value: item.count
			  };
			})
                    }
                    });
		};

            elasticService.getEvents("", function(data) {
                $scope.events = data;
            });
		

           //Checkbox Functions for Exploring list.
	$scope.selection = [];
	$scope.toggleSelection = function toggleSelection(fruitName) {
    		var idx = $scope.selection.indexOf(fruitName);

		    // is currently selected
		    if (idx > -1) {
		      $scope.selection.splice(idx, 1);
		    }	

		    // is newly selected
		    else {
		      $scope.selection.push(fruitName);
		    }
		  };
		
            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };

            var sensorGrid = [];

            skynetConfig.uuid = $scope.skynetuuid;
            skynetConfig.token = $scope.skynettoken;


            skynet(skynetConfig, function (e, socket) {
                if (e) throw e;

                $scope.sensorListen = function (sensor){
                  console.log('sensor listen', sensor);
                  sensorGrid = [];
                  // unsubscribe from other devices
                  ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function (data) {

                     // Subscribe to user's devices messages and events
                     if (data) {
                         _.each(data, function (device) {
                             socket.emit('unsubscribe', {
                                 'uuid': device.uuid
                             }, function (data) {
                                  //console.log(data);
                             });

                         });
                     }

                    // subscribe to new device selected for chart
                     socket.emit('subscribe', {
                         'uuid': sensor.uuid
                         // 'token': sensor.token
                     }, function (data) {
                          console.log(data);
                     });
                  });
            };
	 }); //end skynet call
        });
    });
