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

  broadcastUsers(topicId) {
    const users = this.connections[topicId]?.map(ws => ws.username) || [];
    this.connections[topicId]?.forEach(ws => {
      ws.send(JSON.stringify({ type: 'users', users }));
    });
  },

  handleMessage(senderWs, message) {
    const topicId = senderWs.topicId;
    if (!this.connections[topicId]) return;

    const enrichedMessage = {
      type: 'message',
      author: senderWs.username,
      text: message.text,
      topicId: topicId,
      createdAt: new Date().toISOString(),
    };

    this.connections[topicId].forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(enrichedMessage));
      }
    });
  }
};
