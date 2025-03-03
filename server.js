require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require("./src/routes/userRoutes")

app.use(express.json());
app.use("/api/users", userRoutes)

app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}`)
})