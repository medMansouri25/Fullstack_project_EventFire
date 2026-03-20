import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getEvents({ search = '', category = '', type = '' } = {}) {
  const params = {};
  if (search)   params.search   = search;
  if (category) params.category = category;
  if (type)     params.type     = type;
  const response = await axios.get(`${API}/api/events`, { params });
  return response.data;
}

export async function getEventById(id) {
  const response = await axios.get(`${API}/api/events/${id}`);
  return response.data;
}

export async function createEvent(data, token) {
  const response = await axios.post(`${API}/api/events`, data, {
    headers: authHeaders(token),
  });
  return response.data;
}

export async function updateEvent(id, data, token) {
  const response = await axios.put(`${API}/api/events/${id}`, data, {
    headers: authHeaders(token),
  });
  return response.data;
}

export async function deleteEvent(id, token) {
  const response = await axios.delete(`${API}/api/events/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
}
