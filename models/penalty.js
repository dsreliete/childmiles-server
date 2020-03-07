const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const penaltySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    point: {
        type: Number,
        min: 1,
        max: 1000,
        required: true
    }
    },
    {
        timestamps: true
    });
    
module.exports = mongoose.model('Penalty', penaltySchema);