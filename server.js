// Babel ES6/JSX Compiler
require('babel-register');

var swig = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config')();
var app = express();

var engine = require('tingodb');
var tungus = require('tungus');
var mongoose = require('mongoose');

var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('app4');
var errorHandler = require('errorhandler');

app.use(favicon(path.join(__dirname, 'public', 'dragon.ico')));
app.use(logger('dev'));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'uwotm8'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res) {
  Router.match({
    routes: routes.default,
    location: req.url
  }, function (err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirecLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
      var page = swig.renderFile('views/index.html', {
        html: html
      });
      res.status(200).send(page);
    } else {
      res.status(404).send('Page Not Found')
    }
  });
});

// mongoose.connect('tingodb://' + __dirname + '/data', function (err, db) {
//   if (err) {
//     console.log('Cannot connect to database');
//   } else {
//     var attachDB = function (req, res, next) {
//       req.db = db;
//       next();
//     };
//
//     debug('Successfully connected to tingodb://' + __dirname + '/data');
//   }
// });

var server = http.createServer(app).listen(config.port, function () {
  debug('Tapp Express server listening on port ' + server.address().port)
});

module.exports = server
