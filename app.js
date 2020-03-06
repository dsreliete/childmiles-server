const express = require('express');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const passport = require('passport');

const indexRouter = require('./routes/indexRouter');
const childRouter = require('./routes/childRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/child', childRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;