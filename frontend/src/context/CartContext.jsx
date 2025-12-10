import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);

    const addToCart = (item, currentRestaurantId) => {
        if (restaurantId && restaurantId !== currentRestaurantId) {
            if (!window.confirm("Você só pode pedir de um restaurante por vez. Deseja limpar o carrinho atual?")) return;
            setCart([]);
        }
        setRestaurantId(currentRestaurantId);
        
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };
    const decreaseItem = (itemId) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const clearCart = () => {
        setCart([]);
        setRestaurantId(null);
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, decreaseItem, clearCart, total, restaurantId }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);