const API = "http://127.0.0.1:8000/api/accounts";

// Obtener token desde Zustand persistido
function getToken() {
  try {
    const item = localStorage.getItem("auth-storage");
    if (!item) return null;

    const json = JSON.parse(item);
    return json?.state?.access ?? null;
  } catch (e) {
    return null;
  }
}

// ------------------------------------
// 1) GET USER PROFILE
// ------------------------------------
export async function getUserProfile() {
  const token = getToken();

  const res = await fetch(`${API}/user/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json;
}

// ------------------------------------
// 2) UPDATE USER PROFILE
// ------------------------------------
export async function updateUserProfile(data: {
  first_name: string;
  last_name: string;
}) {
  const token = getToken();

  const res = await fetch(`${API}/user/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json;
}

// ------------------------------------
// 3) CHANGE PASSWORD
// ------------------------------------
export async function changePassword(data: {
  current_password: string;
  new_password: string;
  new_password2: string;
}) {
  const token = getToken();

  const res = await fetch(`${API}/change-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw json;

  return json;
}