var mongoose = require('mongoose');
UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    createdDate: {
        type:Date,
        default: new Date()
    },
    updatedDate: {
        type:Date,
    },
    token: {
        type: String,
        
    }
});

User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(a, b) {
    User.findById(a, b)
}; 
module.exports.getUserByEmail = function(a, b) {
    User.findOne({
        email: a
    }, b);
}; 
module.exports.getUserByMobile = function(a, b) {
    User.findOne({
        phone: a
    }, b);
}; 