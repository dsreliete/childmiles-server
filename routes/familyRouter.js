const express = require('express');
const bodyParser = require('body-parser');
const Family = require('../models/family');

const familyRouter = express.Router();

familyRouter.use(bodyParser.json());

familyRouter.route('/')
.get((req, res, next) => {
    Family.find()
    .then(family => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Family.create(req.body)
    .then(family => {
        console.log('Child Created ', family);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /family');
})
.delete((req, res, next) => {
    Family.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = familyRouter;