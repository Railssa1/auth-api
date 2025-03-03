const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const UserModel = {
    // Cria um usuário novo
    async createUser(name, email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Senha criptografada:", hashedPassword); // Adiciona esse log para garantir que está gerando a senha corretamente.
        return await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
    },

    // Busca um usuário pelo email
    async findUserByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    },

    // Compara a senha com o que está armazenado no banco
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
};

module.exports = UserModel;
