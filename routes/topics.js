const express = require('express');
const router = express.Router();
const {authUserLogin, authRole} = require('../middleware/checkAuthToken')
const {ROLE} = require("../userRole")

const TopicController = require('../controller/topics')

//get all topics
router.get('/', authUserLogin, TopicController.getAllTopics)

//get topic by id
router.get('/:topicId', authUserLogin, TopicController.getTopicById )

//create topic
router.post('/', authUserLogin, authRole(ROLE.ADMIN), TopicController.createTopic)

module.exports = router;
