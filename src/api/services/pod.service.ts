import { ApiResponse, PODData } from '../../types';
import axiosInstance from '../config/axios.config';
import { ENDPOINTS } from '../config/endpoints';

export const podService = {
  submitPOD: async (pod: PODData): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post<ApiResponse<null>>(ENDPOINTS.COURIER.ACKNOWLEDGE_POD, pod);
    return response.data;
  },
};
