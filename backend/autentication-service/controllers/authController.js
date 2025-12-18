const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Presumindo que o erro do JWT_SECRET foi corrigido no .env
    return jwt.sign({ id }, process.env.JWT_SECRET, { 
        expiresIn: '1d', // Expira em 1 dia
    });
};

// @route POST /api/v1/auth/register
exports.registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Opção 1: Verificar a existência via findOne (Mais rápido para dar feedback de e-mail duplicado)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'O endereço de e-mail já está registrado.' });
        }

        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user', 
        });

        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso!',
            token: generateToken(user.id),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        // TRATAMENTO DE ERRO ADAPTADO DO restaurantController.js:

        // Tratamento de Erro de Validação (e.g., campo obrigatório faltando)
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ success: false, message: messages.join(", ") });
        }

        // Tratamento de Erro de Chave Única (e.g., username duplicado)
        if (error.code && error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: `O campo '${field}' deve ser único. O valor fornecido já existe.`,
            });
        }
        
        // Tratamento de Erro Genérico 500
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno ao registrar usuário.', 
            error: error.message 
        });
    }
};

// @route POST /api/v1/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password'); 

        if (user && (await user.matchPassword(password))) {
            return res.status(200).json({
                success: true,
                message: 'Login bem-sucedido!',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id),
                },
            });
        } else {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }
    } catch (error) {
        // Tratamento de Erro Genérico 500
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno durante o login.', 
            error: error.message 
        });
    }
};

// @route GET /api/v1/auth/users
exports.getUsers = async (req, res) => {
    try {
        // Encontra todos os usuários e exclui o campo 'password' do resultado
        const users = await User.find().select('-password'); 

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        // Tratamento de Erro Genérico 500
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno ao buscar usuários.', 
            error: error.message 
        });
    }
};
