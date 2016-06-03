// app.js
var myApp = angular.module('myApp', ['ui.router', 'ngMaterial']);

myApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
        url: '/',
        controller: 'AppCtrl',
        views: {
        	'': { templateUrl: '../partials/home.ejs' },
        	'viewAll@home': { templateUrl: '../partials/view-all.ejs' }, 
        	'details@home': { templateUrl: '../partials/about.ejs' }
        }
    })

    // nested list with custom controller
    .state('new', {
        url: '/new',
        templateUrl: '../partials/form.ejs',
        controller: function($scope, $http) {
            $scope.match = {};
            $scope.match.items = [];
            $scope.match.steps = [];

	        $scope.addItems = function () {
	          $scope.itemsId = $scope.match.items.length;
	          $scope.match.items.push({ 
	          	_id: "Item-" + $scope.itemsId,
	            text: ""
	          });
	          console.log($scope.match.items)
	        };

	        $scope.addSteps = function () {
	          $scope.stepsId = $scope.match.steps.length;
	          $scope.match.steps.push({ 
	          	_id: "Step-" + $scope.stepsId,
	            text: ""
	          });
	          console.log($scope.match.steps)
	        };

	        $scope.addPost = function() {
				//$scope.post.url = parenturl;
				
				$http.post('/api/posts', $scope.match).success(function(response){
					// refreshPost();
					// showSimpleToast();
					console.log('should be done yo')
				});
				 
			};
        }
    });
       
});

// let's define the scotch controller that we call up in the about state
myApp.controller('AppCtrl', function($scope, $http) {

    $http.get('/api/posts').then(function(response) {
    	$scope.things = response.data;
    });

    $scope.information = {title: "hello"};
    console.log($scope.information)
    $scope.getInfo = function(id) {
    	$http.get('/api/posts/' + id).then(function(response) {
	    	$scope.information = response.data;
	    	console.log($scope.information)
	    });	
    }
    
});