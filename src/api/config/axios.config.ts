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

export const BASE_URL = getBaseUrl();
export const getFullImageUrl = (path: string | undefined) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  // Backend serves uploads at /uploads
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  // If the path already includes 'uploads/', we don't need to add it again
  // but looking at express.static('uploads'), if the path is 'uploads/pod/xyz.jpg',
  // it would be available at BASE_URL_HOST/uploads/pod/xyz.jpg
  const host = BASE_URL.replace("/api/v1", "");
  return `${host}/${cleanPath}`;
};

const axiosInstance = axios.create({
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
