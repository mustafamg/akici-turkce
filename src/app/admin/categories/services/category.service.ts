import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryResponse,
  DeleteCategoryResponse
} from '../models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly apiUrl = '/api/categories';

  constructor(private http: HttpClient) {}

  /**
   * Get all categories
   */
  getCategories(): Observable<Category[]> {
    // Return one dummy category for demo/testing
    const categories: Category[] = [
      {
        id: '1',
        name: 'Sample Category',
        description: 'This is a sample category for demo purposes',
        videoCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return of(categories).pipe(delay(300));

    // Real implementation:
    /*
    return this.http.get<CategoryResponse>(this.apiUrl)
      .pipe(
        map(response => response.data as Category[]),
        catchError(this.handleError)
      );
    */
  }

  /**
   * Create new category
   */
  createCategory(categoryData: CategoryCreateRequest): Observable<Category> {
    // Mock implementation
    const newCategory: Category = {
      id: 'cat-' + Date.now(),
      name: categoryData.name,
      description: categoryData.description,
      videoCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return of(newCategory).pipe(delay(500));

    // Real implementation:
    /*
    return this.http.post<CategoryResponse>(this.apiUrl, categoryData)
      .pipe(
        map(response => response.data as Category),
        catchError(this.handleError)
      );
    */
  }

  /**
   * Update existing category
   */
  updateCategory(id: string, categoryData: CategoryUpdateRequest): Observable<Category> {
    // Mock implementation
    const updatedCategory: Category = {
      id: id,
      name: categoryData.name,
      description: categoryData.description,
      videoCount: Math.floor(Math.random() * 20),
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: new Date().toISOString()
    };

    return of(updatedCategory).pipe(delay(500));

    // Real implementation:
    /*
    return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, categoryData)
      .pipe(
        map(response => response.data as Category),
        catchError(this.handleError)
      );
    */
  }

  /**
   * Delete category
   */
  deleteCategory(id: string): Observable<DeleteCategoryResponse> {
    // Mock implementation - simulate different scenarios
    const scenarios = [
      { success: true, message: 'Category deleted successfully' },
      { success: false, error: 'This category cannot be deleted because it is still linked to videos' }
    ];

    const response = scenarios[0]; // Always success for demo
    return of(response).pipe(delay(500));

    // Real implementation:
    /*
    return this.http.delete<DeleteCategoryResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
    */
  }

  /**
   * Check if category name already exists
   */
  checkCategoryNameExists(name: string, excludeId?: string): Observable<boolean> {
    // Mock implementation
    const existingNames = ['Basic Level', 'Intermediate Level', 'Advanced Level'];
    const exists = existingNames.some(existingName =>
      existingName.toLowerCase() === name.toLowerCase()
    );

    return of(exists).pipe(delay(300));

    // Real implementation:
    /*
    const params = excludeId ? { name, excludeId } : { name };
    return this.http.get<{exists: boolean}>(`${this.apiUrl}/check-name`, { params })
      .pipe(
        map(response => response.exists),
        catchError(() => of(false))
      );
    */
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Invalid request';
          break;
        case 404:
          errorMessage = 'Category not found';
          break;
        case 409:
          errorMessage = 'This category name is already taken';
          break;
        case 422:
          errorMessage = 'This category cannot be deleted because it is still linked to videos';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later';
          break;
        default:
          errorMessage = error.error?.message || `Server error (${error.status})`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
