import apiClient from "./apiClient";

export interface Paste {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export interface CreatePasteData {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export interface CreatePasteResponse {
  id: string;
  url: string;
}

export const createPaste = async (pasteData: CreatePasteData): Promise<CreatePasteResponse> => {
  try {
    const response = await apiClient.post("/pastes", pasteData);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

export const getPasteById = async (id: string): Promise<Paste> => {
  try {
    const response = await apiClient.get(`/pastes/${id}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await apiClient.get("/healthz");
    return response.data;
  } catch (error: any) {
    return { ok: false };
  }
};