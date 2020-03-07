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

module.exports = childRouter;