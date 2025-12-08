import { useState } from 'react';
import { createOrder } from '../services/orderService';
import { OrderBuilder } from '../utils/orderBuilder';

const initialCart = [
    { productId: '60c728e8f8d67c001f8e4c7d', name: 'Hambúrguer Clássico', price: 25.00, quantity: 2 },
    { productId: '60c728e8f8d67c001f8e4c7e', name: 'Batata Frita', price: 10.00, quantity: 1 },
];
const RESTAURANT_ID = '60c728e8f8d67c001f8e4c7c'; 

export default function OrderCreation() {
    const [cart] = useState(initialCart);
    const [address, setAddress] = useState('Rua Exemplo, 123');
    const [paymentMethod, setPaymentMethod] = useState('Cartão de Crédito');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [orderSuccessId, setOrderSuccessId] = useState(null);

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        setIsProcessing(true);
        setMessage('Processando pedido e pagamento...');

        try {
            const builder = new OrderBuilder(RESTAURANT_ID);
            
            cart.forEach(item => {
                builder.addItem(item.productId, item.quantity, item.price);
            });
            
            const orderPayload = builder
                .setAddress(address)
                .setPayment(paymentMethod)
                .build();
            const newOrder = await createOrder(orderPayload);
            
            setMessage(`✅ Pedido #${newOrder.id} criado com sucesso!`);
            setOrderSuccessId(newOrder.id);
        } catch (error) {
            setMessage(`❌ Falha ao criar pedido: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (orderSuccessId) {
        return (
            <div className="order-success" style={{ padding: '20px', color: 'green' }}>
                <h2>Pedido Confirmado!</h2>
                <p>Seu pedido #{orderSuccessId} está sendo preparado.</p>
            </div>
        );
    }

    return (
        <div className="order-creation-container" style={{ padding: '20px' }}>
            <h2>Finalizar Pedido</h2>
            
            <div className="cart-summary">
                <h3>Itens (Total: R$ {calculateTotal().toFixed(2)})</h3>
                <ul>
                    {cart.map(item => (
                        <li key={item.productId}>{item.name} ({item.quantity}x) - R$ {(item.price * item.quantity).toFixed(2)}</li>
                    ))}
                </ul>
            </div>

            <form onSubmit={handleSubmitOrder}>
                
                <label>Endereço de Entrega:</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ display: 'block', margin: '5px 0 10px 0', padding: '8px' }} />

                <label>Método de Pagamento:</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required style={{ display: 'block', margin: '5px 0 10px 0', padding: '8px' }}>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro na Entrega</option>
                </select>

                <p className="message" style={{ color: message.startsWith('❌') ? 'red' : 'blue' }}>{message}</p>
                
                <button type="submit" disabled={isProcessing || cart.length === 0} style={{ padding: '10px 15px', backgroundColor: 'darkblue', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
                </button>
            </form>
        </div>
    );
}