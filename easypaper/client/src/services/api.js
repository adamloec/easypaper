import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

export const getPapers = async ({ search, category }) => {
  try {
    const params = new URLSearchParams();

    if (search?.trim()) {
      params.append('keyword', search.trim());
    }
    
    if (category && category !== '' && category.trim()) {
      params.append('category', category.trim());
    }
    
    const response = await api.get('/papers/search/', { params });
    return response;
  } catch (error) {

    if (error.response?.status === 404) {
      return { data: [] };
    }
    throw error;
  }
};

export const getPaperSummary = async (pdfUrl) => {
  try {
    const response = await api.post('/papers/summarize/', {
      pdf_url: pdfUrl
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Paper not found');
    }
    throw error;
  }
};

export default api;