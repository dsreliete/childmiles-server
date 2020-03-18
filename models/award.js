const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const awardSchema = new Schema({
	description: {
		type: String,
		required: true,
		unique: false
	},
	point: {
		type: Number,
        min: 0,
        max: 1000,
		required: true,
		unique: false
	},
	family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    }
});

module.exports = mongoose.model('Award', awardSchema);
