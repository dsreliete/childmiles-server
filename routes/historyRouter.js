const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const Realization = require('../models/realization');
const authentication = require('../authentication');

const historyRouter = express.Router();

historyRouter.use(bodyParser.json());
historyRouter.route('/')
.get(authentication.verifyUser, (req, res, next) => {
    Realization.find()
    .populate('child')
    .populate({ 
        path: 'actions.goal',
        populate: {
            path: 'goal'
        }
    })
    .populate({ 
        path: 'actions.penalty',
        populate: {
            path: 'penalty'
        }
    })
    .populate({ 
        path: 'actions.award',
        populate: {
            path: 'award'
        }
    })
    .then(realizations => {
        if(realizations) {
            const historyArray = [];

            realizations.forEach(elem => {
                let childName = elem.child.name;

                elem.actions.forEach(element => {
                    let dateAction = moment(element.createdAt).format('MM-DD-YYYY');
                    let timeAction = moment(element.createdAt).format('hh:mm A');
                    
                    let typeAction = element.type;
                    let pointAction = element.point;
                    
                    let posPointMsg = pointAction > 0 ? `${pointAction} points` : `${pointAction} point`;
                    let msg = `On ${dateAction} at ${timeAction} ${childName} `;
                    
                    switch(typeAction) {
                        case 'extraNegativePoint':
                            msg+= `lost 1 extra point.`; 
                            break;
                        case 'extraPositivePoint':
                            msg+= `won 1 extra point.`; 
                            break;
                        case 'penalty':
                            let pointValue = JSON.stringify(pointAction).split("-")[1];
                            let negPointMsg = pointValue > 0 ? `${pointValue} points` : `${pointValue} point`;
                            msg+= `lost ${negPointMsg} for ${element.penalty.description}.`; 
                            break;
                        case 'bonus':
                            msg+= `won ${posPointMsg} for ${element.goal.description}.`; 
                            break;
                        case 'rescueAward':
                            let pValue = JSON.stringify(pointAction).split("-")[1];
                            let negPMsg = pValue > 0 ? `${pValue} points` : `${pValue} point`;
                            msg+= `rescue ${negPMsg} to get award: ${element.award.description}.`; 
                            break;
                    }
                    historyArray.push(msg);
                })
            })

            if(historyArray.length > 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(historyArray);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(`It is not possible to show actions history`);
            }
            
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action history to show`);
        }
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
historyRouter.route('/:childId')
.get(authentication.verifyUser, (req, res, next) => {
    Realization.findOne({child: req.params.childId})
    .populate('child')
    .populate({ 
        path: 'actions.goal',
        populate: {
            path: 'goal'
        }
    })
    .populate({ 
        path: 'actions.penalty',
        populate: {
            path: 'penalty'
        }
    })
    .populate({ 
        path: 'actions.award',
        populate: {
            path: 'award'
        }
    })
    .then(realization => {
        if(realization) {
            let historyArray = [];
            realization.actions.forEach(element => {

                let dateAction = moment(element.createdAt).format('MM-DD-YYYY');
                
                let timeAction = moment(element.createdAt).format('hh:mm A');
                
                let typeAction = element.type;
                let pointAction = element.point;
                
                let posPointMsg = pointAction > 0 ? `${pointAction} points` : `${pointAction} point`;
                let msg = `On ${dateAction} at ${timeAction} `;
                
                switch(typeAction) {
                    case 'extraNegativePoint':
                        msg+= `lost 1 extra point.`; 
                        break;
                    case 'extraPositivePoint':
                        msg+= `won 1 extra point.`; 
                        break;
                    case 'penalty':
                        let pointValue = JSON.stringify(pointAction).split("-")[1];
                        let negPointMsg = pointValue > 0 ? `${pointValue} points` : `${pointValue} point`;
                        msg+= `lost ${negPointMsg} for ${element.penalty.description}.`; 
                        break;
                    case 'bonus':
                        msg+= `won ${posPointMsg} for ${element.goal.description}.`; 
                        break;
                    case 'rescueAward':
                        let pValue = JSON.stringify(pointAction).split("-")[1];
                        let negPMsg = pValue > 0 ? `${pValue} points` : `${pValue} point`;
                        msg+= `rescue ${negPMsg} to get award: ${element.award.description}.`; 
                        break;
                }
                historyArray.push(msg);
            })
            if(historyArray.length > 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(historyArray);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(`It is not possible to show actions from this child ${req.params.childId}`);
            }
            
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(`There is no action to show from this child ${req.params.childId}`);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /history/childId');
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /history/childId');
})
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /history/childId');
});


module.exports = historyRouter;