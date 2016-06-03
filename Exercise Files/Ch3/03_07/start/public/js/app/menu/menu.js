(function() {
  'use strict';
  
  angular
    .module('app')
    .controller('MenuController', MenuController);
    
  MenuController.$inject = ['api', '$routeParams'];
  
  function MenuController(api, $routeParams) {
    var vm = this;
    
    api.getRestaurantDetails($routeParams.restId)
      .then(function(data) {
        vm.restaurant = data;
      });
  }
}());