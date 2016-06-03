(function() {
  'use strict';
  
  angular
    .module('app')
    .controller('RestaurantsController', RestaurantsController);
    
    function RestaurantsController() {
      this.data = 'the data'; // use {{vm.data}} in the view
    }
}());