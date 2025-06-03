const express = require("express");
const TopicController = require("../controller/topicController");

const router = express.Router();

router.post("/create-topic", TopicController.createTopic);
router.get("/", TopicController.getTopics);
router.patch('/vincular-mentor/:topicId', TopicController.updateMentorId);
router.patch('/:topicId', TopicController.updateTopic);

module.exports = router;
