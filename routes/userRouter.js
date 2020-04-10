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
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({success: false, message: "It is not possible to get all users from this family"});
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
	.catch(err => {
		return res.status(200).json({success: false, message: "It is not possible to get all users from this family" })
	});
})
.post(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {
	if(!req.user.family) {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success:false, message: "It is not possible to create a new user for this family"});
		return;
	}
	const familyId = req.user.family;

	let adminUser = '';
	User.findById(req.user._id)  
	.then(user => {
		adminUser = user;
	})
	.catch(err => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({ success:false, message: "It is not possible to create a new user for this family"});
	})

  //static method from passpot-local-mongoose to register username and pswd
	User.register(new User({username: req.body.username}),
		req.body.password,
		(err, person) => {
		if (err) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({success:false, message: "It is not possible to create a new user"});
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
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({success:false, message: "It is not possible to create a new user."});
					return;
				}

				User.find({family: familyId})
				.then(users => {
					const token = authentication.getEmailToken({_id: person._id});

					sgMail.setApiKey(process.env.SENDGRID_KEY);
				
					const link="http://localhost:3000/reset-credentials/"+token;
					const msg = {
						to: person.email,
						from: process.env.FROM_EMAIL,
						subject: 'Criação de usuário do sistema Milhas Infantis',
						text: 'Milhas Infantis: um app fácil de usar para gerenciar as atividades das crianças!',
						html: `<p>Olá ${person.firstname},<p><br><p>O usuário admin <strong>${adminUser.firstname}</strong> te cadastrou como um novo usuário do sistema. Por favor, clique no link a seguir <a href="${link}">link</a> para criar uma nova senha.</p> 
						<br><p>Após renovação da senha será possível fazer login ao sistema com ajuda do username <strong>${person.username}</strong> previamente cadastrado pelo usuário admin e senha recentemente cadastrada por você.</p>
						<br><p>Caso não tenha conhecimento sobre essa situação, por favor ignore este email.</p>`
					};
					sgMail.send(msg)
					.then(result => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json({success: true, users: users});	
					})
					.catch(err => {
						return res.status(200).json({success: false, message: 'It was not possible to send an verification email about new user creation!'})
					});
				})
				.catch(err => {
					return res.status(200).json({success: false, message: "It is not possible to create new users for this family" })
				});
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
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json({success: false, message: "You are not allowed to do this operation!"});
		return;
	}

	const familyId = req.user.family;

	User.findByIdAndUpdate(req.params.userId, {
		$set: req.body
	}, { new: true })
	.then(user => {

		User.find({family: familyId})
		.then(users => {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: true, users});
		})
		.catch(err => {
			return res.status(200).json({success: false, message: "It is not possible to edit user."})
		});
	})
	.catch(err => {
		return res.status(200).json({success: false, message: "It is not possible to edit user."})
	});
})
.delete(cors.corsWithOptions, authentication.verifyUser, authentication.verifyRole, (req, res, next) => {

	User.findById(req.params.userId)
	.then(user => {
		if(user.role === "admin"){
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json({success: false, message:"It is impossible to delete admin user."});
			return;
		}

		const familyId = req.user.family;

		User.findByIdAndDelete(req.params.userId)
		.then(response => {

			User.find({family: familyId})
			.then(users => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json({success: true, users});
			})
			.catch(err => {
				return res.status(200).json({success: false, message: "It is not possible to delete user."})
			});
		})
		.catch(err => {
			return res.status(200).json({success: false, message: "It is not possible to delete users from this family" })
		});

	})
	.catch(err => {
		return res.status(200).json({success: false, message: "It is not possible to delete users from this family" })
	});
});

//______________________________________________________________________________________________//

module.exports = userRouter;