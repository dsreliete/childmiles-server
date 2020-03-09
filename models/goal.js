const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
    description: {
        type: String,
        required: true,
        unique: true
    },
    redPoint: {
        type: Number,
        min: -1,
        max: 1000,
        required: true
    },
    yellowPoint: {
        type: Number,
        min: -1,
        max: 1000,
        required: true
    },
    greenPoint: {
        type: Number,
        min: -1,
        max: 1000,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
    },
    {
        timestamps: true
    });
    
module.exports = mongoose.model('Goals', goalSchema);
    