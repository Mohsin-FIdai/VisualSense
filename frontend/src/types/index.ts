export interface Session {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ImageData {
  id: string;
  session_id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  width: number;
  height: number;
  storage_path: string;
  thumbnail_path: string | null;
  exif_data: Record<string, unknown> | null;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface Analysis {
  id: string;
  image_id: string;
  session_id: string;
  scene_summary: string | null;
  status: string;
  error?: string | null;
  objects: string[] | null;
  ocr_text: string | null;
  languages: string[] | null;
  colors: string[] | null;
  faces: { count: number; details: string } | null;
  logos: string[] | null;
  safety: { is_safe: boolean; categories: string[] } | null;
  charts: string | null;
  tables: string | null;
  handwriting: string | null;
  confidence: number | null;
  quality: string | null;
  suggested_questions: string[] | null;
  tokens_used: number | null;
}

export interface ImageMetadata {
  width: number | null;
  height: number | null;
  file_size: number;
  mime_type: string;
  format: string | null;
  exif: Record<string, unknown> | null;
}

export interface UploadResponse {
  session_id: string;
  image_id: string;
  filename: string;
  original_name: string;
  metadata: ImageMetadata;
  analysis: Analysis | null;
}

export interface SessionDetail {
  id: string;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  image: ImageData | null;
  messages: Message[];
  analysis: Analysis | null;
}

export interface InsightCardData {
  icon: string;
  title: string;
  content: unknown;
  confidence?: number;
  variant?: "default" | "success" | "warning" | "info";
}

export interface SSEEvent {
  type: "chunk" | "done" | "error";
  content?: string;
  suggested_questions?: string[];
}
