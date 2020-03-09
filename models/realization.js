const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actionSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        min: -1001,
        max: 1001,
        required: true
    },
    pointType: {
        type: String,
        required: true
    },
    goal:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goals'
    }, 
    penalty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Penalty'
    }
},{
    timestamps: true
})

const realizationSchema = new Schema({
    child: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Child'
    },
    actions: [actionSchema]
},
{
    timestamps: true
});

module.exports = mongoose.model('Realization', realizationSchema);