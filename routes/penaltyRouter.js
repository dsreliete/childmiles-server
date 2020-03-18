const express = require('express');
const bodyParser = require('body-parser');
const Penalty = require('../models/penalty');
const authentication = require('../authentication');

const penaltyRouter = express.Router();

penaltyRouter.use(bodyParser.json());

penaltyRouter.route('/test')
.get((req, res, next) => {
    Penalty.find()
    .then(penalties => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(penalties);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Penalty.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//______________________________________________________________//

penaltyRouter.route('/')
.get(authentication.verifyUser, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all registered penalties  from this family"});
        return;
    }
    const familyId = req.user.family;

    Penalty.find({family: familyId})
    .then(penalties => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(penalties);
    })
    .catch(err => next(err));
})
.post(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to create new penalty for this family"});
        return;
    }
    const familyId = req.user.family;
    
    const penalty = new Penalty();
    if(req.body.description){
        penalty.description = req.body.description;
    }
    if(req.body.point){
        penalty.point = req.body.point;
    }
    penalty.family = familyId;
    
    Penalty.create(penalty)
    .then(penalt => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(penalt);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /penalty');
})
.delete(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to delete penalty from this family"});
        return;
    }
    const familyId = req.user.family;

    Penalty.deleteMany({family: familyId})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//____________________________________________________________//

penaltyRouter.route('/:penaltyId')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /penalty/penaltyId');
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /penalty/penaltyId');
})
.put(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Penalty.findByIdAndUpdate(req.params.penaltyId, {
        $set: req.body
    }, { new: true })
    .then(penalty => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(penalty);
    })
    .catch(err => next(err));
})
.delete(authentication.verifyUser, authentication.verifyRole,(req, res, next) => {
    Penalty.findByIdAndDelete(req.params.penaltyId, {
        $set: req.body
    }, { new: true })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = penaltyRouter;