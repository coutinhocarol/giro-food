import { getAuthHeaders } from "./authService";

const ORDER_BASE_URL = "http://localhost:3006/api/v1"; 

/**
 * Cria um novo pedido usando apenas o microsserviço de Pedidos.
 */
export async function createOrder(orderData) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao finalizar o pedido.");
        }

        // Espera-se que a API retorne { data: { id, ... } }
        return data.data;
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        throw error;
    }
}

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
export async function trackOrder(orderId) {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao acompanhar o status do pedido.");
    }

    const order = data.data;

    return {
      orderId: order.id,
      currentStatus: order.status,
      lastUpdate: order.updatedAt || order.createdAt
    };
  } catch (error) {
    console.error("Erro ao acompanhar o status do pedido:", error);
    throw error;
  }
}