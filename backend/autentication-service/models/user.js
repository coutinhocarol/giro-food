const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const normalize = require('normalize-mongoose').default;

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'O nome de usuário é obrigatório.'],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'A senha é obrigatória.'],
            minlength: 6,
            select: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Por favor, use um endereço de e-mail válido.'],
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'delivery'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

// --- Middleware para Hash de Senha ---
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// --- Método para Comparação de Senha ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.plugin(normalize);

module.exports = mongoose.model('User', UserSchema);