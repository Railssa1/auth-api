const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const UserModel = {
    // Cria um tópico
    async createTopic(title, languages, description) {
        return await prisma.Topic.create({   
            data: { title, languages, description }
        });
    },
};

module.exports = UserModel;
