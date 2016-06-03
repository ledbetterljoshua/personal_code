(function() {
  'use strict';
  
  angular
    .module('app')
    .controller('MenuController', MenuController);
    
  MenuController.$inject = ['api', '$routeParams', 'ngDialog', '$scope'];
  
  function MenuController(api, $routeParams, ngDialog, $scope) {
    var vm = this;
    
    api.getRestaurantDetails($routeParams.restId)
      .then(function(data) {
        vm.restaurant = data;
      });
      
      vm.viewItem = function(item) {
        vm.activeItem = item;
        vm.activeItem.options = [];
        
        ngDialog.open({
          templateUrl: 'item.html',
          className: 'ngdialog-theme-default',
          scope: $scope
        });
      };
  }
}());