const mongoose = require('mongoose');

const topicSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectID,
    name : {
        type : String,
        required: true
    },
    image : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Topic', topicSchema)