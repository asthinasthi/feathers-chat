// const NeDB = require('nedb');
// const path = require('path');

// module.exports = function (app) {
//   const dbPath = app.get('nedb');
//   const Model = new NeDB({
//     filename: path.join(dbPath, 'elders.db'),
//     autoload: true
//   });

//   return Model;
// };

const mongoose = require('mongoose')
var Schema = mongoose.Schema;

module.exports = function (app) {
    var elderSchema = new Schema({
        firstName: { type: String },
        lastName: { type: String },
        fullName: { type: String},
        createdAt: { type: Number }
    })
    const elderModel = mongoose.model('Elder', elderSchema)
    return elderModel;
}