const express = require('express');
const bodyParser = require('body-parser');
const Family = require('../models/family');
const authentication = require('../authentication');
const cors = require('./cors');

const familyRouter = express.Router();

familyRouter.use(bodyParser.json());

// return data from all families
// * this route will be not supported in the future just here during app buiding
familyRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Family.find()
    .then(family => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {
    Family.create(req.body)
    .then(family => {
        console.log('Family Created ', family);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /family');
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Family.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//____________________________________________________________________________//
// return data from specific family
// * PUT available for admin or manager, 
// * DELETE will be not supported in the future, because there is no reason to delete family after created
familyRouter.route('/:familyId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser,(req, res, next) => {
    Family.findById(req.params.familyId)
    .then(family => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(family);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /family/familyId');
})
.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
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
.delete(cors.corsWithOptions, (req, res, next) => {
    Family.findByIdAndDelete(req.params.familyId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = familyRouter;