import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RestaurantList from './pages/RestaurantList';
import OrderCreation from './pages/OrderCreation';
import OrderTracking from './pages/OrderTracking';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Início</Link> | 
        <Link to="/order" style={{ margin: '0 10px' }}>Criar Pedido (Teste)</Link>
      </nav>

      <Routes>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/order" element={<OrderCreation />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;