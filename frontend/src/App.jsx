import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from "./context/CartContext";
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import OrderCreation from './pages/OrderCreation';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import './index.css'; 

function Layout({ children }) {
    return (
        <div>
             <header className="app-header">
                <Link to="/" className="logo">ifood<span style={{color: '#333', fontSize: '1rem', marginLeft: '5px'}}>clone</span></Link>
                <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#ea1d2c' }}>Início</Link>
                    <Link to="/orders-history" style={{ textDecoration: 'none', color: '#717171' }}>Pedidos</Link>
                    <Link to="/order" style={{ textDecoration: 'none', color: '#717171' }}>Sacola</Link>
                </div>
             </header>
             <main className="container">{children}</main>
        </div>
    );
}

function App() {
  return (
    <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<RestaurantList />} />
              <Route path="/restaurant/:id" element={<RestaurantMenu />} />
              <Route path="/order" element={<OrderCreation />} />
              <Route path="/orders-history" element={<OrderHistory />} />
              <Route path="/tracking/:orderId" element={<OrderTrackingWrapper />} />
            </Routes>
          </Layout>
        </BrowserRouter>
    </CartProvider>
  );
}

import { useParams } from 'react-router-dom';
function OrderTrackingWrapper() {
  const { orderId } = useParams();
  return <OrderTracking orderId={orderId} />;
}

export default App;