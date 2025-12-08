import { useState, useEffect } from 'react';
import { trackOrder } from '../services/orderService';

const STATUS_ENTREGUE = "ENTREGUE"; 
const FAKE_ORDER_ID = 'XYZ-123';

export default function OrderTracking({ orderId = FAKE_ORDER_ID }) {
    const [status, setStatus] = useState('Em busca...');
    const [isDelivered, setIsDelivered] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let interval;

        const checkStatus = async () => {
            try {
                const data = await trackOrder(orderId); 
                setStatus(data.currentStatus);
                if (data.currentStatus === STATUS_ENTREGUE) {
                    setIsDelivered(true);
                    clearInterval(interval); 
                }
            } catch (err) {
                setError("Falha ao carregar o status do pedido.");
                clearInterval(interval);
            }
        };
        checkStatus();
        interval = setInterval(checkStatus, 15000); 

        return () => clearInterval(interval);
    }, [orderId]);

    if (error) {
        return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
    }

    return (
        <div className="order-tracking-container" style={{ padding: '20px' }}>
            <h2>Acompanhamento do Pedido #{orderId}</h2>
            <div className="status-display">
                <p>Status Atual: <strong>{status}</strong></p>
                {!isDelivered ? (
                    <p>Aguardando atualização. Próxima checagem em 15s...</p>
                ) : (
                    <p style={{ fontWeight: 'bold', color: 'green' }}>✅ **Pedido entregue com sucesso!**</p>
                )}
            </div>
        </div>
    );
}