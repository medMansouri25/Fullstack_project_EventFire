import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export async function getStats(token) {
  const response = await axios.get(`${API}/api/stats`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
  // Expected shape:
  // {
  //   totalEvents, totalRevenue, totalTickets, occupancyRate,
  //   byCategory: [{ name, value }],
  //   byType:     [{ name, value }],
  //   top5Revenue:    [{ titre, value }],
  //   top5Occupancy:  [{ titre, value }],
  // }
}
