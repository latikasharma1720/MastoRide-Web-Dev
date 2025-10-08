const ADMIN_EMAIL = "admin@mastoride.edu";
const ADMIN_PASSWORD = "Admin#123"; // temp demo only

export function loginAdmin(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("mastoride_admin", JSON.stringify({ email }));
    return { ok: true };
  }
  return { ok: false, error: "Invalid admin credentials." };
}

export function logoutAdmin() {
  localStorage.removeItem("mastoride_admin");
}

export function isAdminLoggedIn() {
  return !!localStorage.getItem("mastoride_admin");
}

export function getAdmin() {
  const raw = localStorage.getItem("mastoride_admin");
  return raw ? JSON.parse(raw) : null;
}
