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
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        if(realization) {
            req.body.forEach(element => {
                realization.actions.push(element)
            })
            realization.save()
            .then(elem => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(elem);
            })
            .catch(err => next(err));
        } else {
            const realiz = new Realization({child: req.params.childId, actions: req.body})
            Realization.create(realiz)
            .then(realization => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(realization);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /history/${req.params.childId}/`);
})
.delete((req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        if(realization) {
            Realization.findByIdAndDelete(realization._id)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(realization);
            })
            .catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no realization to delete from this child ${req.params.childId}`);
        }
    })
    .catch(err => next(err));
});


module.exports = historyRouter;