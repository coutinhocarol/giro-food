import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getMyOrders().then(data => {
            setOrders(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="container" style={{padding:'20px'}}>Carregando pedidos...</div>;

    if (orders.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <h3>Você ainda não fez nenhum pedido 😞</h3>
                <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '20px', width: 'auto' }}>
                    Encontrar Restaurantes
                </button>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            <h2 style={{ margin: '20px 0' }}>Meus Pedidos</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map(order => (
                    <div key={order.id} style={{ 
                        background: 'white', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        border: '1px solid #eee',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        marginBottom: '15px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <strong style={{ color: '#3e3e3e', fontSize: '1.1rem' }}>
                                {order.restaurantName}
                            </strong>
                            <span style={{ fontSize: '0.9rem', color: '#717171' }}>
                                {new Date(order.date).toLocaleDateString()}
                            </span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '0.9rem', color: '#717171' }}>
                                <span style={{ 
                                    display: 'inline-block', width: '8px', height: '8px', 
                                    borderRadius: '50%', 
                                    background: order.status === 'Entregue' ? 'green' : '#ea1d2c',
                                    marginRight: '6px'
                                }}></span>
                                
                                {order.status}

                                <span style={{ margin: '0 5px' }}>•</span>
                                <span style={{ fontSize: '0.8em' }}>ID: {order.id}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '10px', borderTop: '1px solid #f0f0f0', paddingTop: '10px', fontSize: '0.9rem' }}>
                             {order.items && order.items.map((i, index) => (
                                 <div key={index}>
                                     {i.quantity}x {i.name || "Item sem nome"} 
                                     <span style={{color: '#999', fontSize:'0.8em', marginLeft:'5px'}}>
                                        (R$ {i.price.toFixed(2)})
                                     </span>
                                 </div>
                             ))}
                             <br/>
                             <div style={{textAlign: 'right', fontSize: '1.1rem'}}>
                                Total: <strong>R$ {order.total.toFixed(2)}</strong>
                             </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}