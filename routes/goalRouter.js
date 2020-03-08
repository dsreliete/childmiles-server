const express = require('express');
const bodyParser = require('body-parser');
const Goal = require('../models/goal');

const goalRouter = express.Router();

goalRouter.use(bodyParser.json());

goalRouter.route('/')
.get((req, res, next) => {
    Goal.find()
    .populate('category')
    .then(goals => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goals);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Goal.create(req.body)
    .then(goal => {
        console.log('Goal Created ', goal);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goal);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /goal');
})
.delete((req, res, next) => {
    Goal.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = goalRouter;