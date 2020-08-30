const mongoose = require('mongoose');
const Topic = require('../models/topic');

function getAllTopics(req, res, next) {
    Topic.find()
        .select("-__v")
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count : docs.length,
                topics : docs
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        });
}

function getTopicById (req, res, next) {
    const topicId = req.params.topicId;
    Topic.findById(topicId)
        .select("-__v")
        .exec()
        .then(doc => {
            console.log("From database" , doc);
            if (doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({
                    message : "no valid entry found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
}


function createTopic(req, res, next) {
    const topic = new Topic({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        image : req.body.image
    });
    topic.save()
        .then(result => {
                console.log(result)
                res.status(200).json({
                    message : "Topic Created",
                    topicCreated : {
                        _id : result.id,
                        name : result.name,
                        image : result.image                }
                })
            }
        )
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error : err
            })
        });
}


module.exports = {
    getAllTopics,
    getTopicById,
    createTopic
}