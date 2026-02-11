import {
  Letter,
  LetterActionPayload,
  LetterListResponse,
  LetterStatus,
} from "../../types/letter.types";
import axiosInstance from "../config/axios.config";
import { ENDPOINTS } from "../config/endpoints";

export const letterService = {
  // Get all letters for courier (with pagination and filters)
  getLetters: async (
    page: number = 1,
    limit: number = 20,
    status?: LetterStatus,
  ): Promise<LetterListResponse> => {
    const params: any = {
      page,
      limit,
    };
    if (status) {
      params.status = status;
    }
    const response = await axiosInstance.get<LetterListResponse>(
      ENDPOINTS.LETTERS.LIST,
      { params },
    );
    return response.data;
  },

  // Get single letter by ID
  getLetterById: async (id: string): Promise<Letter> => {
    const response = await axiosInstance.get<Letter>(
      ENDPOINTS.LETTERS.VIEW(id),
    );
    return response.data;
  },

  // Mark letter as in-transit
  markInTransit: async (id: string): Promise<Letter> => {
    const response = await axiosInstance.patch<Letter>(
      ENDPOINTS.LETTERS.IN_TRANSIT(id),
    );
    return response.data;
  },

  // Mark letter as delivered with POD
  markDelivered: async (
    id: string,
    payload: LetterActionPayload,
  ): Promise<Letter> => {
    const formData = new FormData();
    if (payload.recipientName) {
      formData.append("recipientName", payload.recipientName);
    }
    if (payload.notes) {
      formData.append("notes", payload.notes);
    }
    if (payload.podImage) {
      // Convert base64 to blob
      const byteString = atob(payload.podImage.split(",")[1]);
      const mimeString = payload.podImage.split(",")[0].match(/:(.*?);/)[1];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      formData.append("pod_image", blob, "pod.jpg");
    }

    const response = await axiosInstance.patch<Letter>(
      ENDPOINTS.LETTERS.DELIVERED(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  // Mark letter as undelivered with reason
  markUndelivered: async (
    id: string,
    payload: LetterActionPayload,
  ): Promise<Letter> => {
    const response = await axiosInstance.patch<Letter>(
      ENDPOINTS.LETTERS.UNDELIVERED(id),
      {
        reason: payload.reason,
      },
    );
    return response.data;
  },
};
