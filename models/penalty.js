const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const penaltySchema = new Schema({
    description: {
        type: String,
        required: true,
        unique: true
    },
    point: {
        type: Number,
        min: -1000,
        max: 1,
        required: true
    }
    },
    {
        timestamps: true
    });
    
module.exports = mongoose.model('Penalty', penaltySchema);