const express = require('express');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const authentication = require('../authentication');
const cors = require('./cors');

const userRouter = express.Router();

//______________________________________________________________//
//get all person from DB
userRouter.route('/test')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  User.find()
  .populate('family')
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /person');
})
.put(cors.corsWithOptions, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /person');
})
.delete(cors.corsWithOptions, (req, res, next) => {
  User.deleteMany()
  .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
  })
  .catch(err => next(err));
});

//______________________________________________________________________________________//

//get users per family or delete all users per family
userRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

  if(!req.user.family){
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({msg: "It is not possible to get all users from this family"});
    return;
  }
  const familyId = req.user.family;

  User.find({family: familyId})
  .populate('family')
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, users: users});
  })
  .catch(err => next(err));
})
.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
  if(!req.user.family) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({msg: "It is not possible to get all child from this family"});
    return;
  }
  const familyId = req.user.family;

  let adminUser = '';
  User.findById(req.user._id)  
  .then(user => {
    adminUser = user;
  })
  .catch(err => {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({error: err, msg: "It is not possible to get all child from this family"});
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
        if (req.body.role) {
            person.role = req.body.role;
        }
        if (req.body.email) {
          person.email = req.body.email;
        }
        person.family = familyId;
        person.save(err => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err, msg: "no person saved"});
            return;
          }
          sendVerificationEmail(person, adminUser, req, res)
        });
      }
    });
})
.put(cors.corsWithOptions, (req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /users');
})
.delete(cors.corsWithOptions, (req, res, next) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /users');
});

//_______________________________________________________________________//
//get specific user from family and update or delete it
userRouter.route('/:userId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
  res.statusCode = 403;
  res.end('GET operation not supported on /:userId');
})
.post(cors.corsWithOptions, (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /:userId');
})
.put(cors.corsWithOptions, authentication.verifyUser, (req, res, next) => {

  if(req.params.userId != req.user._id) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({msg: "You are not allowed to do this operation!"});
    return;
  }

  User.findByIdAndUpdate(req.params.userId, {
    $set: req.body
  }, { new: true })
  
  .then(user => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  })
  .catch(err => next(err));
})
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

  User.findByIdAndDelete(req.params.userId)
    .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response); 
    })
    .catch(err => next(err));
});


//_______________________________________________________________________//

userRouter.route('resetPswd/:email')
.post(cors.corsWithOptions, () => {

})

//______________________________________________________________________________________________//

userRouter.route('/logout')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authentication.verifyUser, (req, res, next) => {
  const token = authentication.getToken({_id: req.user._id, family: req.user.family});
  res.redirect('/');
});

function sendVerificationEmail(user, adminUser, req, res){
  
  const token = authentication.getEmailToken({_id: user._id});

  sgMail.setApiKey(process.env.SENDGRID_KEY);

  const link="https://"+req.headers.host+"/verifyEmail/"+token;
  const msg = {
    to: user.email,
    from: process.env.FROM_EMAIL,
    subject: 'Account Verification Token',
    text: 'Child Miles: an efficient app to manage child tasks!',
    html: `<p>Hi ${user.firstname}<p><br><p>Child Miles admin user ${adminUser.firstname} registered you as one of users of Child Miles app. Please click on the following <a href="${link}">link</a> to verify your account.</p> 
    <br><p>If you did not request this, please ignore this email.</p>`
  };
  sgMail.send(msg)
  .then(result => {
      res.status(200).json({message: 'A verification email has been sent to ' + user.email + '.'});
  })
  .catch(err => console.log(err));
}

module.exports = userRouter;