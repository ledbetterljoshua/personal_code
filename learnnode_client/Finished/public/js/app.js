angular.module('TestApp', []);

angular.module('TestApp')
	.controller('MainController', ctrlFunc);

function ctrlFunc() {
	this.message = 'Hello Josiah';

	this.people = [
		{
			name: 'John'
		}, 
		{
			name: 'Jane'
		}, 
		{
			name: 'Jim'
		}
	]
}