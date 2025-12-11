import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import RestaurantList from "./pages/RestaurantList";
import RestaurantMenu from "./pages/RestaurantMenu"; 
import Login from "./pages/Login"; 
import Register from "./pages/register"; 

import OrderCreation from "./pages/OrderCreation";
import OrderTracking from "./pages/OrderTracking";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

function Layout({ children }) {
  return (
    <div>
      <header className="app-header">
        <Link to="/" className="logo">
          Giro
          <span style={{ color: "#333", fontSize: "1rem", marginLeft: "5px" }}>Food</span>
        </Link>
        <div style={{ display: "flex", gap: "20px", fontSize: "0.9rem", fontWeight: "600" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#ea1d2c" }}>Início</Link>
          <Link to="/orders-history" style={{ textDecoration: "none", color: "#717171" }}>Pedidos</Link>
          <Link to="/order" style={{ textDecoration: "none", color: "#717171" }}>Sacola</Link>
          <Link to="/login" style={{ textDecoration: "none", color: "#717171" }}>Entrar</Link>
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/order" element={<OrderCreation />} />
              <Route path="/tracking/:orderId" element={<OrderTrackingWrapper />} />
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;