const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const JwtStrategy = require('passport-jwt').Strategy; 
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); 
const User = require('./models/user');
const Role = require('./role');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, process.env.PASSPORT_SECRET, {expiresIn: 3600});
};

exports.getEmailToken = function(user) {
    return jwt.sign(user, process.env.PASSPORT_SECRET, {expiresIn: 1800});
};

//The Passport JWT authentication strategy is created and configured.
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.PASSPORT_SECRET;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
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

//middleware is used to authenticate the users request. 
//Using passport.authenticate() and specifying the 'jwt' strategy the request is 
//authenticated by checking for the standard Authorization header and verifying the verification token
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