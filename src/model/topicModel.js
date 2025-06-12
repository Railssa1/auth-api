// topicModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TopicModel = {
  async createTopic(title, languages, description, author, studentId, mentorId) {
    return await prisma.topic.create({
      data: {
        title,
        languages,
        description,
        author,
        studentId: Number(studentId),
        mentorId: mentorId ? Number(mentorId) : null,
        completed: false
      }
    });
  },

  async getAllTopics() {
    return await prisma.topic.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  },

  async setMentorForTopic(topicId, mentorId) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new Error('Tópico não encontrado');
    }

    return await prisma.topic.update({
      where: { id: topicId },
      data: { mentorId: mentorId }
    });
  },


  async markAsInProgress(topicId) {
    return await prisma.topic.update({
      where: { id: Number(topicId) },
      data: { inProgress: true }
    });
  },

  async getTopicById(topicId) {
    return await prisma.topic.findUnique({
      where: { id: Number(topicId) },
    });
  },

  async getTopicWithMessagesById(topicId) {
    const topic = await prisma.topic.findUnique({
      where: { id: Number(topicId) },
      select: {
        id: true,
        title: true,
        author: true,
        completed: true,
        messages: {
          select: {
            id: true,
            senderType: true,
            senderId: true,
            message: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!topic) return null;

    // Carregar nomes dos remetentes (student ou mentor) manualmente
    const enrichedMessages = await Promise.all(topic.messages.map(async (msg) => {
      let senderName = null;

      if (msg.senderType === 'student') {
        const user = await prisma.user_Estudante.findUnique({
          where: { id: msg.senderId },
          select: { name: true }
        });
        senderName = user?.name ?? null;
      } else if (msg.senderType === 'mentor') {
        const user = await prisma.user_Mentor.findUnique({
          where: { id: msg.senderId },
          select: { name: true }
        });
        senderName = user?.name ?? null;
      }

      return {
        messageId: msg.id,
        senderType: msg.senderType,
        senderId: msg.senderId,
        message: msg.message,
        createdAt: msg.createdAt,
        senderName
      };
    }));

    return {
      topicId: topic.id,
      title: topic.title,
      author: topic.author,
      messages: enrichedMessages
    };
  },

  async getCompletedTopicsWithMessages() {
    return await prisma.topic.findMany({
      where: { completed: true },
      select: {
        id: true,
        title: true,
        author: true,
        messages: {
          select: {
            id: true,
            senderType: true,
            senderId: true,
            message: true,
          }
        }
      }
    });
  },


};

module.exports = TopicModel;
