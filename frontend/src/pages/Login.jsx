import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const user = await login(email, password);

      setMessage(`Bem-vindo, ${user?.name || "cliente"}!`);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      setError(err.message || "Erro ao fazer login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Lado esquerdo - mensagem/marketing */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <span className="auth-pill">🍕 Entrega rápida • 🛵 Tempo real</span>
          <h1>
            Entre na sua conta
            <br />
            e peça seu favorito em poucos cliques.
          </h1>
          <p>
            Acompanhe seus pedidos, repita o que você mais gosta
            e salve seus endereços preferidos.
          </p>
        </div>
      </div>

      {/* Lado direito - card de login */}
      <div className="auth-panel">
        <div className="auth-card">
          <h2>Entrar</h2>
          <p className="auth-subtitle">
            Use seu e-mail e senha cadastrados para continuar.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-feedback auth-error">{error}</div>}
            {message && (
              <div className="auth-feedback auth-success">{message}</div>
            )}

            <button
              className="auth-button primary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="auth-divider">
            <span>ou</span>
          </div>

          <button
            className="auth-button ghost"
            type="button"
            onClick={() => navigate("/register")}
          >
            Criar uma conta
          </button>

          <p className="auth-helper">
            Ao continuar, você concorda com os termos de uso e política de
            privacidade da plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;