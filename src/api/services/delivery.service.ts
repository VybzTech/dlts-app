import { ApiResponse, Delivery, PODData } from '../../types';
import { DeliveryStatus } from '../../types/delivery.types';
import axiosInstance from '../config/axios.config';
import { ENDPOINTS } from '../config/endpoints';

export const deliveryService = {
  getDeliveries: async (): Promise<Delivery[]> => {
    // Note: The endpoint in docs/all.json is /schedules/ but the app uses getDeliveries
    // We'll map it to the most appropriate endpoint
    const response = await axiosInstance.get<Delivery[]>(ENDPOINTS.SCHEDULES.LIST);
    return response.data;
  },

  getDeliveryById: async (id: string): Promise<Delivery> => {
    const response = await axiosInstance.get<Delivery>(ENDPOINTS.SCHEDULES.VIEW(id));
    return response.data;
  },

  updateDeliveryStatus: async (
    id: string,
    status: DeliveryStatus,
    notes?: string
  ): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.patch<ApiResponse<null>>(ENDPOINTS.SCHEDULES.UPDATE(id), {
      status,
      notes,
    });
    return response.data;
  },

  submitPOD: async (pod: PODData): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>(ENDPOINTS.COURIER.ACKNOWLEDGE_POD, pod);
    return response.data;
  },
};
