var ordrx = require('ordrin-api');
var config = require('../config');

var api = new ordrx.APIs(config.ordrxKey, ordrx.TEST);

exports.getRestaurants = function(next) {
  var hotel = config.address;
  var args = {
    datetime: 'ASAP',
    addr: hotel.addr,
    city: hotel.city,
    zip: hotel.zip
  };
  api.delivery_list(args, function(err, restaurants) {
    if (err) {
      console.log(err);
      return next(err);
    }
    restaurants = restaurants.filter(function(rest) {
      return rest.is_delivering;
    });
    next(null, restaurants);
  });
};

exports.getRestaurantDetails = function(restId, next) {
  api.restaurant_details({rid: restId}, function(err, details) {
    if (err) {
      console.log(err);
    }
    next(err, details);
  });
};