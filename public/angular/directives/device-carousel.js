'use strict';

angular.module('e2eApp')
    .directive('deviceCarousel', function ($compile) {
        return {
            restrict: 'AE',
            replace: true,
            scope : {
                hub : '='
            },
            template: '<div class="owl-carousel owl-theme subdevice-panel"></div>',
            controller : 'DeviceController',
            link: function (scope, element, attr, DeviceController){

                scope.$watch('hub', function(current, old){
                     if(! scope.owl ){
                        scope.owl = $(element);

                        scope.owl.owlCarousel({

                            items : 4,
                            itemsDesktop : [1000,4],
                            itemsDesktopSmall : [900,3],
                            itemsTablet: [600,1],
                            itemsMobile : false,
                            navigation: true
                        });
                     }

                    _.each(scope.owl.data('owlCarousel').$userItems, function () {
                        scope.owl.data('owlCarousel').removeItem();
                    });

                    _.each(scope.hub.subdevices, function (subdevice, index) {

                        var deviceItemHTML =   '<div class="device-carousel-item">' +
                            '<div class="center-block">' +
                            '<img  tooltip="' + subdevice.name + '" tooltip-popup-delay="5" tooltip-placement="top" src="{{getSubDeviceLogo(hub.subdevices[' + index + '])}}" height="110px" width="110px" />' +
                            '</div>'+
                            '<div class="btn-group btn-group-justified" style="width: auto; margin-top: 15px;" >' +
                                '<div class="btn-group">' +
                                    '<button class="btn btn-inverse"  tooltip="Edit" tooltip-popup-delay="5" tooltip-placement="bottom" type="button" ng-click="editSubDevice(hub.subdevices[' + index + '], hub)"><i class="fa fa-edit"></i></button>'+
                                '</div>' +
                                '<div class="btn-group btn-group">' +
                                    '<button class="btn btn-danger"  tooltip="Delete" tooltip-popup-delay="5" tooltip-placement="bottom" type="button" ng-click="deleteSubDevice(hub.subdevices[' + index + '], hub)" ><i class="fa fa-times"></i></button>'+
                                '</div>' +
                            '</div>' +
                            '</div>';


                        var template = angular.element(deviceItemHTML);

                        // Step 2: compile the template
                        var linkFn = $compile(template);

                        // Step 3: link the compiled template with the scope.
                        var element = linkFn(scope);
                        scope.owl.data('owlCarousel').addItem( element);
                    });
                }) ;

                scope.editSubDevice = function(subdevice, hub){
                   return DeviceController.editSubDevice(subdevice, hub);
                } ;


               scope.getSubDeviceLogo = function(subdevice){
                 return DeviceController.getSubDeviceLogo(subdevice);
               };


                scope.deleteSubDevice = function(subdevice, hub){
                    var subDeviceIndex =  _.indexOf(hub.subdevices, subdevice);
                    DeviceController.deleteSubDevice(subdevice, hub);
//                    scope.owl.data('owlCarousel').removeItem(subDeviceIndex);

                }
                scope.$on('$destroy', function() {
                    scope.owl.data('owlCarousel').destroy();
                    scope.owl = undefined;
                });
            }


        }
    })
    .controller('DeviceCarouselController' , function($rootScope, $scope, $state){




    });

//'use strict';
//
//angular.module('partyfindApp')
//    .directive('mapCarousel', function ($timeout) {
//        return {
//            restrict: 'E',
//            replace: true,
//            scope: {
//                ngModel: '='
//            },
//            template:
//                '<div class="owl-carousel owl-theme"></div>',
//            link: function (scope, element, attrs) {
//                scope.$watch('ngModel', function (current, old) {
//                    if (!scope.owl) {
//                        scope.owl = $(element);
//
//                        scope.owl.owlCarousel({
//                            pagination: false,
//                            navigation: false,
//                            autoHeight : true
//                        });
//                    }
//
//                    _.each(scope.owl.data('owlCarousel').$userItems, function () {
//                        scope.owl.data('owlCarousel').removeItem();
//                    });
//
//                    _.each(scope.ngModel, function (model) {
//                        scope.owl.data('owlCarousel').addItem(
//                                '<div class="item">' +
//                                '   <a href="' + model.data.link + '" target="_blank">' +
//                                '       <img src="' + model.data.images.low_resolution.url + '">' +
//                                '   </a>' +
//                                '   <span class="caption">' +
//                                '   <a href="' + model.data.link + '" target="_blank">' +
//                                '       ' + model.data.user.username + ' @ ' + moment(model.created).format('LT') +
//                                '   </a><br />' +
//                                '       ' + model.data.caption.text +
//                                '   </span>' +
//                                '</div>'
//                        );
//                    });
//                }, true);
//            }
//        };
//    });