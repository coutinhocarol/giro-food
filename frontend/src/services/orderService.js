const ORDER_BASE_URL = "http://localhost:3006/api/v1"; 
import { getAuthHeaders } from './authService';

export async function createOrder(orderData) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders`, {
            method: 'POST',
            headers: getAuthHeaders(), 
            body: JSON.stringify(orderData)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro ao finalizar o pedido.");
        return data.data; 
    } catch (error) {
        console.error("Erro na Criação de Pedido:", error.message);
        throw error;
    }
}

export async function trackOrder(orderId) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders/${orderId}/status`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Não foi possível acompanhar o pedido.");
        return data.data; 
    } catch (error) {
        console.error("Erro no Acompanhamento de Pedido:", error.message);
        throw error;
    }
}