require("dotenv").config();
const express = require("express");
const cors = require("cors"); // <-- Importando CORS

const app = express();
const PORT = process.env.PORT || 3001;
const userRoutes = require("./src/routes/userRoutes");
const topicRoutes = require("./src/routes/topicRoutes");

// Habilita CORS para todas as origens
app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/topics", topicRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
