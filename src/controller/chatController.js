const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserByEmail(email) {
  let user = await prisma.user_Mentor.findUnique({ where: { email } });
  if (user) {
    return { id: user.id, name: user.name, email: user.email, type: 'mentor' };
  }
  user = await prisma.user_Estudante.findUnique({ where: { email } });
  if (user) {
    return { id: user.id, name: user.name, email: user.email, type: 'student' };
  }
  return null;
}

module.exports = {
  connections: {},

  addConnection(ws) {
    const topicId = ws.topicId;
    if (!this.connections[topicId]) {
      this.connections[topicId] = [];
    }
    this.connections[topicId].push(ws);
    console.log(`Usuário ${ws.username} entrou na sala ${topicId}`);
  },

  removeConnection(ws) {
    const topicId = ws.topicId;
    if (this.connections[topicId]) {
      this.connections[topicId] = this.connections[topicId].filter(conn => conn !== ws);
      console.log(`Usuário ${ws.username} saiu da sala ${topicId}`);
      if (this.connections[topicId].length === 0) {
        delete this.connections[topicId];
      }
    }
  },

  async broadcastUsers(topicId) {
    const users = await Promise.all(
      (this.connections[topicId] || []).map(async (ws) => {
        const user = await getUserByEmail(ws.username);
        return { id: user.id, name: user.name };
      })
    );

    (this.connections[topicId] || []).forEach(ws => {
      ws.send(JSON.stringify({ type: 'users', users }));
    });
  },

  async handleMessage(senderWs, message) {
    const topicId = senderWs.topicId;

    const chat = await prisma.topic.findUnique({
      where: { id: Number(topicId) },
    });

    if (!chat) {
      console.error('Chat (tópico) não encontrado para o id:', topicId);
      return;
    }

    const user = await getUserByEmail(senderWs.username);
    if (!user) {
      console.error('Usuário não encontrado:', senderWs.username);
      return;
    }

    const savedMessage = await prisma.message.create({
      data: {
        topicId: Number(topicId),
        senderId: user.id,
        senderType: user.type,
        message: message.text,
      },
    });

    const enrichedMessage = {
      type: 'message',
      ...savedMessage,
      senderName: user.name,
      senderEmail: user.email
    };

    (this.connections[topicId] || []).forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(enrichedMessage));
      }
    });
  }
};
