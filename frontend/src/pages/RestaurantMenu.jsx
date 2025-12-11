import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRestaurantMenu } from '../services/catalogService';
import { useCart } from '../context/CartContext';

export default function RestaurantMenu() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const { addToCart, decreaseItem, cart, total } = useCart();

    useEffect(() => {
        fetchRestaurantMenu(id).then(setMenu);
    }, [id]);

    const getQuantity = (itemId) => {
        const item = cart.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <h2 style={{ margin: '20px 0' }}>Cardápio</h2>
            
            {menu.map(item => {
                const quantity = getQuantity(item.id); 

                return (
                    <div key={item.id} className="menu-item">
                        <div style={{ flex: 1, paddingRight: '15px' }}>
                            <strong style={{ fontSize: '1.1rem', color: '#3e3e3e' }}>{item.name}</strong>
                            <p style={{ color: '#717171', fontSize: '0.9rem', margin: '5px 0' }}>{item.description}</p>
                            <p style={{ color: '#50a773', fontWeight: 'bold' }}>R$ {item.price.toFixed(2)}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            {item.image && (
                                <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                            
                            {}
                            {quantity === 0 ? (
                                <button 
                                    className="btn-primary btn-add"
                                    onClick={() => addToCart(item, id)} 
                                >
                                    Adicionar
                                </button>
                            ) : (
                                <div style={{ 
                                    display: 'flex', alignItems: 'center', gap: '10px', 
                                    border: '1px solid #ddd', borderRadius: '20px', padding: '5px 10px' 
                                }}>
                                    <button 
                                        onClick={() => decreaseItem(item.id)}
                                        style={{ background: 'none', border: 'none', color: '#ea1d2c', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
                                    >-</button>
                                    
                                    <span style={{ fontWeight: '600' }}>{quantity}</span>
                                    
                                    <button 
                                        onClick={() => addToCart(item, id)}
                                        style={{ background: 'none', border: 'none', color: '#ea1d2c', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', transform: 'translateY(2px)' }}
                                    >+</button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            
            {}
            {cart.length > 0 && (
                <div style={{ 
                    position: 'fixed', bottom: 0, left: 0, right: 0, 
                    background: 'white', padding: '15px', 
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#717171' }}>Total</p>
                        <strong style={{ fontSize: '1.2rem' }}>R$ {total.toFixed(2)}</strong>
                    </div>
                    <button 
                        onClick={() => navigate('/order')} 
                        className="btn-primary" 
                        style={{ width: 'auto', padding: '10px 30px' }}
                    >
                        Ver Sacola
                    </button>
                </div>
            )}
        </div>
    );
}