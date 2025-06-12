const express = require("express");
const TopicController = require("../controller/topicController");

const router = express.Router();

router.post("/create-topic", TopicController.createTopic);
router.get("/", TopicController.getTopics);
router.patch('/vincular-mentor/:topicId', TopicController.updateMentorId);
router.patch('/:topicId', TopicController.updateTopic);
router.get('/:topicId', TopicController.getTopicById);
router.get('/completed', TopicController.getAllCompletedTopics);
router.get('/completed/:topicId', TopicController.getCompletedTopicById);


module.exports = router;
