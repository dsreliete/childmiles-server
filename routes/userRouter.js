const express = require('express');
const User = require('../models/user');
const authentication = require('../authentication');

const userRouter = express.Router();

//______________________________________________________________//
//get all person from DB
userRouter.route('/test')
.get((req, res, next) => {
  User.find()
  .populate('family')
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /person');
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /person');
})
.delete((req, res, next) => {
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
.get(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

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
.post(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
  if(!req.user.family) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({msg: "It is not possible to get all child from this family"});
    return;
  }
  const familyId = req.user.family;

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
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!', user: person});
        });
      }
    });
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /users');
})
.delete((req, res, next) => {
  res.statusCode = 403;
  res.end('DELETE operation not supported on /users');
});

//_______________________________________________________________________//
//get specific user from family and update or delete it
userRouter.route('/:userId')
.get((req, res, next) => {
  res.statusCode = 403;
  res.end('GET operation not supported on /:userId');
})
.post((req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /:userId');
})
.put(authentication.verifyUser, (req, res, next) => {

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
.delete(authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

  User.findByIdAndDelete(req.params.userId)
    .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response); 
    })
    .catch(err => next(err));
});


//_______________________________________________________________________//

userRouter.post('resetPswd/:email', () => {

})

//______________________________________________________________________________________________//

userRouter.get('/logout', authentication.verifyUser, (req, res, next) => {
  const token = authentication.getToken({_id: req.user._id, family: req.user.family});
  res.redirect('/');
});

module.exports = userRouter;