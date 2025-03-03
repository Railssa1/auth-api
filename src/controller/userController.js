const UserModel = require("../model/userModel")
const jwt = require('jsonwebtoken');

const UserController = {
    async register(req, res) {
        const { name, email, password } = req.body

        const existingUser = await UserModel.findUserByEmail(email)
        if (existingUser)
            return res.status(400).json({ error: "Email já cadastrado" })


        const newUser = await UserModel.createUser(name, email, password)
        res.status(201).json(newUser)
    },

    async login(req, res) {
        const { email, password } = req.body

        const user = await UserModel.findUserByEmail(email)
        if (!user)
            return res.status(400).json({ error: "Usuário não encontrado" })

        const isPasswordValid = await UserModel.comparePassword(password, user.password)
        if (!isPasswordValid) {
            console.log(password, user.password)
            return res.status(400).json({ error: "Senha incorreta" })
        }

        // Gera o JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.json({ message: "Login feito com sucesso", token })
    },
}

module.exports = UserController