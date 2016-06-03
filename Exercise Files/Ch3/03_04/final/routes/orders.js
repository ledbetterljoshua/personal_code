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

module.exports = router;
