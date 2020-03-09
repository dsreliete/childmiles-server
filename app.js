const express = require('express');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const passport = require('passport');

const config = require('./config');
const indexRouter = require('./routes/indexRouter');
const childRouter = require('./routes/childRouter');
const familyRouter = require('./routes/familyRouter');
const categoryRouter = require('./routes/categoryRouter');
const awardRouter = require('./routes/awardRouter');
const penaltyRouter = require('./routes/penaltyRouter');
const goalRouter = require('./routes/goalRouter');
const associationRouter = require('./routes/associationRouter');
const realizationRouter = require('./routes/realizationRouter');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server \o/'), 
    err => console.log(err)
);

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
app.use('/family', familyRouter);
app.use('/categories', categoryRouter);
app.use('/awards', awardRouter); 
app.use('/penalties', penaltyRouter);
app.use('/goals', goalRouter);
app.use('/associations', associationRouter);
app.use('/realizations', realizationRouter);

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