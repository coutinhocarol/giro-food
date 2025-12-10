<<<<<<< Updated upstream
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

=======
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import RestaurantList from "./pages/RestaurantList";
import RestaurantMenu from "./pages/RestaurantMenu";
import OrderCreation from "./pages/OrderCreation";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/register";
import "./index.css";

function Layout({ children }) {
  return (
    <div>
      <header className="app-header">
        <Link to="/" className="logo">
          Giro
          <span
            style={{ color: "#333", fontSize: "1rem", marginLeft: "5px" }}
          >
            Food
          </span>
        </Link>
        <div
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "0.9rem",
            fontWeight: "600",
          }}
        >
          <Link
            to="/"
            style={{ textDecoration: "none", color: "#ea1d2c" }}
          >
            Início
          </Link>
          <Link
            to="/orders-history"
            style={{ textDecoration: "none", color: "#717171" }}
          >
            Pedidos
          </Link>
          <Link
            to="/order"
            style={{ textDecoration: "none", color: "#717171" }}
          >
            Sacola
          </Link>
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "#717171" }}
          >
            Entrar
          </Link>
          <Link
            to="/register"
            style={{ textDecoration: "none", color: "#717171" }}
          >
            Criar conta
          </Link>
        </div>
      </header>
      <main className="container">{children}</main>
    </div>
  );
}

function OrderTrackingWrapper() {
  const { orderId } = useParams();
  return <OrderTracking orderId={orderId} />;
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
            <Route
              path="/tracking/:orderId"
              element={<OrderTrackingWrapper />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

>>>>>>> Stashed changes
export default App;