const express = require('express');
const bodyParser = require('body-parser');
const Goal = require('../models/goal');
const authentication = require('../authentication');
const cors = require('./cors');

const goalRouter = express.Router();

goalRouter.use(bodyParser.json());

goalRouter.route('/test')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Goal.find()
    .populate('category')
    .then(goals => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goals);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Goal.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//________________________________________________________________//

goalRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {
    
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all goals from this family"});
        return;
    }
    const familyId = req.user.family;

    Goal.find({family: familyId})
    .populate('category')
    .then(goals => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goals);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to create a new goal for this family"});
        return;
    }
    const familyId = req.user.family;
    
    const goal = new Goal();
    if(req.body.description){
        goal.description = req.body.description;
    }
    if(req.body.greenPoint){
        goal.greenPoint = req.body.greenPoint;
    }
    if(req.body.yellowPoint){
        goal.yellowPoint = req.body.yellowPoint;
    }
    if(req.body.redPoint){
        goal.redPoint = req.body.redPoint;
    }
    if(req.body.category){
        goal.category = req.body.category;
    }
    goal.family = familyId;

    Goal.create(goal)
    .then(task => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(task);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /goal');
})
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to delete all goals from this family"});
        return;
    }
    const familyId = req.user.family;

    Goal.deleteMany({family: familyId})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//____________________________________________________________________________________//

goalRouter.route('/:goalId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /goal/goalId');
})
.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /goal/goalId');
})
.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Goal.findByIdAndUpdate(req.params.goalId, {
        $set: req.body
    }, { new: true })
    .then(goal => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(goal);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Goal.findByIdAndDelete(req.params.goalId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//______________________________________________________________________________________//

goalRouter.route('/perCategory/:categoryId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {
    
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get goals/perCategory for this family"});
        return;
    }
    const familyId = req.user.family;
    
    Goal.fetchGoalsPerCategory(req.params.categoryId, familyId)
    .then(result => {
        if(result){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        }

    })
    .catch(err => next(err));

})

module.exports = goalRouter;