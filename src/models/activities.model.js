// const NeDB = require('nedb');
// const path = require('path');

// module.exports = function (app) {
//   const dbPath = app.get('nedb');
//   const Model = new NeDB({
//     filename: path.join(dbPath, 'activities.db'),
//     autoload: true
//   });

//   return Model;
// };

const mongoose = require('mongoose')
var Schema = mongoose.Schema;

module.exports = function (app) {
    var activitySchema = new Schema({
        activityType: { type: String },
        activityDate: { type: Number },
        createdAt: { type: Number },
        elderHealthStatus: { type: String },
        elderHealthConcern: { type: String },
        hours: { type: Number },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        elderId: { type: Schema.Types.ObjectId, ref: 'Elder' }
    })
    const activityModel = mongoose.model('Activity', activitySchema)
    return activityModel;
}