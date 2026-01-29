import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// In React Native, localhost can be tricky. 
// For Android Emulator, use 10.0.2.2.
// For physical devices or iOS, use the local IP.
// But the user specifically said '9989 localhost'.
const BASE_URL = 'http://localhost:9989/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const storageData = await AsyncStorage.getItem('dlts-auth-storage');
      if (storageData) {
        const { state } = JSON.parse(storageData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (error) {
      console.error('Error fetching token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
