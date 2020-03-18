const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
    description: {
        type: String,
        required: true,
        unique: false
    },
    redPoint: {
        type: Number,
        min: -1,
        max: 1000,
        required: true,
        unique: false
    },
    yellowPoint: {
        type: Number,
        min: -1,
        max: 1000,
        required: true,
        unique: false
    },
    greenPoint: {
        type: Number,
        min: -1,
        max: 1000,
        required: true,
        unique: false
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    family: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    }
});

goalSchema.statics.fetchGoalsPerCategory = function(categoryId, familyId) {
    return new Promise((resolve, reject) => {
        this.aggregate([
            {
                $match: {
                    $and: [
                        { "category": mongoose.Types.ObjectId(categoryId) },
                        { "family": mongoose.Types.ObjectId(familyId) }
                    ]
                }
            }
        ], 
        (err, result) => {
            if (err) {
                console.log("Error from search: fetchGoalsPerCategory", err)
                return reject(err);
            }
            resolve(result)
        })
    });
}
    
module.exports = mongoose.model('Goal', goalSchema);
    