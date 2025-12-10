const Order = require('../models/order');
const eventBus = require('../events/eventBus');

// --- Criação de pedido ---
// @route POST /api/v1/orders
// @access Private
exports.createOrder = async (req, res) => {
  //const userId = req.userId;
  const userId = req.userId;
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'É necessário informar uma lista não vazia de items.'
    });
  }

  try {
    const order = await Order.create({
      userId,
      items,
      status: 'Aguardando confirmação'
    });

    // === publisher: pedido criado ===
    eventBus.emit('order.created', {
      orderId: order.id,
      userId: order.userId,
      items: order.items,
      status: order.status,
      createdAt: order.createdAt
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido.',
      error: error.message
    });
  }
};

// --- Buscar pedido por ID ---
// @route GET /api/v1/orders/:id
// @access Private
exports.getOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const order = await Order.findById(id).exec();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }
    // Opcional: garantir que o usuário logado é o dono do pedido
    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Acesso não autorizado.' });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID de pedido inválido.' });
    }
    return res.status(500).json({ success: false, message: 'Erro ao buscar pedido.', error: error.message });
  }
};

// --- Atualizar pedido ---
// @route PUT /api/v1/orders/:id
// @access Private
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const allowedUpdates = ['items', 'status'];
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: `Nenhum campo válido para atualização. Campos permitidos: ${allowedUpdates.join(', ')}`
    });
  }

  try {
    const order = await Order.findById(id).exec();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }
    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Acesso não autorizado.' });
    }

    Object.assign(order, updates);
    order.updatedAt = Date.now();
    await order.save();

    // === publisher: pedido atualizado ===
    eventBus.emit('order.updated', {
      orderId: order.id,
      updates,
      updatedAt: order.updatedAt
    });

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID de pedido inválido.' });
    }
    return res.status(500).json({ success: false, message: 'Erro ao atualizar pedido.', error: error.message });
  }
};

// --- Cancelar pedido (deletar ou marcar como cancelado) ---
// @route DELETE /api/v1/orders/:id   (ou pode ser PATCH para status CANCELLED)
// @access Private
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const order = await Order.findById(id).exec();
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado.' });
    }
    if (order.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Acesso não autorizado.' });
    }

    // opção A: remover do banco  
    await Order.findByIdAndDelete(id);
    // === publisher: pedido cancelado ===
    eventBus.emit('order.cancelled', { orderId: id, cancelledAt: new Date().toISOString() });

    return res.status(200).json({ success: true, data: {} });

  } catch (error) {
    console.error('Error cancelling order:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'ID de pedido inválido.' });
    }
    return res.status(500).json({ success: false, message: 'Erro ao cancelar pedido.', error: error.message });
  }
};