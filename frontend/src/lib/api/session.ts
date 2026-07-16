import { apiClient } from "./client";
import type { SessionDetail } from "@/types";

export async function getSession(id: string): Promise<SessionDetail> {
  const response = await apiClient.get<SessionDetail>(`/api/v1/session/${id}`);
  return response.data;
}

export async function deleteSession(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/session/${id}`);
}
