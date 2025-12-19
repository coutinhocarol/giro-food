import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import { OrderBuilder } from '../utils/orderBuilder';
import { useCart } from '../context/CartContext';

export default function OrderCreation() {
    const { cart, total, restaurantId, clearCart } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    
    if (cart.length === 0) {
        return <div className="container" style={{padding: '20px'}}>Sua sacola está vazia. <a href="/">Voltar para restaurantes</a></div>;
    }


    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        if (!address.trim()) {
            setMessage("❌ Por favor, preencha o endereço de entrega.");
            return;
        }
        
        setIsProcessing(true);
        setMessage('Processando pedido e pagamento...');

        try {
            const builder = new OrderBuilder(restaurantId); 
            
            cart.forEach(item => {
                builder.addItem(item.id, item.quantity, item.price); 
            });
            
            const orderPayload = builder
                .setAddress(address)
                .setPayment(paymentMethod)
                .build();
            
            const newOrder = await createOrder(orderPayload);
            
            setMessage(`✅ Pedido #${newOrder.id} criado com sucesso!`);
            clearCart();
            
            setTimeout(() => navigate(`/tracking/${newOrder.id}`), 500);

        } catch (error) {
            setMessage(`❌ Falha ao criar pedido: ${error.message || 'Erro de conexão.'}`);
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="order-creation-container container">
            <h2 style={{marginBottom: '20px'}}>Finalizar Pedido</h2>
            
            <div className="auth-card" style={{padding: '20px', marginBottom: '20px'}}>
                <h3>Itens ({cart.length} no total)</h3>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {cart.map(item => (
                        <li key={item.id} style={{borderBottom: '1px solid #eee', padding: '8px 0', display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem'}}>
                            <span>{item.quantity}x {item.name}</span>
                            <strong>R$ {(item.price * item.quantity).toFixed(2)}</strong>
                        </li>
                    ))}
                </ul>
                <div style={{marginTop: '10px', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'}}>
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="auth-card" style={{padding: '20px'}}>
                
                <div className="form-group">
                    <label>Endereço de Entrega</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, Número, Bairro" required style={{width: '100%', padding: '10px'}} />
                </div>

                <div className="form-group">
                    <label>Método de Pagamento</label>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required style={{width: '100%', padding: '10px'}}>
                        <option value="Cartão de Crédito">Cartão de Crédito</option>
                        <option value="Pix">Pix</option>
                        <option value="Dinheiro">Dinheiro na Entrega</option>
                    </select>
                </div>

                {message && <p className={`auth-feedback ${message.startsWith('❌') ? 'auth-error' : 'auth-success'}`}>{message}</p>}
                
                <button 
                    className="auth-button primary" 
                    type="submit" 
                    disabled={isProcessing || cart.length === 0}
                >
                    {isProcessing ? 'Processando...' : `Fazer Pedido (R$ ${total.toFixed(2)})`}
                </button>
            </form>
        </div>
    );
}