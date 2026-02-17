import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'https://smart-placement-system-4.onrender.com/api';
const API_URL = 'https://smart-placement-system-4.onrender.com/api';
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const register = (userData) => api.post('/register/', userData);
export const login = (credentials) => api.post('/login/', credentials);
export const getCurrentUser = () => api.get('/me/');

// Student APIs
export const getStudentProfile = (page = 1) => api.get(`/students/?page=${page}`);
export const updateStudentProfile = (data) => api.patch('/students/', data);
export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append('profile_photo', file);
  return api.post('/students/upload_photo/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/students/upload_resume/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Company Drive APIs
export const getDrives = () => api.get('/drives/');
export const getActiveDrives = () => api.get('/drives/?status=active');
export const createDrive = (driveData) => api.post('/drives/', driveData);
export const updateDrive = (id, data) => api.patch(`/drives/${id}/`, data);
export const deleteDrive = (id) => api.delete(`/drives/${id}/`);

// Application APIs
export const getApplications = () => api.get('/applications/');
export const getMyApplications = () => api.get('/applications/');
export const applyForDrive = (driveId) => api.post('/applications/', { drive: driveId });
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}/`, { status });

// Dashboard APIs
export const getStudentDashboard = () => api.get('/dashboard/student/');
export const getOfficerDashboard = () => api.get('/dashboard/officer/');

export default api;

// Filtering helpers for ManageStudents
export const filterStudentsByCGPA = (minCgpa) => api.get(`/students/?min_cgpa=${minCgpa}`);
export const filterStudentsBySkills = (skills = []) => {
  const skillsParam = Array.isArray(skills) ? skills.join(',') : skills;
  return api.get(`/students/?skills=${encodeURIComponent(skillsParam)}`);
};