const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const JwtStrategy = require('passport-jwt').Strategy; 
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); 
const User = require('./models/user');
const conf = require('./config');
const Role = require('./role');

exports.local = passport.use(new LocalStrategy(User.personSchema.authenticate()));
passport.serializeUser(User.personSchema.serializeUser());
passport.deserializeUser(User.personSchema.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, conf.secretKey, {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = conf.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.personSchema.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);


exports.verifyUser = passport.authenticate('jwt', {session: false});

//this middleware allow CRUD every entities of the app except user
exports.verifyRole = (req, res, next) => {
    if(req.user.role === Role.Admin || req.user.role === Role.Manager) {
        return next();
    } else {
        const err = new Error("You are not authorized to perform this operation!");
        err.status = 404;
        return next(err);
    }
};

//this middleware was created to allow admin to CRUD users 
exports.verifyAdminRole = (req, res, next) => {
    if(req.user.role === Role.Admin){
        return next();
    } else {
        const err = new Error("Only admin role can perform this operation!");
        err.status = 404;
        return next(err);
    }
};