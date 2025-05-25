const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
    async getChatByParticipants(mentorId, alunoId, topicoId) {
        // Como não tem chat separado, vamos buscar o tópico com mentor e aluno e mensagens
        return await prisma.topic.findFirst({
            where: {
                id: parseInt(topicoId),
                mentorId: parseInt(mentorId),
                studentId: parseInt(alunoId),
            },
            include: {
                messages: true,
            },
        });
    },

    async createChat(mentorId, alunoId, topicoId) {
        // Se o tópico já existe, só atualiza mentor e aluno e reseta os campos de chat
        return await prisma.topic.update({
            where: { id: topicoId },
            data: {
                mentorId,
                studentId: alunoId,
                chatReadByMentor: false,
                chatReadByStudent: false,
                chatConcluded: false,
            },
            include: {
                messages: true,
            },
        });
    },

    async markChatAsRead(topicoId, userType) {
        if (userType === "mentor") {
            await prisma.topic.update({
                where: { id: topicoId },
                data: { chatReadByMentor: true },
            });
        } else if (userType === "student") {
            await prisma.topic.update({
                where: { id: topicoId },
                data: { chatReadByStudent: true },
            });
        }
    },

    async isChatConcludedByTopic(topicoId) {
        const topic = await prisma.topic.findUnique({
            where: { id: topicoId },
            select: { chatConcluded: true },
        });
        return topic?.chatConcluded ?? false;
    },

    async concludeChat(topicoId) {
        return await prisma.topic.update({
            where: { id: topicoId },
            data: { chatConcluded: true, completed: true },
        });
    },
};
