export interface VideoMetadata {
  title: string;
  description: string;
  thumbnail: string;
  duration?: string;
  publishedAt?: string;
  videoId?: string;
  url: string;
}

export interface VideoSaveRequest {
  url: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VideoSaveResponse {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  createdAt: string;
}
