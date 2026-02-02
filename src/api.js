
import axios from 'axios';

const API = axios.create({
    baseURL: '/api', // Using relative path for Vite proxy
});

export const fetchTransactions = () => API.get('/transactions');
export const createTransaction = (newTransaction) => API.post('/transactions', newTransaction);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);

export const fetchUsers = () => API.get('/users');
export const createUser = (newUser) => API.post('/users', newUser);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Login
export const loginUser = (credentials) => API.post('/users/login', credentials);

// Profile
export const updateProfile = (profileData) => API.put('/users/profile', profileData);

export default API;
