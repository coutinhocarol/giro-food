const CATALOG_BASE_URL = "http://localhost:8081/api/v1"; 

export async function fetchRestaurants() {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants?isOpen=true`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar restaurantes.");
        }

        return data.data;
    } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
        throw error;
    }
}

export async function fetchRestaurantMenu(restaurantId) {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants/${restaurantId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar cardápio do restaurante.");
        }

        if (data.data && Array.isArray(data.data.menu)) {
            return data.data.menu;
        }

        return [];
    } catch (error) {
        console.error(`Erro ao buscar cardápio do restaurante ${restaurantId}:`, error);
        throw error;
    }
}

export async function getRestaurantDetails(id) {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar detalhes do restaurante.");
        }

        return data.data.restaurantDetails || {}; 
    } catch (error) {
        console.error(`Erro ao buscar restaurante ${id}:`, error);
        throw error;
    }
}