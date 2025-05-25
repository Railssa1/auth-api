const ChatController = require('./controller/chatController');

class Chat {
  constructor() {
    this.chatController = ChatController;
  }

  adicionarConexao(ws) {
    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data);

        if (parsed.type === "join") {
          ws.username = parsed.username;
          ws.topicId = parsed.topicId;
          this.chatController.addConnection(ws);
          this.chatController.broadcastUsers(ws.topicId);
          return;
        }

        this.chatController.handleMessage(ws, parsed);
      } catch (err) {
        console.error('Mensagem inválida:', err);
      }
    });

    ws.on('close', () => {
      this.chatController.removeConnection(ws);
    });
  }

}

module.exports = { Chat };
