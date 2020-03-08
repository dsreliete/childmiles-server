const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const awardsSchema = new Schema({
	description: {
		type: String,
		required: true,
		unique: true
	},
	point: {
		type: Number,
        min: 0,
        max: 1000,
        required: true
	}
},
{
	timestamps: true
});

module.exports = mongoose.model('Awards', awardsSchema);
