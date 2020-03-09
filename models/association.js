const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const associationSchema = new Schema({
    status: {
        type: Boolean,
        default: true
    },
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    },
    goals : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goals'
    }]
},
{
    timestamps: true
});

module.exports = mongoose.model('Association', associationSchema);