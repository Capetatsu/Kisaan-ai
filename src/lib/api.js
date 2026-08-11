// API client for the Kisaan AI backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getToken = () => {
  return localStorage.getItem('kisaan_token') || localStorage.getItem('base44_access_token') || localStorage.getItem('token') || '';
};

const buildError = (detail) => {
  if (Array.isArray(detail)) {
    // FastAPI 422 validation error: detail is an array of { loc, msg }
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc)
          ? item.loc.filter((p) => p !== 'body').join('.')
          : '';
        const label = field ? `${field}: ` : '';
        return `${label}${item.msg || 'Invalid value'}`;
      })
      .join('. ');
  }
  if (typeof detail === 'string') {
    return detail;
  }
  return 'Something went wrong. Please try again.';
};

const clearStoredToken = () => {
  localStorage.removeItem('kisaan_token');
  localStorage.removeItem('base44_access_token');
  localStorage.removeItem('token');
};

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (e) {
    throw new Error('Network error. Check your internet connection and try again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const err = new Error(buildError(error.detail) || `Request failed: ${response.status}`);
    err.status = response.status;

    if (response.status === 401 && !path.startsWith('/auth/')) {
      clearStoredToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      err.message = 'Your session has expired. Please log in again.';
    }

    throw err;
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const api = {
  // Auth
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/users/me'),
  resetPasswordRequest: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: ({ resetToken, newPassword }) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token: resetToken, password: newPassword }) }),

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
  getWeather: (lat, lon) => request(`/insights/weather${lat !== undefined && lat !== null && lon !== undefined && lon !== null ? `?latitude=${lat}&longitude=${lon}` : ''}`),
  getMarketPrices: () => request('/insights/market/prices'),
  getNearbyMandi: () => request('/insights/market/mandi'),
};