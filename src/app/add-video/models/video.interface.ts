export interface VideoMetadata {
  title: string;
  description: string;
  thumbnail: string;
  duration?: string;
  publishedAt?: string;
  videoId?: string;
  url: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface VideoSaveRequest {
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
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
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}
