const express = require("express");
const TopicController = require("../controller/topicController");

const router = express.Router();

router.post("/create-topic", TopicController.createTopic);
router.get("/", TopicController.getTopics);

module.exports = router;
