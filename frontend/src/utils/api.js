import axios from 'axios';

// Use relative base URL so it works in dev (proxied by Vite)
// and in production behind the same origin
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export default api;
