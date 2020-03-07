const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

const childSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        required: true
    },
    dateBirth: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});
// plugin automatically handle username/password for storage in db
// userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Child', childSchema);