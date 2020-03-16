const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Role = require('../role');

const personSchema = new Schema({
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
    }
})

const groupSchema = new Schema([
    {
        family: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Family'
        },
        people: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Person'
        }]
    }
]);
// plugin automatically handle username/password for storage in db
personSchema.plugin(passportLocalMongoose);
exports.personSchema = mongoose.model('Person', personSchema);
exports.groupSchema = mongoose.model('Group', groupSchema);