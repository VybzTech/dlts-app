import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { Platform } from "react-native";

// In React Native, localhost can be tricky.
// For Android Emulator, use 10.0.2.2.
// For physical devices or iOS, use the local IP.
const getBaseUrl = () => {
  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to reach host machine
    return "http://192.168.137.1:9989/api/v1";
  }
  // iOS simulator can use localhost
  return "http://192.168.137.1:9989/api/v1";
};

const BASE_URL = getBaseUrl();

const   axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const storageData = await AsyncStorage.getItem("dlts-auth-storage");
      if (storageData) {
        const { state } = JSON.parse(storageData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    } catch (error) {
      console.error("Error fetching token from storage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
