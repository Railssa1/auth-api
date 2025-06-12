const TopicModel = require("../model/topicModel");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TopicController = {
  async createTopic(req, res) {
    const { title, languages, description, author, studentId, mentorId } = req.body;

    try {
      if (!title || !languages || !description || !author || !studentId) {
        return res.status(400).json({ error: "Campos obrigatórios: título, linguagens, descrição, autor e studentId" });
      }

      const newTopic = await TopicModel.createTopic(title, languages, description, author, studentId, mentorId);
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
  },

  async updateMentorId(req, res) {
    const { topicId } = req.params;
    const { mentorId } = req.body;

    try {
      const updated = await TopicModel.setMentorForTopic(Number(topicId), Number(mentorId));
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Erro ao vincular mentor ao tópico' });
    }
  },

  async updateTopic(req, res) {
    const { topicId } = req.params;
    const updateData = req.body;

    try {
      const updatedTopic = await prisma.topic.update({
        where: { id: parseInt(topicId) },
        data: updateData,
      });

      res.status(200).json(updatedTopic);
    } catch (error) {
      console.error('Erro ao atualizar tópico:', error);
      res.status(500).json({ error: 'Erro ao atualizar tópico' });
    }
  },

  async getTopicById(req, res) {
    const { topicId } = req.params;

    try {
      const topic = await TopicModel.getTopicById(Number(topicId));

      if (!topic) {
        return res.status(404).json({ error: "Tópico não encontrado" });
      }

      res.status(200).json(topic);
    } catch (error) {
      console.error('Erro ao buscar tópico:', error);
      res.status(500).json({ error: 'Erro ao buscar tópico' });
    }
  },

  async getCompletedTopicById(req, res) {
    const { topicId } = req.params;

    try {
      const topic = await TopicModel.getTopicWithMessagesById(Number(topicId));

      if (!topic || !topic.messages || topic.messages.length === 0) {
        return res.status(404).json({ error: "Tópico não encontrado ou não concluído" });
      }

      res.status(200).json(topic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar tópico" });
    }
  },

  async getAllCompletedTopics(req, res) {
    try {
      const topics = await TopicModel.getCompletedTopicsWithMessages();

      const formatted = topics.map(topic => ({
        topicId: topic.id,
        title: topic.title,
        author: topic.author,
        messages: topic.messages.map(msg => ({
          messageId: msg.id,
          senderType: msg.senderType,
          senderId: msg.senderId,
          message: msg.message,
        })),
      }));

      res.status(200).json(formatted);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar tópicos concluídos" });
    }
  },


};

module.exports = TopicController;
