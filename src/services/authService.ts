const API = "http://127.0.0.1:8000/api";

export async function register(email: string, password: string) {
  const res = await fetch(`${API}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json(); // recibes token u objeto user
}
