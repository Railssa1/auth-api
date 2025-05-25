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
  }

};

module.exports = TopicModel;
