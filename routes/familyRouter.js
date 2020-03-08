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


familyRouter.route('/:familyId')
.get((req, res, next) => {
    Family.findById(req.params.familyId)
    .then(family => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /family/familyId');
})
.put((req, res, next) => {
    Family.findByIdAndUpdate(req.params.familyId, {
        $set: req.body
    }, { new: true })
    .then(family => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Family.findByIdAndDelete(req.params.familyId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = familyRouter;