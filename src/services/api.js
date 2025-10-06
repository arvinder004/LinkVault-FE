import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  console.log('API Request:', req.method, req.url);
  if (localStorage.getItem('token')) {
    req.headers['x-auth-token'] = localStorage.getItem('token');
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.message, err.code, err.response?.status);
    return Promise.reject(err);
  }
);

export const getLinks = () => API.get('/links');
export const addLink = (link) => API.post('/links', link);
export const deleteLink = (id) => API.delete(`/links/${id}`);
export const generateShare = () => API.post('/share/generate');
export const getSharedLinks = (token) => API.get(`/share/${token}`);
export const getFolders = () => API.get('/folders');
export const addFolder = (folder) => API.post('/folders', folder);
export const updateFolder = (id, folder) => API.put(`/folders/${id}`, folder);
export const deleteFolder = (id) => API.delete(`/folders/${id}`);

export default API;