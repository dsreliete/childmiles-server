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

goalRouter.route('/:goalId')
.get((req, res, next) => {
    Goal.findById(req.params.goalId)
    .populate('category')
    .then(goal => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goal);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /goal/goalId');
})
.put((req, res, next) => {
    Goal.findByIdAndUpdate(req.params.goalId, {
        $set: req.body
    }, { new: true })
    .then(goal => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goal);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Goal.findByIdAndDelete(req.params.goalId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = goalRouter;