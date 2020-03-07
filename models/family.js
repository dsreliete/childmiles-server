const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: ''
    },
    familyName: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Family', familySchema);