import axios from "axios";
import Cookies from 'js-cookie';
const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`, 
});
console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL); 

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getUserDetails = async () => {
    try {
       
        const token = Cookies.get('authToken'); 
        const response = await api.get('/users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; 
    } catch (error) {
        throw error.response.data;
    }
};


export const updateUserDetails = async (userData) => {
    try {
        const response = await api.put('/users/me', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
