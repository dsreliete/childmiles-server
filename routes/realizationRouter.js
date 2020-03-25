const express = require('express');
const bodyParser = require('body-parser');
const Realization = require('../models/realization');
const authentication = require('../authentication');
const cors = require('./cors');

const realizationRouter = express.Router();

realizationRouter.use(bodyParser.json());

realizationRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
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
.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /realizations');
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /realizations');
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Realization.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
//________________________________________________________________________//
realizationRouter.route('/:childId/actions')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {
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
.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
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
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /realizations/${req.params.childId}/actions`);
})
.delete(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(`DELETE operation not supported on /realizations/${req.params.childId}/actions`);
});


//________________________________________________________________________//

realizationRouter.route('/:childId/action/:actionId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /realizations/${req.params.childId}/actions/${req.params.actionId}`);
})
.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /realizations/${req.params.childId}/actions/${req.params.actionId}`);
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /realizations/${req.params.childId}/actions/${req.params.actionId}`);
})
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        const id = req.params.id
        if(realization) {
            if(realization.actions.some(element => element._id.equals(req.params.actionId))) {
                const realizIndex = realization.actions.findIndex(elem => elem._id === req.params.actionId);
                const splicedRealiz = realization.actions.splice(realizIndex, 1);
                realization.save()
                .then(realiz => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(realiz);
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(`There is no action ${req.params.actionId} to delete from this child ${req.params.childId}`);
            }
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action to delete from this child ${req.params.childId}!!!`);
        }
    })
    .catch(err => next(err));
});

//________________________________________________________________________//
realizationRouter.route('/:childId/actions/totalPoints')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        if(realization) {
            Realization.fetchTotalPointsPerChild(req.params.childId)
            .then(result => {
                if(result){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(result);
                }
            })
            .catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action to show from this child ${req.params.childId}`);
        }
    })
    .catch(err => next(err));
});

//________________________________________________________________________//
realizationRouter.route('/:childId/actions/totalPoints/today')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        if(realization) {
            Realization.fetchTotalPointsPerChildToday(req.params.childId)
            .then(result => {
                if(result){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(result);
                }
            })
            .catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action to show from this child ${req.params.childId}`);
        }
    })
    .catch(err => next(err));
});

//________________________________________________________________________//
realizationRouter.route('/:childId/actions/totalPoints/byPeriod')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        if(realization) {
            Realization.fetchTotalPointsPerChildWeek(req.params.childId)
            .then(result => {
                if(result){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(result);
                }
            })
            .catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action to show from this child ${req.params.childId}`);
        }
    })
    .catch(err => next(err));
});

module.exports = realizationRouter;