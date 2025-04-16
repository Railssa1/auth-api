const TopicModel = require("../model/topicModel");

const TopicController = {
    async createTopic(req, res) {
        const { title, languages, description, author } = req.body;
      
        try {
            if (!title || !languages || !description || !author) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
              }
      
            const newTopic = await TopicModel.createTopic(title, languages, description, author);

          res.status(201).json(newTopic);
        } catch (error) {
          console.error(error);
          res.status(400).json({ error: error.message });
        }
      },

  async getTopics(req, res) {
    try {
      const topics = await TopicModel.getAllTopics();
      res.status(200).json(topics);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar tópicos" });
    }
  }
};

module.exports = TopicController;
