//define environment and character
	//something you do it good. Something you do it bad. 
var up;
var down;
var left;
var right;

var env = [
function(){
	return 1;
},
function(){
	return 0;
},
function(){
	return 1;
},
function(){
	return 0;
},
];


var character = new Object;

var database = [];

//set up the code to make the character 
//do things based on the number the thing he is trying to do, has

character.look = function() {
	for(i in env) {
		database.push(env[i])
	}
	database[0].weight = database[0]();
}



//create a search function that looks at the database to see if 
//you have done the certain thing before

//define character
	//make it move through out the environment, automatically trying to interact with it