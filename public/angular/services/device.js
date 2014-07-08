angular.module('octobluApp')
    .service('deviceService', function ($q, $http) {
        var myDevices = [];

        this.getDevices = function (force) {
            if (myDevices && myDevices.length && !force) {
                var defer = $q.defer();
                defer.resolve(myDevices);
                return defer.promise;
            } else {
                return $http.get('/api/devices').then(function (res) {
                   angular.copy(res.data, myDevices);
                   return myDevices;
                }, function (err) {
                    console.log(err);
                    return [];
                });
            }
        };

        this.createDevice = function (deviceData) {
            return $http.post('/api/devices', deviceData).then(function (res) {
                return res.data;
            });
        };

        this.claimDevice = function (deviceUUID) {
            return $http.put('/api/devices/' + deviceUUID + '/claim', {uuid: deviceUUID}).then(function (res) {
                myDevices = myDevices.push(res.data);
                return res.data;
            });
        };

        this.updateDevice = function (deviceUUID, deviceData) {
            return $http.put('/api/devices/' + deviceUUID, deviceData).then(function (res) {
                return res.data;
            });
        };

        this.deleteDevice = function (deviceUUID) {
            return $http.delete('/api/devices/' + deviceUUID).then(function (res) {
                return res.data;
            });
        };

        this.getUnclaimedDevices = function () {
            return $http.get('/api/devices/unclaimed').then(function (res) {
                return res.data;
            });
        };
    });