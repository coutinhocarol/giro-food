const CATALOG_BASE_URL = "http://localhost:3004/api/v1"; 

export async function fetchRestaurants() {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants?isOpen=true`);
        if (!response.ok) throw new Error(`Erro ${response.status} ao buscar restaurantes.`);
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error("Erro na comunicação com MS Catálogo (Restaurantes):", error);
        throw error;
    }
}

export async function fetchRestaurantMenu(restaurantId) {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants/${restaurantId}`);
        if (!response.ok) throw new Error("Restaurante ou cardápio não encontrado.");
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error(`Erro na busca do Menu para ID ${restaurantId}:`, error);
        throw error;
    }
}