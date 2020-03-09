const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Promise = require('promise')

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

realizationSchema.statics.fetchTotalPointsPerChild = function() {
    return new Promise((resolve, reject) => {
        this.aggregate([
            { $unwind: "$actions" },
            {
                $group: {
                    _id: null,
                    totalPointsPerChild: {
                        $sum: "$actions.point"
                    }
                }
            }], 
            (err, result) => {
                if (err) {
                    console.log("Error from search: fetchTotalPointsPerChild", err)
                    return reject(err);
                }
                resolve(result)
            }
        )
    });
}

realizationSchema.statics.fetchTotalPointsPerActionPerChild = function(callback) {
    return new Promise((resolve, reject) => {
        this.aggregate([
        { $unwind: "$actions" },
        {
            $group: {
                _id: "$actions.type",
                totalPointPerChild: {
                    $sum: "$actions.point"
                }
            }
        }], 
        (err, result) => {
            if (err) {
                console.log("Error from search: fetchTotalPointsPerActionPerChild", err)
                return reject(err);
            }
            resolve(result)
        })
    });
}


realizationSchema.statics.fetchTotalPointsPerPointTypePerChild = function(callback) {
    return new Promise((resolve, reject) => {
        this.aggregate([
        { $unwind: "$actions" },
        {
            $group: {
                _id: "$actions.pointType",
                totalPointPerChild: {
                    $sum: "$actions.point"
                }
            }
        }], 
        (err, result) => {
            if (err) {
                console.log("Error from search: fetchTotalPointsPerActionPerChild", err)
                return reject(err);
            }
            resolve(result)
        })
    });
}

realizationSchema.statics.fetchTotalPointsPerChildToday = function(callback) {
    const today = "2020-03-09T00:00:00.000Z";
    const tomorrow = "2020-03-10T00:00:00.000Z";
    // will come as parameter, dates toISOString format
    return new Promise((resolve, reject) => { 
        this.aggregate([
            {
                $match: {
                    "updatedAt": {
                        $gte: today,  
                        $lt: tomorrow 
                    }
                }
            },
            { $unwind: "$actions" },
            {
                $group: {
                    _id: null,
                    totalPointPerChild: {
                        $sum: "$actions.point"
                    }
                }
            }
        ], 
        (err, result) => {
            if (err) {
                console.log("Error from search: fetchTotalPointsPerActionPerChild", err)
                return reject(err);
            }
            resolve(result)
        })
    });
}

realizationSchema.statics.fetchTotalPointsPerChildWeek = function(callback) {
    const startDay = "2020-03-09T00:00:00.000Z";
    const endDay = "2020-03-17T00:00:00.000Z";
    // will come as parameter, dates toISOString format
    return new Promise((resolve, reject) => { 
        this.aggregate([
            {
                $match: {
                    "updatedAt": {
                        $gte: "2020-03-09T00:00:00.000Z", //today 
                        $lt: "2020-03-10T00:00:00.000Z" //tomorrow
                    }
                }
            },
            { $unwind: "$actions" },
            {
                $group: {
                    _id: null,
                    totalPointPerChild: {
                        $sum: "$actions.point"
                    }
                }
            }
        ], 
        (err, result) => {
            if (err) {
                console.log("Error from search: fetchTotalPointsPerActionPerChild", err)
                return reject(err);
            }
            resolve(result)
        })
    });
}

module.exports = mongoose.model('Realization', realizationSchema);