import axios from 'axios';

// All MongoDB access stays on the backend. The React app talks only
// to REST endpoints so credentials and business rules stay server-side.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url || '');
    // Login/register 401 means bad credentials — do not hard-redirect the SPA.
    const isCredentialRequest =
      url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isCredentialRequest) {
      localStorage.removeItem('sms_token');
      localStorage.removeItem('sms_user');
      // HashRouter on GitHub Pages: keep the /student-management/ base path.
      const base = import.meta.env.BASE_URL || '/';
      const normalized = base.endsWith('/') ? base : `${base}/`;
      window.location.href = `${normalized}#/login`;
    }
    return Promise.reject(error);
  }
);

export default api;
