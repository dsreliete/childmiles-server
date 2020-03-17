const express = require('express');
const bodyParser = require('body-parser');
const Child = require('../models/child');
const authentication = require('../authentication');

const childRouter = express.Router();

childRouter.use(bodyParser.json());

childRouter.route('/test')
.get((req, res, next) => {

    Child.find()
    .then(children => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(children);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
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
.get(authentication.verifyUser, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all child from this family"});
        return;
    }
    const familyId = req.user.family;

    Child.find({family: familyId})
    .then(children => {
        console.log('Family get', familyId);
        console.log('children ', children);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(children);
    })
    .catch(err => next(err));
})
.post(authentication.verifyUser, (req, res, next) => {

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
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /child');
})
.delete(authentication.verifyUser, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all child from this family"});
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
.get((req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /child/${req.params.childId}`); 
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /child/${req.params.childId}`); 
})
.put(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
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
.delete(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Child.findByIdAndDelete(req.params.childId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
module.exports = childRouter;