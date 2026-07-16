import { apiClient } from "./client";
import type { Analysis } from "@/types";

export async function getAnalysis(sessionId: string): Promise<Analysis | null> {
  try {
    const response = await apiClient.get<Analysis>(
      `/api/v1/session/${sessionId}`
    );
    // Analysis is nested in the session detail response
    return (response.data as unknown as { analysis: Analysis | null }).analysis;
  } catch {
    return null;
  }
}
