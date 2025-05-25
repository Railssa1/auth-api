require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Rotas
const userRoutes = require("./src/routes/userRoutes");
const topicRoutes = require("./src/routes/topicRoutes");
const chatRoutes = require("./src/routes/chatRoutes");

const { Chat } = require("./src/chat");
const chat = new Chat();

// Middlewares
app.use(cors());
app.use(express.json());

// Uso das rotas REST
app.use("/api/users", userRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/chat", chatRoutes);

// WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    chat.adicionarConexao(ws);
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
