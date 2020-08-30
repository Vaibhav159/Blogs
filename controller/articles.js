const jwt = require("jsonwebtoken");
const privateOrSecretKey = process.env.key;
const Article = require('../models/article');
const Topic = require('../models/topic');
const mongoose = require('mongoose');


function getAllArticlesByTopic(req, res, next) {
    const topicId = req.params.topicId;

    const authHeader = req.headers['authorization']
    let isFeatured = false;

    if (authHeader) {
        const token = req.headers.authorization.split(" ")[1];
        if (token == null) {
            return res.status(404).end();
        }
        jwt.verify(token, privateOrSecretKey, (err) => {
            if (err) {
                return res.status(404).json({
                    "message": "Invalid"
                })
            }
            isFeatured = true
        })
    }

    Article.find({"topicId": topicId, "isFeatured": isFeatured})
        .select("-__v")
        .exec()
        .then(docs => {
            console.log(docs);

            if (docs) {

                docs.forEach(element => {
                    Article.findByIdAndUpdate(element._id,
                        {$inc: {count: 1}},
                        function (err, model) {
                        }
                    )
                })

                const response = {
                    count: docs.length,
                    topics: docs
                }
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "no valid entry found"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

function getArticleById(req, res, next) {
    const articleId = req.params.articleId

    const authHeader = req.headers['authorization']
    let isFeatured = false;

    if (authHeader) {
        const token = req.headers.authorization.split(" ")[1];
        if (token == null) {
            return res.status(404).end();
        }
        jwt.verify(token, privateOrSecretKey, (err) => {
            if (err) {
                return res.status(404).json({
                    "message" : "Invalid"
                })
            }
            isFeatured = true
        })
    }

    Article.findByIdAndUpdate(articleId, {$inc: { count: 1} })
        .where("isFeatured").equals(isFeatured)
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

function createArticle(req, res, next) {
    Topic.findById(req.body.topicId)
        .then(
            topic => {
                console.log(topic)
                if (!topic) {
                    return res.status(404).json({
                        message : "Topic not found",
                    })
                }
                const article = new Article ({
                    _id : new mongoose.Types.ObjectId(),
                    topicId : req.body.topicId,
                    title : req.body.title,
                    image : req.body.image,
                    content : req.body.content,
                    isFeatured : req.body.isFeatured
                })
                return article.save();
            })
        .then(result => {
            console.log(result);
            res.status(200).json({
                _id : result.id,
                topicId : result.topicId,
                title : result.title,
                image : result.image,
                content : result.content,
                isFeatured : result.isFeatured
            });
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        });
}

function addTags(req, res, next) {
    const articleId = req.params.articleId
    console.log(req.body.tags)
    Article.findByIdAndUpdate(articleId,
        {$push: {"tags": req.body.tags}},
        {safe: true, upsert: true, new : true},
        function(err, model) {
            if(err) {
                console.log(err);
                res.status(404).json(err);
            }
            console.log(model);
            res.status(200).json(model);
        }
    );
}

function updateArticle(req, res, next) {
    const articleId = req.params.articleId
    const props = req.body

    Article.updateOne({_id: articleId}, props
    ).exec()
        .then(
            doc => {
                res.status(200).json(doc)
            }
        )
        .catch(err => {
            res.status(404).json(err)
        })
}


module.exports = {
    getAllArticlesByTopic,
    getArticleById,
    createArticle,
    addTags,
    updateArticle
}