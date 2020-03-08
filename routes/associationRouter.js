const express = require('express');
const bodyParser = require('body-parser');
const Association = require('../models/association');

const associationRouter = express.Router();

associationRouter.use(bodyParser.json());

associationRouter.route('/')
.get((req, res, next) => {
    Association.find()
    .populate('goals')
    .populate('child')
    .then(associations => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(associations);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /associations');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /associations');
})
.delete((req, res, next) => {
    Association.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


associationRouter.route('/:childId/goals')
.get((req, res, next) => { //retorna lista de tarefas associadas da crianca especifica
    Association.findOne({'child': req.params.childId })
    .populate('goals')
    .then(association => {
        if(association){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(association.goals);
        } else {
            err = new Error(`there is no Goals associated with childId ${req.params.childId}`);
            err.status = 404;
            return next(err)
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => { 
    // permite add goal se nao for repetida na lista de goals associadas a crianca senao criar uma nova associacao
    Association.findOne({'child': req.params.childId })
    .then(association => {
        if(association) {
            req.body.forEach(element => {
                if(association.goals.includes(element._id)){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(`These goals ${req.body} has already associated to child ${req.params.childId}`);
                } else {
                    association.goals.push(element)
                    association.save()
                    .then(elem => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(elem);
                    })
                    .catch(err => next(err));
                }
            })
        } else {
            const assoc = new Association({status: true, child: req.params.childId, goals: req.body});
            Association.create(assoc)
            .then(association => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(association);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /association');
})
.delete((req, res, next) => { //permite deletar as associacoes das tarefas da crianca especificada
    Association.findOne({'child': req.params.childId })
    .then(association => {
        if(association) {
            Association.findByIdAndDelete(association._id)
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`There is no association to delete from this child ${req.params.child}`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

associationRouter.route('/:childId/goals/:goalId')
.get((req, res, next) => { 
    res.statusCode = 403;
    res.end(`GET operation not supported on /association/${req.params.childId}/goals/${req.params.goalId}`);
})
.post((req, res, next) => {
    Association.findOne({'child': req.params.childId })
    .then(association => {
        if(association) {
            if(association.goals.includes(req.params.goalId)){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(`The goal ${req.params.goalId} has already associated to child ${req.params.childId}`);
            } else {
                association.goals.push(req.params.goalId)
                association.save()
                .then(elem => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(elem);
                })
                .catch(err => next(err));
            }
        } else {
            const assoc = new Association({child: req.params.childId, goals: req.params.goalId});
            Association.create(assoc)
            .then(association => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(association);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /association');
})
.delete((req, res, next) => { //permite desassociar tarefa associada a crianca
    Association.findOne({'child': req.params.childId })
    .then(association => {
        if(association) {
            if(association.goals.includes(req.params.goalId)){
                const assocIndex = association.goals.indexOf(req.params.goalId);
                const splicedAssoc = association.goals.splice(assocIndex, 1);
                association.save()
                .then(assoc => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(assoc);
                })
                .catch(err => next(err));
            } else {
                err = new Error(`Goal ${req.params.goalId}is not associated with this child ${req.params.childId} to delete`);
                err.status = 404;
                return next(err);
            }
        } else {
            err = new Error(`Goal ${req.params.goalId}is not associated with this child ${req.params.childId} to delete`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = associationRouter;



