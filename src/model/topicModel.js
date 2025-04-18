// topicModel.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TopicModel = {
    async createTopic(title, languages, description, author) {
        return await prisma.topic.create({
          data: { title, languages, description, author, completed: false }
        });
      },      


      async getAllTopics() {
        return await prisma.topic.findMany({
            orderBy: {
                id: 'desc', 
            },
        });
    }
};

module.exports = TopicModel;
