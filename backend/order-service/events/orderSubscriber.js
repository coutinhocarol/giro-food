const eventBus = require('./eventBus');
const axios = require('axios'); // <-- Agora importado corretamente

const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL; 

if (!CATALOG_SERVICE_URL) {
    console.error("ERRO CRÍTICO: Variável de ambiente CATALOG_SERVICE_URL não definida.");
}

// --- Cliente HTTP para o Catalog Service ---
const catalogServiceClient = {
    notifyNewOrder: async (restaurantId, orderPayload) => {
        if (!CATALOG_SERVICE_URL) return;

        const url = `${CATALOG_SERVICE_URL}/api/v1/restaurants/${restaurantId}/orders`;
        
        try {
            await axios.post(url, orderPayload); 
            console.log(`[POST ${restaurantId}] Pedido notificado com sucesso ao Catalog Service.`);
            return true;
        } catch (error) {
            const status = error.response ? error.response.status : 'N/A';
            const msg = error.response ? (error.response.data || error.response.statusText) : error.message;
            console.error(`ERRO HTTP (${status}) ao notificar novo pedido para ${restaurantId}. Mensagem:`, msg);
            return false;
        }
    },
    
    notifyOrderCancelled: async (orderId) => {
        if (!CATALOG_SERVICE_URL) return;

        const url = `${CATALOG_SERVICE_URL}/api/v1/orders/${orderId}/cancellation`; 
        
        try {
            await axios.patch(url, { status: 'CANCELLED' }); 
            console.log(`[PATCH ${orderId}] Cancelamento notificado com sucesso ao Catalog Service.`);
            return true;
        } catch (error) {
            const status = error.response ? error.response.status : 'N/A';
            const msg = error.response ? (error.response.data || error.response.statusText) : error.message;
            console.error(`ERRO HTTP (${status}) ao notificar cancelamento ${orderId}. Mensagem:`, msg);
            return false;
        }
    }
};

// --- Listener para pedido criado (order.created) ---
eventBus.on('order.created', async (payload) => {
  try {
    console.log('EVENT order.created recebido:', payload);

    const restaurantIds = Array.from(new Set(
      payload.items.map(item => item.restaurantId)
    ));

    const notifyPromises = restaurantIds.map(rid => {
      return catalogServiceClient.notifyNewOrder(rid, {
        orderId: payload.orderId,
        items: payload.items.filter(i => i.restaurantId === rid),
        userId: payload.userId,
        status: payload.status,
        createdAt: payload.createdAt
      });
    });

    await Promise.all(notifyPromises);
    console.log(`Processo de notificação de novo pedido concluído.`);
  } catch (err) {
    console.error('Erro interno ao processar evento order.created:', err);
  }
});

// --- Listener para pedido cancelado (order.cancelled) ---
eventBus.on('order.cancelled', async (payload) => {
  try {
    console.log('EVENT order.cancelled recebido:', payload);
    const { orderId } = payload;
    await catalogServiceClient.notifyOrderCancelled(orderId);
    console.log(`Processo de notificação de cancelamento concluído para pedido ${orderId}.`);
  } catch (err) {
    console.error('Erro interno ao processar evento order.cancelled:', err);
  }
});