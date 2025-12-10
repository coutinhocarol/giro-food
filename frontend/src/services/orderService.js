const ORDER_BASE_URL = "http://localhost:3006/api/v1"; 
<<<<<<< Updated upstream
import { getAuthHeaders } from './authService';

=======

/**
 * Cria um novo pedido usando apenas o microsserviço de Pedidos.
 */
>>>>>>> Stashed changes
export async function createOrder(orderData) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
<<<<<<< Updated upstream
        if (!response.ok) throw new Error(data.message || "Erro ao finalizar o pedido.");
        return data.data; 
    } catch (error) {
        console.error("Erro na Criação de Pedido:", error.message);
=======

        if (!response.ok) {
            throw new Error(data.message || "Erro ao finalizar o pedido.");
        }

        // Espera-se que a API retorne { data: { id, ... } }
        return data.data;
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
>>>>>>> Stashed changes
        throw error;
    }
}

<<<<<<< Updated upstream
=======
/**
 * Converte o formato de pedido vindo da API
 * para o formato esperado pelas telas de histórico e rastreamento.
 */
function normalizeOrder(apiOrder) {
    if (!apiOrder) return null;

    const restaurantName =
        apiOrder.restaurantName ||
        (apiOrder.restaurant && apiOrder.restaurant.name) ||
        "Restaurante";

    const items = Array.isArray(apiOrder.items)
        ? apiOrder.items.map((item) => ({
              name: item.productName || item.name || "Item",
              quantity: item.quantity || 1,
              price: item.price ?? item.unitPrice ?? 0
          }))
        : [];

    const total = apiOrder.total ?? apiOrder.totalAmount ?? 0;

    const date = apiOrder.createdAt || apiOrder.date || new Date().toISOString();

    const status = apiOrder.status || "DESCONHECIDO";

    return {
        id: apiOrder.id,
        restaurantName,
        items,
        total,
        date,
        status
    };
}

/**
 * Lista os pedidos do usuário autenticado diretamente do microsserviço.
 */
export async function getMyOrders() {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar pedidos.");
        }

        const ordersFromApi = data.data || [];
        return ordersFromApi.map(normalizeOrder);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        throw error;
    }
}

/**
 * Busca os detalhes de um pedido específico no microsserviço.
 */
export async function getOrderById(orderId) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders/${orderId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Pedido não encontrado.");
        }

        return normalizeOrder(data.data);
    } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
        throw error;
    }
}

/**
 * Consulta o status atual do pedido no microsserviço de Pedidos.
 */
>>>>>>> Stashed changes
export async function trackOrder(orderId) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders/${orderId}/status`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();
<<<<<<< Updated upstream
        if (!response.ok) throw new Error(data.message || "Não foi possível acompanhar o pedido.");
        return data.data; 
    } catch (error) {
        console.error("Erro no Acompanhamento de Pedido:", error.message);
=======

        if (!response.ok) {
            throw new Error(data.message || "Erro ao acompanhar o status do pedido.");
        }

        // Espera-se que a API retorne { data: { currentStatus, ... } }
        return data.data;
    } catch (error) {
        console.error("Erro ao acompanhar o status do pedido:", error);
>>>>>>> Stashed changes
        throw error;
    }
}