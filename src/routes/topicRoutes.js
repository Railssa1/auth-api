const express = require("express")
const TopicController = require("../controller/topicController")

const router = express.Router();

router.post("/create-topic", TopicController.createTopic)

module.exports = router;