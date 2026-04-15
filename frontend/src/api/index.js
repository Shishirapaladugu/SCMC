import axios from 'axios';

// Base URL — in dev, package.json proxy forwards /api → http://localhost:5000
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

// ─── Auth header ──────────────────────────────────────────────────────────────
// Your backend reads:  req.headers.token  (NOT Authorization: Bearer)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['token'] = token;
  return config;
});

// ─── Global error handler ─────────────────────────────────────────────────────
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ══════════════════════════════════════════════════════════════════════════════
// AUTH   →  /api/auth/*
// ══════════════════════════════════════════════════════════════════════════════
export const authAPI = {
  // POST /api/auth/signup
  // body: { fullName, email, password, address }
  // response: { success, userData, token, message }
  signup: (data) => API.post('/auth/signup', data),

  // POST /api/auth/login
  // body: { email, password }
  // response: { success, userData, token, message }
  login: (data) => API.post('/auth/login', data),

  // GET /api/auth/check   (protected — sends token header)
  // response: { success, user }
  checkAuth: () => API.get('/auth/check'),

  // PUT /api/auth/update-profile  (protected)
  // body: { fullName, address, profilePic? }
  updateProfile: (data) => API.put('/auth/update-profile', data),
};

// ══════════════════════════════════════════════════════════════════════════════
// COMPLAINTS   →  /api/complaints/*
// ══════════════════════════════════════════════════════════════════════════════
export const complaintsAPI = {
  // POST /api/complaints/submit  (protected)
  // body JSON: { city, state, address, image }
  //   image = base64 string e.g. "data:image/jpeg;base64,..."
  // response: { message, complaint }
  submit: (data) => API.post('/complaints/submit', data),

  // GET /api/complaints/all  (protected)
  // response: [ ...complaints populated with user.email ]
  getAll: () => API.get('/complaints/all'),

  // GET /api/complaints/my  (protected)
  // response: [ ...complaints ]
  getMine: () => API.get('/complaints/my'),

  // PATCH /api/complaints/:id/status  (protected)
  // body: { status }  →  'New' | 'In Progress' | 'Resolved'
  // response: { message, complaint }
  updateStatus: (id, status) => API.patch(`/complaints/${id}/status`, { status }),
};

export default API;
