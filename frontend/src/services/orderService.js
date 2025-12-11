import { getAuthHeaders } from "./authService"; 

const ORDER_BASE_URL = "http://localhost:3006/api/v1/orders"; 

export async function createOrder(orderData) {
    try {
        const response = await fetch(ORDER_BASE_URL, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao finalizar o pedido. O MS Pedidos está rodando?");
        }

        return data.data;
    } catch (error) {
        console.error("Erro ao criar pedido:", error);
        throw error;
    }
}

function normalizeOrder(apiOrder) {
    if (!apiOrder) return null;

    const status = apiOrder.status || "DESCONHECIDO";

    return {
        id: apiOrder.id,
        restaurantName: "Restaurante Parceiro",
        items: apiOrder.items || [],
        total: apiOrder.total ?? 0, 
        date: apiOrder.createdAt || new Date().toISOString(),
        status: status
    };
}

export async function getMyOrders() {
    try {
        const response = await fetch(ORDER_BASE_URL, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar histórico de pedidos.");
        }

        const ordersFromApi = data.data || [];
        return ordersFromApi.map(normalizeOrder);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        throw error;
    }
}

export async function trackOrder(orderId) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/${orderId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Pedido não encontrado.");
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