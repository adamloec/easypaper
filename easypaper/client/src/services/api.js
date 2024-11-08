import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const searchPapers = async ({ search, category }) => {
  const params = new URLSearchParams();
  params.append('keyword', search);
  if (category) {
    params.append('category', category);
  }
  
  return api.get('/papers/search/', { params });
};

export default api;