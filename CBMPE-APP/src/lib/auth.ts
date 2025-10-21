// src/lib/auth.ts
export const getToken = () => localStorage.getItem('authToken');
export const getUser = () => {
  const u = localStorage.getItem('authUser');
  return u ? JSON.parse(u) : null;
};
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
};

// authFetch simples (usa token se existir)
export const authFetch = async (input: RequestInfo, init: RequestInit = {}) => {
  const token = getToken();
  const headers = new Headers(init.headers ?? {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  return res;
};

// authFetch que trata 401 e executa callback de logout
export const authFetchWithAutoLogout = async (
  input: RequestInfo,
  init: RequestInit = {},
  onLogout?: () => void
) => {
  const res = await authFetch(input, init);
  if (res.status === 401) {
    // token inválido/expirado -> efetua logout local
    if (onLogout) onLogout();
  }
  return res;
};
