const express = require('express');
const bodyParser = require('body-parser');
const Realization = require('../models/realization');

const realizationRouter = express.Router();

realizationRouter.use(bodyParser.json());

realizationRouter.route('/')
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
    res.end('POST operation not supported on /realizations');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /realizations');
})
.delete((req, res, next) => {
    Realization.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

realizationRouter.route('/:childId/actions')
.get((req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .populate('goals')
    .populate('penalty')
    .then(realization => {
        if(realization){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(realization.actions);
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
    res.end(`PUT operation not supported on /realizations/${req.params.childId}/actions`);
})
.delete((req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        if(realization) {
            Realization.findByIdAndDelete(realization._id)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
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


realizationRouter.route('/:childId/action/:actionId')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /realizations/${req.params.childId}/actions/${req.params.actionId}`);
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /realizations/${req.params.childId}/actions/${req.params.actionId}`);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /realizations/${req.params.childId}/actions/${req.params.actionId}`);
})
.delete((req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .then(realization => {
        if(realization) {
            //I don't know why checking realization.actions.includes(req.params.actionId) was not working so I did the following shit code!!!  
            for (let i = (realization.actions.length-1); i >= 0; i--) {
                if(realization.actions[i]._id.equals(req.params.actionId)) {
                    const realizIndex = realization.actions.indexOf(req.params.actionId);
                    const splicedRealiz = realization.actions.splice(realizIndex, 1);
                    realization.save()
                    .then(realiz => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(realiz);
                    })
                    .catch(err => next(err));
                    break;
                } else if (i === 1) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(`There is no action to delete from this child ${req.params.childId}`);
                    res.end();
                } else {
                    continue;
                }
            }   
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action to delete from this child ${req.params.childId}!!!`);
        }
    })
    .catch(err => next(err));
});

module.exports = realizationRouter;