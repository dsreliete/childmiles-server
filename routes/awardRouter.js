const express = require('express');
const bodyParser = require('body-parser');
const Award = require('../models/award');
const authentication = require('../authentication');
const cors = require('./cors');

const awardRouter = express.Router();

awardRouter.use(bodyParser.json());

awardRouter.route('/test')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Award.find()
    .then(awards => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(awards);
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, (req, res, next) => {
    Award.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//_____________________________________________________________//

awardRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all awards from this family"});
        return;
    }
    const familyId = req.user.family;

    Award.find({family: familyId})
    .then(awards => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(awards);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to create award from this family"});
        return;
    }
    const familyId = req.user.family;

    const award = new Award();
    if(req.body.description){
        award.description = req.body.description;
    }
    if(req.body.point){
        award.point = req.body.point;
    }
    award.family = familyId;

    Award.create(award)
    .then(award => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(award);
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /award');
})
.delete(cors.corsWithOptions, authentication.verifyUser,authentication.verifyRole, (req, res, next) => {

    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to delete all awards from this family"});
        return;
    }
    const familyId = req.user.family;

    Award.deleteMany({family: familyId})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//____________________________________________________________//

awardRouter.route('/:awardId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /awards/${req.params.awardId}`);
})
.post(cors.corsWithOptions, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /awards/${req.params.awardId}`); 
})
.put(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
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
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Award.findByIdAndDelete(req.params.awardId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response); 
    })
    .catch(err => next(err));
});

module.exports = awardRouter;