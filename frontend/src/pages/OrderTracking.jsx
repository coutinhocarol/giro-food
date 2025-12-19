import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackOrder } from '../services/orderService';

export default function OrderTracking({ orderId: propOrderId }) {
    const { orderId: paramOrderId } = useParams();
    const orderId = propOrderId || paramOrderId;
    
    const [status, setStatus] = useState('Buscando pedido...');
    const [displayStatus, setDisplayStatus] = useState('Aguardando confirmação');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await trackOrder(orderId);
                setStatus(data.currentStatus);
                setDisplayStatus(data.currentStatus); 
                setLoading(false);
            } catch (err) {
                setStatus('Erro ao carregar');
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        if (loading) return;

        if (['Entregue', 'Cancelado'].includes(status)) {
            setDisplayStatus(status);
            return;
        }

        const flux = [
            'Aguardando confirmação',
            'Confirmado',
            'Em preparação',
            'Enviado',
            'Entregue'
        ];

        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < flux.length - 1) {
                currentIndex++;
                setDisplayStatus(flux[currentIndex]);
            } else {
                clearInterval(interval);
            }
        }, 4000); // Muda de status a cada 4 segundos

        return () => clearInterval(interval);
    }, [loading]);

    const getProgressWidth = () => {
        switch (displayStatus) {
            case 'Aguardando confirmação': return '10%';
            case 'Confirmado': return '30%';
            case 'Em preparação': return '60%';
            case 'Enviado': return '80%';
            case 'Entregue': return '100%';
            default: return '0%';
        }
    };

    if (loading) return <div className="container" style={{padding:20}}>Carregando status...</div>;

    return (
        <div className="container" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px' }}>Acompanhe seu pedido</h2>
                <p style={{ color: '#717171', marginBottom: '30px' }}>ID: {orderId}</p>

                <div style={{ marginBottom: '40px' }}>
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" 
                        alt="Delivery" 
                        style={{ width: '100px', opacity: displayStatus === 'Entregue' ? 0.5 : 1 }} 
                    />
                </div>

                <h3 style={{ 
                    color: displayStatus === 'Entregue' ? '#00a200' : '#ea1d2c',
                    fontSize: '1.8rem'
                }}>
                    {displayStatus}
                </h3>
                
                {/* Barra de Progresso */}
                <div style={{ 
                    height: '10px', 
                    background: '#eee', 
                    borderRadius: '5px', 
                    margin: '20px 0', 
                    overflow: 'hidden' 
                }}>
                    <div style={{ 
                        height: '100%', 
                        background: displayStatus === 'Entregue' ? '#00a200' : '#ea1d2c', 
                        width: getProgressWidth(),
                        transition: 'width 1s ease-in-out'
                    }}></div>
                </div>

                <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    {displayStatus === 'Entregue' ? (
                        <div>
                            <p>Bom apetite! 😋</p>
                            <button onClick={() => navigate('/')} className="auth-button primary">
                                Fazer novo pedido
                            </button>
                        </div>
                    ) : (
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>
                            (Simulação: O status está atualizando automaticamente para demonstração)
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}