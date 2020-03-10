const express = require('express');
const bodyParser = require('body-parser');
const Realization = require('../models/realization');

const historyRouter = express.Router();

historyRouter.use(bodyParser.json());
historyRouter.route('/')
.get((req, res, next) => {
    Realization.find()
    .populate('goals')
    .populate('child')
    .populate('penalty')
    .then(realizations => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(realizations);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /history');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /history');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /history');
});

//------------------------------------------------------------//
realizationRouter.route('/:childId')
.get((req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .populate('goals')
    .populate('penalty')
    .then(realization => {
        if(realization){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(realization);
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action to show from this child ${req.params.childId}`);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /history/childId');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /history/childId');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /history/childId');
});


module.exports = historyRouter;