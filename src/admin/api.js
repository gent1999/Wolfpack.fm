const API_URL = import.meta.env.VITE_API_URL;
export const TOKEN_KEY = 'wolfpack_admin_token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private browsing, disabled cookies/storage) --
    // the session simply won't persist across reloads.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // See setToken.
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || 'Something went wrong');
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => request('/api/auth/me'),

  listArticles: () => request('/api/admin/articles'),
  getArticle: (id) => request(`/api/admin/articles/${id}`),
  createArticle: (data) => request('/api/admin/articles', { method: 'POST', body: data }),
  updateArticle: (id, data) => request(`/api/admin/articles/${id}`, { method: 'PUT', body: data }),
  deleteArticle: (id) => request(`/api/admin/articles/${id}`, { method: 'DELETE' }),
};
