const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = require('./category');

const goalsSchema = new Schema({
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
        redPoint: {
			type: Number,
            min: 1,
            max: 1000,
			required: true
        },
        yellowPoint: {
			type: Number,
            min: 1,
            max: 1000,
			required: true
        },
        greenPoint: {
			type: Number,
            min: 1,
            max: 1000,
			required: true
        },
        category:[categorySchema]
    },
    {
        timestamps: true
    });
    
module.exports = mongoose.model('Goals', goalsSchema);
    