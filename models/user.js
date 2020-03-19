const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Role = require('../role');

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: Role.User
    },
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String
    }
})

// plugin automatically handle username/password for storage in db
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
