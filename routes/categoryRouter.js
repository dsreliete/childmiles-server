const express = require('express');
const bodyParser = require('body-parser');
const Category = require('../models/category');

const categoryRouter = express.Router();

categoryRouter.use(bodyParser.json());

categoryRouter.route('/')
.get((req, res, next) => {
    Category.find()
    .then(categories => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Category.create(req.body)
    .then(category => {
        console.log('Category Created ', category);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /child');
})
.delete((req, res, next) => {
    Category.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = categoryRouter;