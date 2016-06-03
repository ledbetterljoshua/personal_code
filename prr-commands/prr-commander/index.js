#!/usr/bin/env node --harmony

//dependencies
var program = require('commander');
var lazy = require("lazy");
var fs = require('fs');
var path = require('path');
var ProgressBar = require('progress');
var prompt = require('promptly');

//function for adding and editing tags
var createTag = require("./tags.js");

//files to edit
var tagsProp  = "./prr-templates/tags.properties";
var tagConfig = "./config/reviewTagConfiguration.xml";


program
	.version('0.0.1')
	.command('createTag')
	.action(function () {
	//key, text, externalID, group, category
	prompt.prompt('Tag text: ', function (err, value) {
	var text = value;
	prompt.prompt('Tag key: ', function (err, value) {
	var key = value;
	prompt.prompt('Tag externalID: ', function (err, value) {
	var externalID = value;
	prompt.prompt('Tag group: ', function (err, value) {
	var group = value;
	prompt.prompt('Tag category: ', function (err, value) {
	var category = value;
		createTag.createTagProp(key, text, externalID, group, category);
	}); }); }); }); });
});
 
program.parse(process.argv);