import axios from 'axios';

// Prefer explicit API URL from env, fallback to relative '/api'
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
