var express = require('express');
var stormpath = require('express-stormpath');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

var stormpathMiddleware = stormpath.init(app, {
  apiKeyFile: './apiKey-16QFOO13E6ZB89WNBXL972MDV.properties',
  application: 'https://api.stormpath.com/v1/applications/4iJ7FMWsiLhDiEh3gKgZku',
  secretKey: 'asdfghjklkjkl;',
  expandCustomData: true,
  enableForgotPassword: true
});

app.use(stormpathMiddleware);

app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});

app.listen(3000);