const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const UserModel = {
    // Cria um usuário estudante
    async createEstudante(email, password, name) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await prisma.user_Estudante.create({   
            data: { email, password: hashedPassword, name }
        });
    },

    // Cria um usuário mentor
    async createMentor(email, password, skills, seniority, name) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return await prisma.user_Mentor.create({   
            data: {
                email,
                password: hashedPassword,
                skills: skills, 
                seniority,
                name
            }
        });
    },

    // Busca um usuário estudante pelo email
    async findEstudanteByEmail(email) {
        return await prisma.user_Estudante.findUnique({
            where: { email }
        });
    },

    // Busca um usuário mentor pelo email
    async findMentorByEmail(email) {
        const mentor = await prisma.user_Mentor.findUnique({
            where: { email }
        });
    
        if (mentor) {
            return {
                ...mentor,
                skills: Array.isArray(mentor.skills) ? mentor.skills : JSON.parse(mentor.skills)
            };
        }
        
        return null;
    },

    // Compara a senha com o que está armazenado no banco
    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    },

    // Atualiza senha
    async updatePassword(email, hashedPassword) {
        const estudante = await prisma.user_Estudante.findUnique({
            where: { email }
        });
    
        if (estudante) {
            return await prisma.user_Estudante.update({
                where: { email },
                data: { password: hashedPassword },
            });
        }
    
        const mentor = await prisma.user_Mentor.findUnique({
            where: { email }
        });
    
        if (mentor) {
            return await prisma.user_Mentor.update({
                where: { email },
                data: { password: hashedPassword },
            });
        }
    
        throw new Error("Usuário não encontrado");
    },

    // Atualiza os dados do usuário
    async updateUser(email, data) {
        const userType = await prisma.user_Estudante.findUnique({
            where: { email }
        }) ? 'estudante' : 'mentor';
    
        try {
            if (userType === 'estudante') {
                return await prisma.user_Estudante.update({
                    where: { email },
                    data,
                });
            } else {
                return await prisma.user_Mentor.update({
                    where: { email },
                    data,
                });
            }
        } catch (error) {
            throw new Error("Erro ao atualizar o usuário: " + error.message);
        }
    },

    // Deleta um usuário 
    async deleteUser(email) {
        const estudante = await prisma.user_Estudante.findUnique({
            where: { email }
        });
    
        if (estudante) {
            return await prisma.user_Estudante.delete({
                where: { email },
            });
        }
    
        const mentor = await prisma.user_Mentor.findUnique({
            where: { email }
        });
    
        if (mentor) {
            return await prisma.user_Mentor.delete({
                where: { email },
            });
        }
    
        throw new Error("Usuário não encontrado");
    },

    // Lista todos os dados de um usuário
    async listUser(email) {
        const estudante = await prisma.user_Estudante.findUnique({
            where: { email }
        });
    
        if (estudante) {
            return await prisma.user_Estudante.findUnique({
                where: { email },
            });
        }
    
        const mentor = await prisma.user_Mentor.findUnique({
            where: { email }
        });
    
        if (mentor) {
            return await prisma.user_Mentor.findUnique({
                where: { email },
            });
        }
    
        throw new Error("Usuário não encontrado");
    }
};

module.exports = UserModel;
