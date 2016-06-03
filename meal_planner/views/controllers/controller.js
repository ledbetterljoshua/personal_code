var myApp = angular.module('myApp', ['ngMaterial', 'ui.router', 'textAngular']);

myApp.config(function($stateProvider, $urlRouterProvider) {

	
    
$urlRouterProvider.otherwise('/');

$stateProvider
    
    // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
        url: '/',
        templateUrl: '../view-all.ejs'
    })
    .state('new', {
        url: '/new',
        templateUrl: '../new.ejs'
    })
    
});


myApp.controller('newRecipe', function($scope) {
	$scope.tags = [];

    $scope.recipe = {
      title: '',
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      city: '',
      state: '',
      instructions: '',
      postalCode: ''
    };
    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      })
  })
  .config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
  });

myApp.controller('AppCtrl', ['$scope', '$http', 
function($scope, $http) {
	$scope.recipe = {};
	$scope.recipes = {};
	var refreshRecipe = function(){

		$http.get('/api/recipes').success(function(response) {
			$scope.recipes = response;
			$scope.recipe.title = "";
			$scope.recipe.description = "";
		});
	}

	var show = function(){

		$http.get('/api/recipes').success(function(response) {
			$scope.recipes = response;
		});
	}
	show()
	refreshRecipe();

	$scope.addRecipe = function() {
		
		$http.post('/api/recipes', $scope.recipe).success(function(response){
			refreshRecipe();
			console.log($scope.recipe)
		});
		 
	};

	$scope.remove = function(id) {
		
		console.log(id);
		$http.delete('/api/recipes/' + id).success(function(response) {
			refreshRecipe();
		});
	};

	$scope.edit = function(id){
		console.log(id);
		$http.get('/api/recipes/' + id).success(function(response) {
			$scope.recipe = response;
		});
	};


}]);