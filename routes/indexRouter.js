const express = require('express');
const passport = require('passport');

const Role = require('../role');
const User = require('../models/user');
const Family = require('../models/family');
const authentication = require('../authentication');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authentication.getToken({_id: req.user._id, family: req.user.family});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

//signup para criar familia nova e usuario admin
router.post('/signup', (req, res) => {

  let familyName = JSON.stringify(Math.random());
  let familyId = '';
  const newFamily = new Family({ familyName: familyName, image: '' });
  Family.create(newFamily)
  .then(family => {
    familyId = family._id;
  })
  .catch(err => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({err: err, msg: "no family saved"});
    return;
  })
  
  //static method from passpot-local-mongoose to register username and pswd
    User.personSchema.register(new User.personSchema({username: req.body.username}),
        req.body.password,
        (err, person) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err, msg: "User.personSchema not working"});
            } else {
                if (req.body.firstname) {
                    person.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    person.lastname = req.body.lastname;
                }
                person.role = Role.Admin;
                person.family = familyId;
                person.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err, msg: "no person saved"});
                        return;
                    }
                    
                    const newUser = new User.groupSchema({family: familyId})
                    newUser.people.push(person);

                    User.groupSchema.create(newUser)
                    .then(group => {
                      res.statusCode = 200;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({success: true, status: 'Registration Successful!', group: group});
                    })
                    .catch(err => {
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({err: err, msg: "no user saved"});
                      return;
                    });
                });
            }
    });
});

module.exports = router;
