import { MOCK_RESTAURANTS, MOCK_MENUS } from '../../mocks/data';
const CATALOG_BASE_URL = "http://localhost:3004/api/v1"; 

export async function fetchRestaurants() {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants?isOpen=true`);
        if (!response.ok) throw new Error("API Offline");
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.warn("⚠️ Backend offline. Usando dados mockados de Restaurantes.");
        return MOCK_RESTAURANTS;
    }
}

export async function fetchRestaurantMenu(restaurantId) {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants/${restaurantId}`);
        if (!response.ok) throw new Error("API Offline");
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.warn(`⚠️ Backend offline. Usando menu mockado para ID ${restaurantId}.`);
        return MOCK_MENUS[restaurantId] || [];
    }
}

export async function getRestaurantNameById(id) {
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
    if (restaurant) return restaurant.name;
    return "Restaurante Desconhecido";
}