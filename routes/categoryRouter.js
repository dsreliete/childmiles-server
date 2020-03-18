const express = require('express');
const bodyParser = require('body-parser');
const Category = require('../models/category');
const authentication = require('../authentication');

const categoryRouter = express.Router();

categoryRouter.use(bodyParser.json());

categoryRouter.route('/test')
.get((req, res, next) => {
    Category.find()
    .then(categories => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Category.create(req.body)
    .then(category => {
        console.log('Category Created ', category);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /child');
})
.delete((req, res, next) => {
    Category.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//______________________________________________________________//


categoryRouter.route('/')
.get(authentication.verifyUser, (req, res, next) => {
    
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all caregories from this family"});
        return;
    }
    const familyId = req.user.family;
    
    Category.find({family: familyId})
    .then(categories => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(categories);
    })
    .catch(err => next(err));
})
.post(authentication.verifyUser,(req, res, next) => {
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all child from this family"});
        return;
    }
    const familyId = req.user.family;

    const category = Category();
    if(req.body.description){
        category.description = req.body.description;
    }
    category.family = familyId;
    
    Category.create(category)
    .then(category => {
        console.log('Category Created ', category);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    })
    .catch(err => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /child');
})
.delete(authentication.verifyUser,(req, res, next) => {
    
    if(!req.user.family){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({msg: "It is not possible to get all child from this family"});
        return;
    }
    const familyId = req.user.family;

    Category.deleteMany({family: familyId})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

categoryRouter.route('/:categoryId')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /categories/${req.params.categoryId}`); 
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /categories/${req.params.categoryId}`); 
})
.put(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
    Category.findByIdAndUpdate(req.params.categoryId, {
        $set: req.body
    }, { new: true })
    .then(category => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(category);
    })
    .catch(err => next(err));
})
.delete(authentication.verifyUser, authentication.verifyRole,(req, res, next) => {
    Category.findByIdAndDelete(req.params.categoryId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
module.exports = categoryRouter;