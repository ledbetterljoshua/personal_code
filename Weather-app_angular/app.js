//MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

/*____________________________________________________*/

//ROUTES
weatherApp.config(function($routeProvider) {

	$routeProvider
	.when('/', {
		templateUrl: './pages/home.htm',
		controller: 'homeController'
	})
	.when('/forecast', {
		templateUrl: 'pages/forecast.htm',
		controller: 'forecastController'
	}) 
    .when('/forecast/:days', {
		templateUrl: 'pages/forecast.htm',
		controller: 'forecastController'
	})

});

/*____________________________________________________*/

// SERVICES
weatherApp.service('cityService', function() {
    this.city = "NY";
});

/*____________________________________________________*/

//CONTROLERS
weatherApp.controller('homeController', 
['$scope', 'cityService', 
function($scope, cityService) {
    
        $scope.city = cityService.city;
    
        $scope.$watch('city', function() {
            cityService.city = $scope.city;
        });
}]);

weatherApp.controller('forecastController', 
['$scope', '$resource', '$routeParams', 'cityService', 
function($scope, $resource, $routeParams, cityService) {
    $scope.city = cityService.city;
    
    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });
    
    $scope.days = $routeParams.days || '2';
    
    $scope.weatherAPI = 
        $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {
        callback:"JSON_CALLBACK" }, {
        get: { method: "JSONP"}});
    
    $scope.weatherResult = 
        $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    
    $scope.covertToFahenheit = function(degK) {
        
        return Math.round((1.8 * (degK - 273)) + 32);
            
    }
    $scope.covertToCelsius = function(degK) {
        
        return Math.round(degK - 273.15);
            
    }
    $scope.convertToDate = function(dt) {
        
        return new Date(dt * 1000);
            
    }
    
    console.log($scope.weatherResult);
}]);











