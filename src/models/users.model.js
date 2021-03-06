// const NeDB = require('nedb');
// const path = require('path');

// module.exports = function (app) {
//   const dbPath = app.get('nedb');
//   const Model = new NeDB({
//     filename: path.join(dbPath, 'users.db'),
//     autoload: true
//   });

//   Model.ensureIndex({ fieldName: 'email', unique: true });

//   return Model;
// };

const mongoose = require('mongoose')
var Schema = mongoose.Schema;

module.exports = function (app) {
    var userSchema = new Schema({
        email: { type: String, unique: true },
        firstName: { type: String },
        lastName: { type: String },
        password: { type: String }
    })
    const userModel = mongoose.model('User', userSchema)
    return userModel;
}


