// API client for the Kisaan AI backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getToken = () => {
  return localStorage.getItem('kisaan_token') || localStorage.getItem('base44_access_token') || localStorage.getItem('token') || '';
};

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/users/me'),

  // Farms
  getFarms: () => request('/farms'),
  getFarm: (id) => request(`/farms/${id}`),
  createFarm: (data) => request('/farms', { method: 'POST', body: JSON.stringify(data) }),
  updateFarm: (id, data) => request(`/farms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteFarm: (id) => request(`/farms/${id}`, { method: 'DELETE' }),

  // Crops
  getCrops: (farmId) => request(`/farms/${farmId}/crops`),
  getCrop: (farmId, cropId) => request(`/farms/${farmId}/crops/${cropId}`),
  createCrop: (farmId, data) => request(`/farms/${farmId}/crops`, { method: 'POST', body: JSON.stringify(data) }),
  updateCrop: (farmId, cropId, data) => request(`/farms/${farmId}/crops/${cropId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCrop: (farmId, cropId) => request(`/farms/${farmId}/crops/${cropId}`, { method: 'DELETE' }),

  // Insights
  askAI: (data) => request('/insights/ai/ask', { method: 'POST', body: JSON.stringify(data) }),
  getWeather: (lat, lon) => request(`/insights/weather${lat && lon ? `?latitude=${lat}&longitude=${lon}` : ''}`),
  getMarketPrices: () => request('/insights/market/prices'),
  getNearbyMandi: () => request('/insights/market/mandi'),
};