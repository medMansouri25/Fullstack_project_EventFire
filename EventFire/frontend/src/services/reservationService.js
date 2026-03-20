import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function creerReservation(eventId, places, token) {
  const response = await axios.post(`${API}/api/reservations`, { eventId, places }, {
    headers: authHeaders(token),
  });
  return response.data;
}

export async function mesReservations(token) {
  const response = await axios.get(`${API}/api/reservations/me`, {
    headers: authHeaders(token),
  });
  return response.data;
}

export async function annulerReservation(id, token) {
  const response = await axios.delete(`${API}/api/reservations/${id}`, {
    headers: authHeaders(token),
  });
  return response.data;
}
