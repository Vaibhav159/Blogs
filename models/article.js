const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectID,
    topicId : {
        type : mongoose.Schema.Types.ObjectID, ref : 'Topic',
        required : true
    },
    title : {
        type : String,
        required: true
    },
    image : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required: true
    },
    isFeatured: {
        type : Boolean,
        default : false
    },
    count : {
        type : Number,
        default: 0
    },
    tags : [
        {
            name : String
        }
    ]
});

module.exports = mongoose.model('Article', articleSchema)