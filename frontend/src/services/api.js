
import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' })
api.interceptors.request.use(cfg => { const t=localStorage.getItem('token'); if(t) cfg.headers.Authorization = `Bearer ${t}`; return cfg })
// Public
export const getCategories = () => api.get('/api/categories')
export const getCourses = (params={}) => api.get('/api/courses', { params })
export const getCourseById = (id) => api.get(`/api/courses/${id}`)
// Auth
export const signup = (payload) => api.post('/api/auth/signup', payload)
export const login = (payload) => api.post('/api/auth/login', payload)
export const profile = () => api.get('/api/auth/profile')
// Protected
export const getExams = (params={}) => api.get('/api/exams', { params })
export const getExamById = (id) => api.get(`/api/exams/${id}`)
export const submitExam = (id, answers) => api.post(`/api/exams/${id}/submit`, { answers })
export const getPracticePapers = (params={}) => api.get('/api/practice-papers', { params })
export const getPracticeById = (id) => api.get(`/api/practice-papers/${id}`)
export const submitPractice = (id, answers) => api.post(`/api/practice-papers/${id}/submit`, { answers })
export const askAI = (payload) => api.post('/api/ask-ai', payload)
export default api
