const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    }

});

module.exports = mongoose.model('Child', childSchema);