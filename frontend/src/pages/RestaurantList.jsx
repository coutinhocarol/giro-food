import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurants } from '../services/catalogService';

function RestaurantCard({ name, cuisine, deliveryTime, onClick }) {
    return (
        <div className="restaurant-card" onClick={onClick} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', cursor: 'pointer' }}>
            <h3>{name}</h3>
            <p>Culinária: {cuisine}</p>
            <p>Entrega Estimada: {deliveryTime} min</p>
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
        console.log(`Selecionado restaurante ${id}`);
        navigate('/order');
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
                        name={r.name} 
                        cuisine={r.cuisineType}
                        deliveryTime={r.estimatedDeliveryTime}
                        onClick={() => handleSelectRestaurant(r.id)} 
                    />
                ))}
            </div>
        </div>
    );
}