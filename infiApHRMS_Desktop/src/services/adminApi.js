import api from '../utils/axios';

export const getAdminProfile = () => api.get('/admin-dashboard/profile');

export const updateAdminProfile = (profileData) => api.patch('/admin-dashboard/profile', profileData);

export default {
  getAdminProfile,
  updateAdminProfile,
};