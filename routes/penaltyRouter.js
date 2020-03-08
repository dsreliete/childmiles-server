const express = require('express');
const bodyParser = require('body-parser');
const Penalty = require('../models/penalty');

const penaltyRouter = express.Router();

penaltyRouter.use(bodyParser.json());

penaltyRouter.route('/')
.get((req, res, next) => {
    Penalty.find()
    .then(categories => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Penalty.create(req.body)
    .then(penalty => {
        console.log('Penalty Created ', penalty);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(penalty);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /penalty');
})
.delete((req, res, next) => {
    Penalty.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

penaltyRouter.route('/:penaltyId')
.get((req, res, next) => {
    Penalty.findById(req.params.penaltyId)
    .then(categories => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /penalty/penaltyId');
})
.put((req, res, next) => {
    Penalty.findByIdAndUpdate(req.params.penaltyId, {
        $set: req.body
    }, { new: true })
    .then(categories => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Penalty.findByIdAndDelete(req.params.penaltyId, {
        $set: req.body
    }, { new: true })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = penaltyRouter;