import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { getRestaurantNameById } from '../services/catalogService'; 
export default function OrderCreation() {
    const { cart, total, restaurantId, clearCart, addToCart, decreaseItem } = useCart();
    const navigate = useNavigate();
    
    const [address, setAddress] = useState('Rua Exemplo, 123');
    const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/');
        }
    }, [cart, navigate]);

   const handleSubmitOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        const nomeRestaurante = await getRestaurantNameById(restaurantId);

        const orderData = {
            restaurantId: restaurantId,
            restaurantName: nomeRestaurante,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                name: item.name 
            })),
            totalAmount: total,
            deliveryAddress: address,
            paymentMethod: paymentMethod
        };

        try {
            const result = await createOrder(orderData);
            setMessage(`✅ Pedido Criado! ID: ${result.id}`);
            clearCart(); 
            setTimeout(() => navigate(`/tracking/${result.id}`), 1000);
        } catch (error) {
            const fakeId = `MOCK-${Math.floor(Math.random() * 1000)}`;
            const offlineOrder = { ...orderData, id: fakeId }; 
        
            setMessage(`⚠️ Modo Offline: Pedido Simulado Criado! ID: ${fakeId}`);
            clearCart();
            setTimeout(() => navigate(`/tracking/${fakeId}`), 2000);
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) return null;

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
                <h2>Sua Sacola</h2>
                <button 
                    onClick={clearCart}
                    style={{ color: '#ea1d2c', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Limpar
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {cart.map(item => (
                    <div key={item.id} style={{ padding: '15px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', color: '#3e3e3e' }}>{item.name}</div>
                            <div style={{ color: '#717171', fontSize: '0.9rem' }}>
                                R$ {(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                        <div style={{ 
                            display: 'flex', alignItems: 'center', gap: '10px', 
                            border: '1px solid #ddd', borderRadius: '20px', padding: '5px 10px' 
                        }}>
                            <button 
                                onClick={() => decreaseItem(item.id)}
                                style={{ background: 'none', border: 'none', color: '#ea1d2c', fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
                            >-</button>
                            
                            <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            
                            <button 
                                onClick={() => addToCart(item, restaurantId)}
                                style={{ background: 'none', border: 'none', color: '#ea1d2c', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold', transform: 'translateY(2px)' }}
                            >+</button>
                        </div>
                    </div>
                ))}
                
                <div style={{ padding: '20px', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>Total</span>
                    <strong style={{ fontSize: '1.5rem' }}>R$ {total.toFixed(2)}</strong>
                </div>
            </div>

            <h3 style={{ marginTop: '30px' }}>Entrega e Pagamento</h3>
            <form onSubmit={handleSubmitOrder} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                <label style={{ display: 'block', margin: '10px 0' }}>
                    Endereço:
                    <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </label>

                <label style={{ display: 'block', margin: '10px 0' }}>
                    Pagamento:
                    <select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option>Cartão de Crédito</option>
                        <option>Pix</option>
                        <option>Dinheiro</option>
                    </select>
                </label>

                <p style={{ color: message.startsWith('❌') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>
                
                <button type="submit" disabled={isProcessing} className="btn-primary" style={{ marginTop: '10px' }}>
                    {isProcessing ? 'Processando...' : 'Fazer Pedido'}
                </button>
            </form>
        </div>
    );
}