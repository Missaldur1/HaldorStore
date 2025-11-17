const API = "http://127.0.0.1:8000/api/accounts";

// ---------- REGISTRO ----------
export async function register(data: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
}) {
  const res = await fetch(`${API}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    throw json; // errores del backend
  }

  return json; // user + tokens
}

// ---------- LOGIN ----------
export async function login(email: string, password: string) {
  const res = await fetch(`${API}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw json;
  }

  return json; // tokens
}

// ---------- LOGOUT ----------
export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}
