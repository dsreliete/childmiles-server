const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
	description: {
		type: String,
		required: true,
		unique: false
	},
	family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    }
});

module.exports = mongoose.model('Category', categorySchema);
