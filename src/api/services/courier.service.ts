import axiosInstance from "../config/axios.config";
import { ENDPOINTS } from "../config/endpoints";
import { User } from "@/src/types";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  couriers?: T;
  courier?: T;
}

export const courierService = {
  getCouriers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>(
      ENDPOINTS.COURIER.LIST,
    );
    return response.data.couriers || [];
  },

  getCourierById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>(
      ENDPOINTS.COURIER.VIEW(id),
    );
    if (!response.data.courier) throw new Error("Courier not found");
    return response.data.courier;
  },

  updateAvailability: async (
    id: string,
    availability: boolean,
  ): Promise<any> => {
    const response = await axiosInstance.patch(
      `${ENDPOINTS.COURIER.VIEW(id)}/availability`,
      { availability },
    );
    return response.data;
  },
};
