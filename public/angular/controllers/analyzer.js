'use strict';

angular.module('octobluApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, skynetConfig, elasticService, ownerService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {

            // Get user devices
            console.log("getting devices from ownerService");
            ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
		$scope.splunk_devices = "";
                $scope.devices = data;
                $scope.deviceLookup = {};
                for (var i in $scope.devices) {
                    if($scope.devices[i].type == 'gateway'){
                        $scope.devices.splice(i,1);
                    }
		    $scope.splunk_devices +=  $scope.devices[i].uuid + " OR ";
                    $scope.deviceLookup[$scope.devices[i].uuid] = $scope.devices[i].name;
                }
                $scope.devices[$scope.devices.length] = { _id: "_all", name: "All Devices" };
                console.log($scope.devices);
		console.log($scope.splunk_devices);
            });


            $scope.currentPage = 1;

            $scope.$watch('currentPage', function(newValue, oldValue) {
              $scope.currentPage = newValue;
              $scope.search(newValue);
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
                        "fromUuids": { "terms": { "script_field": "doc['fromUuid.uuid'].value" } }
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
			})
                    }
                    });
		};

            elasticService.getEvents("", function(data) {
                $scope.events = data;
            });
		
            $scope.loadTop();
            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };


            // SETUP CHART
            // http://smoothiecharts.org/tutorial.html

            // var line1 = new TimeSeries();
            // var line2 = new TimeSeries();

            // setInterval(function() {
            //   line1.append(new Date().getTime(), Math.random()*100);
            //   line2.append(new Date().getTime(), Math.random()*100);
            // }, 1000);

            // Initialize up to 10 lines for charting
            /*var line = [];
            for(var i =0; i < 10; i++){
              line[i] = new TimeSeries();
            }            

            // TODO: dynamically select better colors
            var smoothie = new SmoothieChart({ grid: { strokeStyle: 'rgb(125, 0, 0)', fillStyle: 'rgb(60, 0, 0)', lineWidth: 1, millisPerLine: 250, verticalSections: 6 } });
            // smoothie.addTimeSeries(line[1], { strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
            // smoothie.addTimeSeries(line[2], { strokeStyle: 'rgb(255, 0, 255)', fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3 });
            for(var i =0; i < 10; i++){
              smoothie.addTimeSeries(line[i], { strokeStyle: 'rgb(0, ' + 255 + ', 0)', fillStyle: 'rgba(0, ' + 255 + ', 0, 0.4)', lineWidth: 3 });
            }            

            smoothie.streamTo(document.getElementById("mycanvas"), 1000);

	  END OF SMOOTHIE	*/
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



                }

                socket.on('message', function (message) {
                  // plot data
                  // {"payload":{"uuid":"99ede351-d6f6-11e3-abcd-1d32e7e917fb","temperature":"78","ipAddress":"70.171.192.231"},"devices":"99ede351-d6f6-11e3-abcd-1d32e7e917fb"}
                  
                  // remove standard data from payload
                  var sensorData = message.payload;
                  delete sensorData.uuid;
                  delete sensorData.ipAddress;
                  delete sensorData.api;

                  console.log(sensorData);

                  for (var property in sensorData) {
                      if (sensorData.hasOwnProperty(property)) {
                        if (sensorGrid.indexOf(property) == -1){
                          sensorGrid.push(property);
                        }
                        console.log('+' + sensorData[property] + '+');
                        $("#legend").html(JSON.stringify(sensorData));
                        if (sensorData[property] != undefined){

                          for (var i in sensorGrid) {
                            if (property == sensorGrid[i]){
                              line[i].append(new Date().getTime(), sensorData[property] *1);  
                            }

                          }

                        }
                      }
                  }

                  // line1.append(new Date().getTime(), Math.random());
                  // line2.append(new Date().getTime(), Math.random());


                });

            });

        });
    });
