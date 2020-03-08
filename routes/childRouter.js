const express = require('express');
const bodyParser = require('body-parser');
const Child = require('../models/child');

const childRouter = express.Router();

childRouter.use(bodyParser.json());

childRouter.route('/')
.get((req, res, next) => {
    Child.find()
    .then(children => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(children);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Child.create(req.body)
    .then(child => {
        console.log('Child Created ', child);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(child);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /child');
})
.delete((req, res, next) => {
    Child.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

childRouter.route('/:childId')
.get((req, res, next) => {
    Child.findById(req.params.childId)
    .then(child => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(child);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /child/${req.params.childId}`); 
})
.put((req, res, next) => {
    Child.findByIdAndUpdate(req.params.childId, {
        $set: req.body
    }, { new: true })
    .then(child => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(child);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Child.findByIdAndDelete(req.params.childId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
module.exports = childRouter;