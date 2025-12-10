import { getAuthHeaders } from './authService';

const ORDER_BASE_URL = "http://localhost:3006/api/v1"; 

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const TEMPO_PREPARO = { min: 10, max: 25 }; 
const TEMPO_ENTREGA = { min: 10, max: 20 };

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
        console.warn("⚠️ API Offline. Criando pedido simulado e salvando no Histórico.");
        await delay(1000);
        
        const newId = `MOCK-${Math.floor(Math.random() * 10000)}`;
        
        const newOrder = {
            id: newId,
            date: new Date().toISOString(),
            status: "PREPARANDO",
            total: orderData.totalAmount,
            
            restaurantName: orderData.restaurantName || "Restaurante Parceiro", 
            
            items: orderData.items
        };

        const currentHistory = JSON.parse(localStorage.getItem('my_orders_history')) || [];
        localStorage.setItem('my_orders_history', JSON.stringify([newOrder, ...currentHistory]));
        initSimulation(newId);

        return { id: newId, status: "RECEBIDO" };
    }
}
export async function getMyOrders() {
    const history = JSON.parse(localStorage.getItem('my_orders_history')) || [];
    return history;
}
export async function trackOrder(orderId) {
    try {
        const response = await fetch(`${ORDER_BASE_URL}/orders/${orderId}/status`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        const data = await response.json();
        if (!response.ok) throw new Error("Erro API");
        return data.data; 

    } catch (error) {
        return mockTimeBasedTracking(orderId);
    }
}

export async function getOrderById(orderId) {
    const history = JSON.parse(localStorage.getItem('my_orders_history')) || [];
    

    const order = history.find(o => o.id === orderId);
    
    if (!order) {
        throw new Error("Pedido não encontrado.");
    }
    return order;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function initSimulation(orderId) {
    const STORAGE_KEY = `sim_config_${orderId}`;
    const durationPreparo = getRandomInt(TEMPO_PREPARO.min, TEMPO_PREPARO.max) * 1000;
    const durationEntrega = getRandomInt(TEMPO_ENTREGA.min, TEMPO_ENTREGA.max) * 1000;
    const config = {
        startTime: Date.now(),
        durationPreparo: durationPreparo,
        durationEntrega: durationEntrega
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return config;
}

function mockTimeBasedTracking(orderId) {
    const STORAGE_KEY = `sim_config_${orderId}`;
    let config = JSON.parse(localStorage.getItem(STORAGE_KEY));
    let startTime;
    const durationPreparo = 15000;
    const durationEntrega = 15000; 

    if (!config) {
        const history = JSON.parse(localStorage.getItem('my_orders_history')) || [];
        const orderFromHistory = history.find(o => o.id === orderId);
        
        if (orderFromHistory) {
            startTime = new Date(orderFromHistory.date).getTime();
        } else {
            startTime = Date.now();
        }
    } else {
        startTime = config.startTime;
    }

    const now = Date.now();
    const elapsedTime = now - startTime;
    let currentStatus = "PREPARANDO";

    if (elapsedTime > (durationPreparo + durationEntrega)) {
        currentStatus = "ENTREGUE";
    } else if (elapsedTime > durationPreparo) {
        currentStatus = "SAIU_PARA_ENTREGA";
    }

    return {
        orderId: orderId,
        currentStatus: currentStatus,
        lastUpdate: new Date().toISOString()
    };
}