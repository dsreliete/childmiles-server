const express = require('express');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const atob = require('atob');

const Role = require('../role');
const User = require('../models/user');
const Family = require('../models/family');
const authentication = require('../authentication');
const cors = require('./cors');

const router = express.Router();

/* GET home page. */
router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/login')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  const token = authentication.getToken({_id: req.user._id, family: req.user.family});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

//signup para criar familia nova e usuario admin
router.route('/signup')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, (req, res) => {

    let familyId = '';
    const newFamily = new Family({ familyName: '', image: '' });
    Family.create(newFamily)
    .then(family => {
        familyId = family._id;
    })
    .catch(err => {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, message: "It is not possible to create a new family user"});
        return;
    })

  //static method from passpot-local-mongoose to register username and pswd
    User.register(new User({username: req.body.username}),
        req.body.password,
        (err, person) => {
            if (err) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, message: "A user with the given username is already registered"});
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
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: false, message: "A user with the given email is already registered"});
                        return;
                    }
                    
                    const token = authentication.getEmailToken({_id: person._id});
                    // const link="http://"+req.headers.host+"/verifyEmail/"+token;
                    const link="http://localhost:3000/verifyEmail/"+token;
                    // const link="http://localhost:3000/verifyEmail/"+person.email;
                    const msg = buildVerificationEmail(person, link)

                    sgMail.send(msg)
                    .then(result => {
                        res.status(200).json({success: true, message: `${person.firstname} ${person.lastname}, a verification email has been sent to ${person.email}`});
                    })
                    .catch(err => res.status(200).json({success: false, message: `${person.firstname} ${person.lastname}. It was not possible to send a verification email! Try again clicking on the link below`}));
                });
            }
    });
});

//link que o usuario clica para verificar email
router.route('/verifyEmail/:token')
.options(cors.cors, (req, res) => res.sendStatus(200))
.get(cors.cors, (req,res, next) => {
    if(!req.params.token) return res.status(200).json({success: false, message: "We were unable to find a user with this token."});
    
    const decodedToken = decodeToken(req.params.token);

    User.findById(decodedToken._id)
    .then(user => {
        if(user) {
            user.isVerified = true;
            user.save(function (err) {
                if (err) return res.status(200).json({ success: false, user: user, message: "It is not possible to activate your account."});

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, user: user, message: 'Registration Successful!'});  
            });
        }
    })
    .catch(err => {
        return res.status(200).json({success: false, message: "It is not possible to activate your account." })
    });
});


router.route('/resendEmail')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, (req, res) => {
    const email = req.body.email
    if(email) {
        User.findOne({email})
        .then(person => {
            if(person) {
                
                const token = authentication.getEmailToken({_id: person._id});
                const link="http://"+req.headers.host+"/verifyEmail/"+token;
                const msg = buildVerificationEmail(person, link);

                try {
                    sgMail.send(msg) 
                    .then(result => {
                        return res.status(200).json({success: true, message: `A new verification email has been sent to ${person.email}.`});
                    })
                    .catch(err => {throw err})
                } catch (err) {
                    return res.status(200).json({success: false, message: 'It was not possible to send a new verification email!'});
                }
            }
        })
        .catch(err => res.status(200).json({success: false, message : "It is not possible to send a new email verification. Try to get a new verification email!"}))
    }
})

// envio de link para mudar senha por email
router.route('/recoverCredentials')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, (req, res) => {

    User.findOne({email: req.body.email})
    .then(user => {

        if(!user) return res.status(400).json({message: "We were unable to find a user for this email."});  

        sgMail.setApiKey(process.env.SENDGRID_KEY);

        const token = authentication.getEmailToken({_id: user._id});
        const link = "https://" + req.headers.host + "/reset/" + token;
        const msg = {
            to: user.email,
            from: process.env.FROM_EMAIL,
            subject: "Password change request",
            text: 'Child Miles: an efficient app to manage child tasks!',
            html: `<p>Hi ${user.username}</p>
            <p>Please click on the following <a href="${link}">link</a> to reset your password.</p> 
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        };

        sgMail.send(msg)
        .then(result => {
            res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'});
        })
        .catch(err => res.status(500).json({message: err.message}));
    })
    .catch(err => {
        return res.status(401).json({ error: err, message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`});
    })
});

// mudanca de senha
router.route('/reset/:token')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions, (req, res, next) => {

    const token = req.params.token; 
    if(!token) return res.status(400).json({message: "It is impossible to find a user for this token."});

    const decodedToken = decodeToken(token);

    User.findById(decodedToken._id)
    .then(user => {
        if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
        res.status(200).json({link: `https://${req.headers.host}/updateCredentials/${user._id}`})
    })
    .catch(err => next(err));
    });


// retorno da mudanca de senha  com sucesso  
router.route('/updateCredentials/:userId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.corsWithOptions,(req, res) => {
    const userId  = req.params.userId;

    User.findById(userId)
    .then(user => {
        if (!user) return res.status(401).json({message: 'It is not possible to recover password. Try again!'});

        user.setPassword(req.body.password, (err) => {
        if (err) return res.status(500).json({message:err.message});
        
        user.save(function(err) {
            if (err) res.status(500).json({message:err.message});
            
                const msg = {
                    to: user.email,
                    from: process.env.FROM_EMAIL,
                    subject: "Your password has been changed",
                    text: 'Child Miles: an efficient app to manage child tasks!',
                    html: `<p>Hi ${user.username}</p>
                    <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`
                };

                sgMail.setApiKey(process.env.SENDGRID_KEY);
                sgMail.send(msg)
                .then(result => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Update password successful!'});  
                })
                .catch(err => res.status(500).json({message: err.message}));
            });
        });
    })
    .catch(err => res.status(500).json({message: err.message}));
});

function decodeToken(token) {
    const base64Url = token.split('.')[1];
    return JSON.parse(atob(base64Url));
}

function buildVerificationEmail(user, link) {
    sgMail.setApiKey(process.env.SENDGRID_KEY);

    const msg = {
        to: user.email,
        from: process.env.FROM_EMAIL,
        subject: 'Account Verification Token',
        text: 'Child Miles: an efficient app to manage child tasks!',
        html: `<p>Hi ${user.firstname} ${user.lastname} <p><br><p>Please click on the following <a href="${link}">link</a> to verify your account.</p> 
        <br><p>If you did not request this, please ignore this email.</p>`
    };
    return msg;
}

module.exports = router;
