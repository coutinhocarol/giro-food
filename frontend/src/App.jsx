import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider} from "./context/AuthContext"; 
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import RestaurantList from "./pages/RestaurantList";
import RestaurantMenu from "./pages/RestaurantMenu";
import OrderCreation from "./pages/OrderCreation";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import Register from "./pages/register";

import "./index.css";

function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <header className="app-header">
        <Link to="/" className="logo">
          Giro
          <span style={{ color: "#333", fontSize: "1rem", marginLeft: "5px" }}>Food</span>
        </Link>
        <div style={{ display: "flex", gap: "20px", fontSize: "0.9rem", fontWeight: "600" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#ea1d2c" }}>Início</Link>
          <Link to="/order" style={{ textDecoration: "none", color: "#717171" }}>Sacola</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/orders-history" style={{ textDecoration: "none", color: "#717171" }}>Pedidos</Link>
              <button onClick={handleLogout} className="auth-button ghost" style={{padding: '0 8px', fontSize: '0.85rem'}}>Sair</button>
            </>
          ) : (
            <Link to="/login" style={{ textDecoration: "none", color: "#717171" }}>Entrar</Link>
          )}
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
    <AuthProvider>
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
                <Route path="/orders-history" element={<OrderHistory />} />
                <Route path="/tracking/:orderId" element={<OrderTrackingWrapper />} />
              </Route>
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;