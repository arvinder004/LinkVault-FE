import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000/api' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers['x-auth-token'] = localStorage.getItem('token');
  }
  return req;
});

export const signup = (data) => API.post('/auth/signup', data);
export const signin = (data) => API.post('/auth/signin', data);
export const getLinks = () => API.get('/links');
export const addLink = (data) => API.post('/links', data);
export const deleteLink = (id) => API.delete(`/links/${id}`);
export const generateShare = () => API.post('/share/generate');
export const getSharedLinks = (token) => API.get(`/share/${token}`);