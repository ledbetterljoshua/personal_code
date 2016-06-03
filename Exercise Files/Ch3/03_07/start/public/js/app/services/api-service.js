(function() {
  'use strict';
  
  angular
    .module('app')
    .factory('api', apiFactory);
    
  apiFactory.$inject = ['$http'];
  
  function apiFactory($http) {
    return {
      getRestaurants: getRestaurants,
      getRestaurantDetails: getRestaurantDetails
    };
    
    function getRestaurants() {
      return $http.get('/orders/api/restaurants')
        .then(function(response) {
          return response.data;
        });
    }
    
    function getRestaurantDetails(restId) {
      return $http.get('/orders/api/restaurant-details/' + restId)
        .then(function(response) {
          return response.data;
        });
    }
  }
}());