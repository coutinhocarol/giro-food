import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
      setMessage("Conta criada com sucesso! Redirecionando para o login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message || "Erro ao criar conta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Lado esquerdo - mensagem/marketing */}
      <div className="auth-hero auth-hero-register">
        <div className="auth-hero-content">
          <span className="auth-pill">✨ Primeiro acesso</span>
          <h1>
            Crie sua conta
            <br />
            e nunca mais decida o jantar sozinho.
          </h1>
          <p>
            Guarde seus restaurantes favoritos, acompanhe suas entregas
            e tenha tudo na palma da mão.
          </p>
        </div>
      </div>

      {/* Lado direito - card de registro */}
      <div className="auth-panel">
        <div className="auth-card">
          <h2>Criar conta</h2>
          <p className="auth-subtitle">
            Preencha seus dados para começar a fazer pedidos.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="name">Nome completo</label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="auth-helper center">
            Já tem uma conta?{" "}
            <Link to="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;