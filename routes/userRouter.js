const express = require('express');
const User = require('../models/user');
const authentication = require('../authentication');

const userRouter = express.Router();

userRouter.route('/people')
.get((req, res, next) => {
  User.groupSchema.find()
  .populate('family')
  .populate('people')
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
})
.delete((req, res, next) => {
  User.groupSchema.deleteMany()
  .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
  })
  .catch(err => next(err));
});

//______________________________________________________________//

userRouter.route('/person')
.get((req, res, next) => {
  User.personSchema.find()
  .populate('family')
  .populate('people')
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
})
.delete((req, res, next) => {
  User.personSchema.deleteMany()
  .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
  })
  .catch(err => next(err));
});

//______________________________________________________________________________________//

//get users per family and delete all users per family
userRouter.route('/')
.get(authentication.verifyUser, authentication.verifyAdminRole, (req, res, next) => {

  let familyId = ''
  if(req.user.family){
    familyId = req.user.family;
  }

  User.groupSchema.findOne({family: familyId})
  .populate('family')
  .populate('people')
  .then(group => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, group: group});
  })
  .catch(err => next(err));
})
.delete(authentication.verifyUser, authentication.verifyAdminRole, (req, res, next) => {
  
  let familyId = ''
  if(req.user.family){
    familyId = req.user.family;
  }
  User.groupSchema.findOneAndRemove({family: familyId})
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

//_______________________________________________________________________//
//get specific user from family and update or delete it
userRouter.route('/:userId')
.put(authentication.verifyUser, (req, res, next) => {

  if(req.params.userId != req.user._id) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.json({msg: "It is not possible to update user"});
    return;
  }

  User.personSchema.findByIdAndUpdate(req.params.userId, {
    $set: req.body
  }, { new: true })
  
  .then(person => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(person);
  })
  .catch(err => next(err));
})
.delete(authentication.verifyUser, authentication.verifyAdminRole, (req, res, next) => {
  console.log(typeof req.user._id)
  console.log(typeof req.params.userId)

  // if(req.params.userId != req.user._id) {
  //   res.statusCode = 500;
  //   res.setHeader('Content-Type', 'application/json');
  //   res.json({msg: "It is not possible to delete user"});
  //   return;
  // }

  User.personSchema.findByIdAndDelete(req.params.userId)
    .then(response => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(response); 
    })
    .catch(err => next(err));
});


//_______________________________________________________________________//
//adding new users to family group
userRouter.post('/signupNewUsers', authentication.verifyUser, authentication.verifyAdminRole, (req, res) => {

  let familyId = ''
  if(req.user.family){
    familyId = req.user.family;
  }

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
                if (req.body.role) {
                  person.role = req.body.role;
                }
                person.family = familyId;
                
                person.save(err => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err, msg: "User.personSchema updated not working"});
                        return;
                    }
                    
                    User.groupSchema.findOne({family: familyId})
                    .then(group => {
                      if(group) {
                        group.people.push(person);

                        group.save(err => {
                          if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({err: err, msg: "User.groupSchema updated not working"});
                            return;
                          }
                          res.statusCode = 200;
                          res.setHeader('Content-Type', 'application/json');
                          res.json({success: true, status: 'new User Registration Successful to family!', group: group});
                        })
                      } else {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({err: err, msg: "there is no family to push this person"});
                        return;
                      }
                    })
                    .catch(err => {
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.json({err: err, msg: "User.groupSchema updated not working"});
                      return;
                    });
                });
            }
    });
});

userRouter.get('/logout', authentication.verifyUser, (req, res, next) => {
  const token = authentication.getToken({_id: req.user._id, family: req.user.family});
  res.redirect('/');
});

module.exports = userRouter;