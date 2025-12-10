const AUTH_BASE_URL = "http://localhost:3005/api/v1";

/**
 * Login do usuário no microsserviço de Autenticação.
 * Espera que o backend responda com algo como:
 * { token: "...", user: { ... } }
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Falha na autenticação.");
    }

    if (data.token) {
      localStorage.setItem("userToken", data.token);
    }

    return data.user; // pode ajustar conforme o backend
  } catch (error) {
    console.error("Erro no Login:", error.message);
    throw error;
  }
}

/**
 * Registro de novo usuário no microsserviço de Autenticação.
 * Ajuste os campos (name, email, password) se o backend usar outro nome.
 */
export async function register(name, email, password) {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Falha no registro.");
    }

    // Se o backend também já devolver token no registro:
    if (data.token) {
      localStorage.setItem("userToken", data.token);
    }

    return data.user || { name, email };
  } catch (error) {
    console.error("Erro no Registro:", error.message);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("userToken");
}

export function getToken() {
  return localStorage.getItem("userToken");
}

export function getAuthHeaders() {
  const token = getToken();
  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  return { "Content-Type": "application/json" };
}