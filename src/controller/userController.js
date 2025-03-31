const UserModel = require("../model/userModel")
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

AWS.config.update({ region: 'us-east-1' });
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const UserController = {
    async registerEstudante(req, res) {
        const { email, password, name } = req.body

        const existingUser = await UserModel.findEstudanteByEmail(email)
        if (existingUser)
            return res.status(400).json({ error: "Email já cadastrado" })


        const newUser = await UserModel.createEstudante(email, password, name)
        res.status(201).json(newUser)
    },

    async registerMentor(req, res) {
        const { email, password, skills, seniority, name } = req.body

        const existingUser = await UserModel.findMentorByEmail(email)
        if (existingUser)
            return res.status(400).json({ error: "Email já cadastrado" })

        const newUser = await UserModel.createMentor(email, password, skills, seniority, name)
        res.status(201).json(newUser)
    },

    async login(req, res) {
        const { email, password } = req.body;

        const user = await UserModel.findEstudanteByEmail(email) || await UserModel.findMentorByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        const isPasswordValid = await UserModel.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Senha incorreta" });
        }

        // Gera o JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login feito com sucesso", token, email });
    },

    async forgotPassword(req, res) {
        const { email } = req.body;

        const user = await UserModel.findEstudanteByEmail(email) || await UserModel.findMentorByEmail(email);
        if (!user) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        const subject = 'Redefinição de Senha';
        const body = `Você solicitou a redefinição de senha. Clique no link para redefinir sua senha: ${process.env.FRONTEND_URL}/redefinir-senha?email=${email}`;

        const params = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Text: {
                        Data: body,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
            Source: "raissamalves@gmail.com",
        };

        try {
            const result = await ses.sendEmail(params).promise();
            res.json({ message: 'Email de redefinição de senha enviado com sucesso', result });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao enviar email' });
        }
    },

    async resetPassword(req, res) {
        const { email, newPassword } = req.body;

        const user = await UserModel.findEstudanteByEmail(email) || await UserModel.findMentorByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        try {
            await UserModel.updatePassword(email, hashedPassword); 

            res.json({ message: 'Senha redefinida com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao redefinir a senha' });
        }
    },

    async updateUser(req, res) {
        const { email, name, skills, seniority } = req.body;
    
        try {
            const user = await UserModel.findEstudanteByEmail(email) || await UserModel.findMentorByEmail(email);
    
            if (!user) {
                return res.status(400).json({ error: "Usuário não encontrado" });
            }
    
            const updateData = {};
            if (name) updateData.name = name;
            if (skills && user.skills !== undefined) updateData.skills = skills; 
            if (seniority && user.seniority !== undefined) updateData.seniority = seniority; 
    
            const updatedUser = await UserModel.updateUser(email, updateData);
    
            res.json({ message: 'Usuário atualizado com sucesso', user: updatedUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar o usuário' });
        }
    },

    async deleteUser(req, res) {
        const { email } = req.body;
    
        try {
            const user = await UserModel.findEstudanteByEmail(email) || await UserModel.findMentorByEmail(email);
    
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
    
            await UserModel.deleteUser(email);
            res.json({ message: "Usuário deletado com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao deletar o usuário" });
        }
    },

    async getUser(req, res) {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Email não fornecido" });
        }

        const user = await UserModel.findEstudanteByEmail(email) || await UserModel.findMentorByEmail(email);

        if (!user) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        res.json(user);
    },
}

module.exports = UserController