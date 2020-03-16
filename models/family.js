const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familySchema = new Schema({
    image: {
        type: String,
        default: ''
    },
    familyName: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Family', familySchema);