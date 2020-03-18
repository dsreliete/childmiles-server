const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const penaltySchema = new Schema({
    description: {
        type: String,
        required: true,
        unique: false
    },
    point: {
        type: Number,
        min: -1000,
        max: 1,
        required: true,
        unique: false
    },
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    }
});
    
module.exports = mongoose.model('Penalty', penaltySchema);