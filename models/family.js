const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const familySchema = new Schema({
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