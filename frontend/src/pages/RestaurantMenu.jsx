import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRestaurantMenu, getRestaurantDetails } from '../services/catalogService';
import { useCart } from '../context/CartContext';

export default function RestaurantMenu() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [error, setError] = useState(null);
    const { addToCart, cart, total } = useCart();

    useEffect(() => {
        const loadData = async () => {
            try {
                const restData = await getRestaurantDetails(id);
                setRestaurant(restData);
                const menuData = await fetchRestaurantMenu(id);
                setMenu(menuData);
                setError(null);
            } catch (err) {
                setError("Não foi possível carregar o cardápio. O MS Catálogo está rodando?");
            }
        };
        loadData();
    }, [id]);

    if (error) return <div className="container" style={{color: 'red', marginTop: 20}}>{error}</div>;
    if (!restaurant) return <div className="container" style={{padding: 20}}>Carregando...</div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={{marginBottom: 20}}>
                <h1 style={{margin:0}}>{restaurant.name}</h1>
                <p style={{color:'#666'}}>{restaurant.cuisineType} • {restaurant.estimatedDeliveryTime} min</p>
            </div>
            
            <h3 style={{ margin: '20px 0' }}>Cardápio</h3>
            {menu.map(item => (
                <div key={item._id || item.id} className="menu-item">
                    <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
                        <p style={{ color: '#717171', fontSize: '0.9rem' }}>{item.description}</p>
                        <p style={{ color: '#50a773', fontWeight: 'bold' }}>R$ {item.price.toFixed(2)}</p>
                    </div>
                    
                    <button 
                        className="btn-add auth-button primary" 
                        onClick={() => addToCart(item, restaurant.id)}
                    >
                        Adicionar ({cart.find(i => i.id === item.id)?.quantity || 0})
                    </button>
                </div>
            ))}
            
            {cart.length > 0 && (
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '15px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><p style={{margin:0}}>Total</p><strong>R$ {total.toFixed(2)}</strong></div>
                    <button onClick={() => navigate('/order')} className="auth-button primary" style={{width: 'auto'}}>Ver Sacola</button>
                </div>
            )}
        </div>
    );
}