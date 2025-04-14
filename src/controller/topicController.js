const TopicModel = require("../model/topicModel");

const TopicController = {
    async createTopic(req, res) {
        const { title, languages, description } = req.body;

        try {
            if (!languages || !description) {
                return res.status(400).json({ error: "Languages and description are required" });
            }

            const newTopic = await TopicModel.createTopic(title, languages, description);
            res.status(201).json(newTopic);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    },
};

module.exports = TopicController;