const express = require('express');
const createError = require('http-errors');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const indexRouter = require('./routes/indexRouter');
const childRouter = require('./routes/childRouter');
const familyRouter = require('./routes/familyRouter');
const categoryRouter = require('./routes/categoryRouter');
const awardRouter = require('./routes/awardRouter');
const penaltyRouter = require('./routes/penaltyRouter');
const goalRouter = require('./routes/goalRouter');
const associationRouter = require('./routes/associationRouter');
const realizationRouter = require('./routes/realizationRouter');
const historyRouter = require('./routes/historyRouter');
const userRouter = require('./routes/userRouter');

const url = process.env.MONGODB_URI;
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/child', childRouter);

app.use(express.static(__dirname + '/public'));

app.use('/family', familyRouter);
app.use('/categories', categoryRouter);
app.use('/awards', awardRouter); 
app.use('/penalties', penaltyRouter);
app.use('/goals', goalRouter);
app.use('/associations', associationRouter);
app.use('/realizations', realizationRouter);
app.use('/history', historyRouter);
app.use('/users', userRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;