const express = require("express");
const ChatModel = require("../model/chatModel");
const TopicModel = require("../model/topicModel");
const router = express.Router();

// Criar ou buscar chat existente
router.post("/create", async (req, res) => {
    try {
        const { mentorId, alunoId, topicoId } = req.body;

        let chat = await ChatModel.getChatByParticipants(mentorId, alunoId, topicoId);
        if (!chat) {
            chat = await ChatModel.createChat(mentorId, alunoId, topicoId);
        }

        await TopicModel.setMentorForTopic(Number(topicoId), Number(mentorId));
        await TopicModel.markAsInProgress(topicoId);

        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar chat" });
    }
});

module.exports = router;
