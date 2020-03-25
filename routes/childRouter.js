const express = require('express');
const bodyParser = require('body-parser');
const Child = require('../models/child');
const authentication = require('../authentication');
const cors = require('./cors');

const childRouter = express.Router();

childRouter.use(bodyParser.json());

childRouter.route('/test')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Child.find()
    .populate('family')
    .then(children => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(children);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Child.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
//_______________________________________________________________________________//
childRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all child from this family"});
        return;
    }
    const familyId = req.user.family;

    Child.find({family: familyId})
    .then(children => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(children);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all child from this family"});
        return;
    }
    const familyId = req.user.family;

    const child = Child();
    if(req.body.name){
        child.name = req.body.name;
    }

    if(req.body.gender){
        child.gender = req.body.gender;
    }

    if(req.body.image){
        child.image = req.body.image;
    }

    if(req.body.dateBirth){
        child.dateBirth = req.body.dateBirth;
    }
    child.family = familyId;

    Child.create(child)
    .then(child => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(child);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /child');
})
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to delete all child from this family"});
        return;
    }
    const familyId = req.user.family;

    Child.deleteMany({family: familyId})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

childRouter.route('/:childId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /child/${req.params.childId}`); 
})
.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /child/${req.params.childId}`); 
})
.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Child.findByIdAndUpdate(req.params.childId, {
        $set: req.body
    }, { new: true })
    .then(child => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(child);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Child.findByIdAndDelete(req.params.childId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = childRouter;