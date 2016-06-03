var express = require('express');
var router = express.Router();
var restrict = require('../auth/restrict')
var orderService = require('../services/order-service');

router.get('/', restrict, function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  var vm = {
    title: 'Place an order',
    orderId: req.session.orderId,
    firstName: req.user ? req.user.firstName : null
  };
  res.render('orders/index', vm);
});

router.get('/api/restaurants', restrict, function(req, res, next) {
  orderService.getRestaurants(function(err, restaurants) {
    if (err) {
      return res.status(500).json({error: 'Failed to retrieve restaurants'});
    }
    res.json(restaurants);
  });
});

router.get('/api/restaurant-details/:restId', function(req, res, next) {
  orderService.getRestaurantDetails(req.params.restId, function(err, details) {
    if (err) {
      return res.status(500).json({error: 'Failed to retrieve details'});
    }
    res.json(details);
  });
});

module.exports = router;
