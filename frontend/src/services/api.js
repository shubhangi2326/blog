import axios from 'axios';

const API = axios.create({
    baseURL: 'https://blog-backend-shubhangi.onrender.com/api',
});

export default API;