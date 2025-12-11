const AUTH_BASE_URL = "http://localhost:3005/api/v1";

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

    return data.user;
  } catch (error) {
    console.error("Erro no Login:", error.message);
    throw error;
  }
}

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