// simple session helpers (localStorage)
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("mr_user")); } catch { return null; }
};
export const setUser = (u) => localStorage.setItem("mr_user", JSON.stringify(u));
export const clearUser = () => localStorage.removeItem("mr_user");
export const isAdmin = () => getUser()?.role === "admin";
