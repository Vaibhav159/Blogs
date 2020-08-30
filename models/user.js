const mongoose = require('mongoose');
const {ROLE} = require('../userRole');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectID,
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        required: true,
        unique : true,
        match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password : {
        type : String,
        required : true,
    },
    userRole : {
        type : String,
        default : ROLE.BASIC
    }

});

module.exports = mongoose.model('User', userSchema)