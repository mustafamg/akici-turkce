export interface Category {
  id: string;
  name: string;
  description?: string;
  videoCount?: number; // Number of videos in this category
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCreateRequest {
  name: string;
  description?: string;
}

export interface CategoryUpdateRequest {
  name: string;
  description?: string;
}

export interface CategoryResponse {
  success: boolean;
  data?: Category | Category[];
  message?: string;
  error?: string;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message?: string;
  error?: string;
}
