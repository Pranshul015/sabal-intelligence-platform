import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sabal-setu-api-final.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('sabal_setu_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('sabal_setu_token');
            localStorage.removeItem('sabal_setu_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: { email: string; password: string; fullName: string; phone?: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.put('/auth/change-password', data),
    deleteAccount: () => api.delete('/auth/account'),
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data: any) => api.put('/users/profile', data),
    getEligibleSchemes: () => api.get('/users/eligible-schemes'),
};

// Schemes API
export const schemesAPI = {
    getAll: (params?: { search?: string; category?: string; state?: string; ministry?: string; page?: number; limit?: number }) =>
        api.get('/schemes', { params }),
    getById: (id: string) => api.get(`/schemes/${id}`),
};

// Applications API
export const applicationsAPI = {
    create: (data: { schemeId: string; notes?: string }) =>
        api.post('/applications', data),
    getAll: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/applications', { params }),
    getById: (id: string) => api.get(`/applications/${id}`),
    trackByRef: (referenceNumber: string) =>
        api.get(`/applications/track/${referenceNumber}`),
};

// Complaints API
export const complaintsAPI = {
    create: (data: { applicationId?: string; schemeId?: string; category: string; subject: string; description: string; priority?: string }) =>
        api.post('/complaints', data),
    getAll: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/complaints', { params }),
    getById: (id: string) => api.get(`/complaints/${id}`),
};

// Documents API
export const documentsAPI = {
    upload: (file: File, category: string) => {
        const formData = new FormData();
        formData.append('document', file);
        formData.append('category', category);
        return api.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getAll: () => api.get('/documents'),
    confirm: (id: string, data: { extractedData: any; autoUpdateProfile?: boolean }) =>
        api.put(`/documents/${id}/confirm`, data),
    delete: (id: string) => api.delete(`/documents/${id}`),
};

export default api;
