import { useState, useEffect } from 'react';
import { trackOrder } from '../services/orderService';
export default function OrderTracking({ orderId }) {
  const [status, setStatus] = useState('Carregando...');
  const [isFinal, setIsFinal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('ID do pedido não informado.');
      return;
    }

    let interval;

    const checkStatus = async () => {
      try {
        const data = await trackOrder(orderId); 
        setStatus(data.currentStatus);

        if (['Enviado', 'Cancelado'].includes(data.currentStatus)) {
          setIsFinal(true);
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
}