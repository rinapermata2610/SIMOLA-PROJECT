import api from "./api";

export async function login(username, password) {
  const response = await api.post("/auth/login", { username, password });
  const { token, user } = response.data;
  localStorage.setItem("simola_token", token);
  localStorage.setItem("simola_user", JSON.stringify(user));
  return user;
}

export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // token mungkin sudah invalid — tetap lanjut bersihkan sisi client
  }
  localStorage.removeItem("simola_token");
  localStorage.removeItem("simola_user");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("simola_user");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("simola_token");
}
