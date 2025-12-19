import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);
    const [restaurantName, setRestaurantName] = useState('');

    const addToCart = (item, currentRestaurantId, currentRestaurantName) => {
        if (restaurantId && restaurantId !== currentRestaurantId) {
            if (!window.confirm("Você só pode pedir de um restaurante por vez. Deseja limpar o carrinho atual?")) return;
            setCart([]);
        }
        setRestaurantId(currentRestaurantId);
        setRestaurantName(currentRestaurantName); 
        
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1, restaurantId: currentRestaurantId }]; 
        });
    };

    const clearCart = () => {
        setCart([]);
        setRestaurantId(null);
        setRestaurantName('');
    };
    
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, clearCart, total, restaurantId, restaurantName }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);