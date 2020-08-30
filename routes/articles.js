const express = require('express')
const router = express.Router();

const {ROLE} = require("../userRole")
const {authUserLogin, authRole} = require('../middleware/checkAuthToken')

const ArticlesController = require('../controller/articles')

//search article by topic id
router.get('/articlebytopic/:topicId', ArticlesController.getAllArticlesByTopic);

//search article by article id
router.get('/:articleId', ArticlesController.getArticleById);

//add article
router.post('/', authUserLogin, authRole(ROLE.ADMIN), ArticlesController.createArticle)

//add tags
router.post("/tags/:articleId", ArticlesController.addTags);

//update article
router.patch('/:articleId', authUserLogin, authRole(ROLE.ADMIN), ArticlesController.updateArticle)

module.exports = router;
