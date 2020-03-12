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
    },
    award: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Award'
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

realizationSchema.statics.fetchTotalPointsPerChild = function(childId) {
    return new Promise((resolve, reject) => {
        this.aggregate([
            {
                $match: {
                    "child": mongoose.Types.ObjectId(childId)
                }
            },
            {
                $unwind: "$actions"
            },
            {
                $group: {
                    _id: "$child",
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

realizationSchema.statics.fetchTotalPointsPerActionPerChild = function(childId) {
    return new Promise((resolve, reject) => {
        this.aggregate([
            {
                $match: {
                    "child": mongoose.Types.ObjectId(childId)
                }
            },
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

realizationSchema.statics.fetchTotalPointsPerPointTypePerChild = function(childId) {
    return new Promise((resolve, reject) => {
        this.aggregate([
            {
                $match: {
                    "child": mongoose.Types.ObjectId(childId)
                }
            },
            { $unwind: "$actions" },
            {
                $group: {
                    _id: "$actions.pointType",
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

function getMondayOfCurrentWeek(d) {
    const day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?-6:1)-day );
}

function getSundayOfCurrentWeek(d) {
    const day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0?0:7)-day );
}


realizationSchema.statics.fetchTotalPointsPerChildToday = function(childId) {
    let td = new Date()
    let tm = new Date(td)
    tm.setDate(td.getDate()+1)
    tm.setUTCHours(0,0,0,0);
    td.setUTCHours(0,0,0,0);
    td.toISOString()
    tm.toISOString()
    // dates will come as parameter, for now it is set to make testable!
    return new Promise((resolve, reject) => { 
        this.aggregate([
            {
                $match: {
                    $and: [
                        { "child": mongoose.Types.ObjectId(childId) }, 
                        { "createdAt": {
                            $gte: td,  
                            $lt: tm 
                            }
                        }
                    ]
                }
            },
            { $unwind: "$actions" },
            {
                $group: {
                    _id: "$child",
                    totalPointPerChild: {
                        $sum: "$actions.point"
                    }
                }
            }
        ], 
        (err, result) => {
            if (err) {
                console.log("Error from search: fetchTotalPointsPerChildToday", err)
                return reject(err);
            }
            resolve(result)
        })
    });
}

realizationSchema.statics.fetchTotalPointsPerChildWeek = function(childId) {
    const td = new Date()
    let start = getMondayOfCurrentWeek(td)
    let end = getSundayOfCurrentWeek(td)
    start.toISOString();
    end.toISOString();
    // will come as parameter, dates toISOString format
    return new Promise((resolve, reject) => { 
        this.aggregate([
            {
                $match: {
                    $and: [
                        { "child": mongoose.Types.ObjectId(childId) }, 
                        { "createdAt": {
                            $gte: start,  
                            $lt: end 
                            }
                        }
                    ]
                }
            },
            { $unwind: "$actions" },
            {
                $group: {
                    _id: "child",
                    totalPointPerChild: {
                        $sum: "$actions.point"
                    }
                }
            }
        ], 
        (err, result) => {
            if (err) {
                console.log("Error from search: fetchTotalPointsPerChildWeek", err)
                return reject(err);
            }
            resolve(result)
        })
    });
}

module.exports = mongoose.model('Realization', realizationSchema);