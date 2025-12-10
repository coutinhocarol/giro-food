import { useState, useEffect } from 'react';
import { trackOrder, getOrderById } from '../services/orderService'; // Importe a nova função
import { useNavigate } from 'react-router-dom';

const STATUS_BLOQUEADOS = ["SAIU_PARA_ENTREGA", "ENTREGUE"];

export default function OrderTracking({ orderId }) {
    const [status, setStatus] = useState('Carregando...');

    const [orderDetails, setOrderDetails] = useState(null);
    
    const [isDelivered, setIsDelivered] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!orderId) return;

        getOrderById(orderId)
            .then(data => setOrderDetails(data))
            .catch(err => console.error("Pedido não encontrado no histórico local"));
    }, [orderId]);

    useEffect(() => {
        if (isCancelled) return;

        const checkStatus = async () => {
            try {
                const data = await trackOrder(orderId);
                
                if (!isCancelled) {
                    setStatus(data.currentStatus);
                    if (data.currentStatus === "ENTREGUE") setIsDelivered(true);
                    if (data.currentStatus === "CANCELADO") setIsCancelled(true);
                }
            } catch (err) {
                console.log("Erro ao rastrear");
            }
        };
        
        checkStatus();
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);
    }, [orderId, isCancelled]);


    const handleCancelOrder = () => {
        if (!STATUS_BLOQUEADOS.includes(status)) {
            if(window.confirm("Cancelar pedido?")) {
                setIsCancelled(true);
                setStatus("CANCELADO");
            }
        }
    };

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#717171', margin: 0 }}>Pedido #{orderId}</h2>
                
                <h1 style={{ 
                    color: status === "CANCELADO" ? 'red' : (isDelivered ? 'green' : '#ea1d2c'),
                    fontSize: '2rem', margin: '15px 0'
                }}>
                    {status === 'ENTREGUE' ? 'Concluído' : status.replace(/_/g, ' ')}
                </h1>

                {!isDelivered && !isCancelled && (
                    <button 
                        onClick={handleCancelOrder}
                        disabled={STATUS_BLOQUEADOS.includes(status)}
                        style={{ 
                            background: STATUS_BLOQUEADOS.includes(status) ? '#eee' : 'white', 
                            border: '1px solid #ea1d2c', 
                            color: STATUS_BLOQUEADOS.includes(status) ? '#999' : '#ea1d2c', 
                            padding: '10px 20px', 
                            borderRadius: '8px', 
                            cursor: STATUS_BLOQUEADOS.includes(status) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {STATUS_BLOQUEADOS.includes(status) ? 'Não é possível cancelar' : 'Cancelar Pedido'}
                    </button>
                )}
            </div>

            {orderDetails && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>Detalhes do Pedido</h3>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <strong style={{ fontSize: '1.1rem' }}>{orderDetails.restaurantName}</strong>
                        <p style={{ color: '#717171', fontSize: '0.9rem', margin: '5px 0' }}>
                            {new Date(orderDetails.date).toLocaleString()}
                        </p>
                    </div>

                    <div style={{ background: '#fafafa', padding: '15px', borderRadius: '8px' }}>
                        {orderDetails.items.map((item, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.95rem' }}>
                                <span>{item.quantity}x {item.name}</span>
                                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        
                        <div style={{ borderTop: '1px solid #ddd', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Total</strong>
                            <strong>R$ {orderDetails.total.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            )}
            
            <button onClick={() => navigate('/orders-history')} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#717171', textDecoration: 'underline', cursor: 'pointer', width: '100%' }}>
                Voltar para Meus Pedidos
            </button>
        </div>
    );
}