const express = require('express');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const atob = require('atob');

const Role = require('../role');
const User = require('../models/user');
const Family = require('../models/family');
const authentication = require('../authentication');
const conf = require('../config');

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

  let familyId = '';
  const newFamily = new Family({ familyName: JSON.stringify(Math.random()), image: '' });
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
    User.register(new User({username: req.body.username}),
        req.body.password,
        (err, person) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err, msg: "It is not possible to create a new user"});
            } else {
                if (req.body.firstname) {
                    person.firstname = req.body.firstname;
                }
                if (req.body.lastname) {
                    person.lastname = req.body.lastname;
                }
                if (req.body.email) {
                  person.email = req.body.email;
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
                    
                    sendVerificationEmail(person, req, res)
                });
            }
    });
});

router.get('/verifyEmail/:token', (req,res) => {
  if(!req.params.token) return res.status(400).json({message: "We were unable to find a user for this token."});

  const decodedToken = decodeToken(req.params.token);

  User.findById(decodedToken._id)
  .then(user => {
    if(user) {

      user.isVerified = true;
      user.save(function (err) {
        if (err) return res.status(500).json({message:err.message});

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!', user: user});  
      });
    }
  })
  .catch(err => nexr(err));
});

function sendVerificationEmail(user, req, res){
  
      const token = authentication.getEmailToken({_id: user._id});

      sgMail.setApiKey(conf.sendgridKey);

      const link="https://"+req.headers.host+"/verifyEmail/"+token;
      const msg = {
        to: user.email,
        from: conf.fromEmail,
        subject: 'Account Verification Token',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<p>Hi ${user.firstname}<p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
        <br><p>If you did not request this, please ignore this email.</p>`
      };
      sgMail.send(msg)
      .then(result => {
          res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});
      })
      .catch(err => console.log(err));
}

function decodeToken(token) {
  const base64Url = token.split('.')[1];
  console.log("base64Url", base64Url);
  return JSON.parse(atob(base64Url));
}

module.exports = router;
