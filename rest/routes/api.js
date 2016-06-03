var express = require('express');
var router = express.Router();

var Product = require("../models/products");

Product.methods(['get', 'put', 'post', 'delete']);
Product.register(router, '/saved');

module.exports = router;