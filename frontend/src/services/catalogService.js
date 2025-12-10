const CATALOG_BASE_URL = "http://localhost:3004/api/v1"; 

/**
 * Busca a lista de restaurantes diretamente do microsserviço de Catálogo.
 */
export async function fetchRestaurants() {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants?isOpen=true`);
<<<<<<< Updated upstream
        if (!response.ok) throw new Error(`Erro ${response.status} ao buscar restaurantes.`);
=======
>>>>>>> Stashed changes
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar restaurantes.");
        }

        // Espera-se que a API retorne { data: [...] }
        return data.data;
    } catch (error) {
<<<<<<< Updated upstream
        console.error("Erro na comunicação com MS Catálogo (Restaurantes):", error);
=======
        console.error("Erro ao buscar restaurantes:", error);
>>>>>>> Stashed changes
        throw error;
    }
}

/**
 * Busca o cardápio de um restaurante diretamente do microsserviço de Catálogo.
 */
export async function fetchRestaurantMenu(restaurantId) {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants/${restaurantId}`);
<<<<<<< Updated upstream
        if (!response.ok) throw new Error("Restaurante ou cardápio não encontrado.");
=======
>>>>>>> Stashed changes
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar cardápio do restaurante.");
        }

        // Dependendo do backend, pode vir como lista em data.data
        // ou como objeto com propriedade menu.
        if (Array.isArray(data.data)) {
            return data.data;
        }

        if (data.data && Array.isArray(data.data.menu)) {
            return data.data.menu;
        }

        return [];
    } catch (error) {
<<<<<<< Updated upstream
        console.error(`Erro na busca do Menu para ID ${restaurantId}:`, error);
        throw error;
    }
=======
        console.error(`Erro ao buscar cardápio do restaurante ${restaurantId}:`, error);
        // Sem mock: em caso de erro, retornamos lista vazia.
        return [];
    }
}

export async function getRestaurantNameById(id) {
    try {
        const response = await fetch(`${CATALOG_BASE_URL}/restaurants/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar restaurante.");
        }

        const restaurant = Array.isArray(data.data) ? data.data[0] : data.data;

        return restaurant?.name || "Restaurante";
    } catch (error) {
        console.error(`Erro ao buscar restaurante ${id}:`, error);
        return "Restaurante";
    }
>>>>>>> Stashed changes
}