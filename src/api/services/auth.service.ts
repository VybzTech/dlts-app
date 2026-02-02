import { LoginResponse } from "../../types";
import axiosInstance from "../config/axios.config";
import { ENDPOINTS } from "../config/endpoints";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log(axiosInstance.name, email, password, ENDPOINTS.AUTH.LOGIN);
    const response = await axiosInstance.post<LoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      {
        email,
        password,
      },
    );
    return response.data;
  },

  signup: async (userData: any): Promise<any> => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.SIGNUP, userData);
    return response.data;
  },
};
