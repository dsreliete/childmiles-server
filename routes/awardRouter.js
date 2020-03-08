const express = require('express');
const bodyParser = require('body-parser');
const Award = require('../models/award');

const awardRouter = express.Router();

awardRouter.use(bodyParser.json());

awardRouter.route('/')
.get((req, res, next) => {
    Award.find()
    .then(awards => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(awards);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Award.create(req.body)
    .then(award => {
        console.log('Penalty Created ', award);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(award);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /award');
})
.delete((req, res, next) => {
    Award.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

awardRouter.route('/:awardId')
.get((req, res, next) => {
    Award.findById(req.params.awardId)
    .then(award => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(award);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /awards/${req.params.awardId}`); 
})
.put((req, res, next) => {
    Award.findByIdAndUpdate(req.params.awardId, {
        $set: req.body
    }, { new: true })
    .then(award => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(award);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Award.findByIdAndDelete(req.params.awardId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); 
    })
    .catch(err => next(err));
});

module.exports = awardRouter;