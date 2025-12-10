const mongoose = require('mongoose');
const normalize = require('normalize-mongoose').default;

const ItemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true 
        },
        restaurantId: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0 }
    },
    { 
        _id: false 
    }
);

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        items: { type: [ItemSchema], required: true, validate: v => Array.isArray(v) && v.length > 0 },
        status: {
            type: String,
            enum: ['Aguardando confirmação','Confirmado','Em preparação','Enviado','Cancelado'],
            default: 'Aguardando confirmação'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
);

OrderSchema.plugin(normalize);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;