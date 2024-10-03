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
        console.error("Registration error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Registration failed" };
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials,{ withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Login failed" };
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
        console.error("Get User Details error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to get user details" };
    }
};

export const updateUserDetails = async (userData) => {
    try {
        const token = Cookies.get('authToken'); 
        const response = await api.put('/users/me', userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Update User Details error:", error.response?.data || error.message);
        throw error.response?.data || { message: "Failed to update user details" };
    }
};
