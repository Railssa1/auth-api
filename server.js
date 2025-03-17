require("dotenv").config();
const express = require("express");
const cors = require("cors"); // <-- Importando CORS

const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require("./src/routes/userRoutes");

// Habilita CORS para todas as origens
app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
