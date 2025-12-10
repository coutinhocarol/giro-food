import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants } from '../services/catalogService';

function RestaurantCard({ name, cuisineType, estimatedDeliveryTime, image, onClick }) {
    
    const bgImage = image ? `url(${image})` : '#ccc';

    return (
        <div className="restaurant-card" onClick={onClick}>
            <div 
                className="card-image-placeholder" 
                style={{ backgroundImage: bgImage }}
            ></div>
            <div className="card-info">
                <h3 className="card-title">{name}</h3>
                <div className="card-details">
                    {}
                    <span>⭐ 4.8 • {cuisineType}</span>
                    <span>{estimatedDeliveryTime} min • Grátis</span>
                </div>
            </div>
        </div>
    );
}

export default function RestaurantList() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRestaurants = async () => {
            try {
                const data = await fetchRestaurants(); 
                setRestaurants(data);
                setError(null);
            } catch (err) {
                setError("Não foi possível carregar a lista de restaurantes. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };

        loadRestaurants();
    }, []);

    const handleSelectRestaurant = (id) => {
    navigate(`/restaurant/${id}`);
    };

    if (loading) {
        return <div>Carregando restaurantes...</div>;
    }

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    if (restaurants.length === 0) {
        return <div style={{ padding: '20px' }}>Nenhum restaurante encontrado no momento.</div>;
    }

    return (
        <div className="restaurant-list-container" style={{ padding: '20px' }}>
            <h2>Restaurantes Disponíveis</h2>
            <div className="restaurants-grid">
                {restaurants.map(r => (
    <RestaurantCard 
        key={r.id} 
        {...r}
        onClick={() => handleSelectRestaurant(r.id)} 
    />
))}
            </div>
        </div>
    );
}