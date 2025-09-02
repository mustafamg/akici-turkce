import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from './services/category.service';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from './models/category.interface';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent, CategoryListComponent],
  template: `
<div class="categories-page">
  <div class="page-header">
    <h1>📚 Category Management</h1>
    <p>Create and manage categories to organize your videos</p>
  </div>

  <div class="content-layout">
    <!-- Add Category Form -->
    <div class="form-section">
      <app-category-form
        [isLoading]="isSubmitting"
        (categorySubmit)="onCategoryCreate($event)"
        (validationError)="onValidationError($event)">
      </app-category-form>
    </div>

    <!-- Categories List -->
    <div class="list-section">
      <app-category-list
        [categories]="categories"
        [isLoading]="isLoadingCategories"
        (editCategory)="onEditCategory($event)"
        (deleteCategory)="onDeleteCategory($event)"
        (updateCategory)="onCategoryUpdate($event)">
      </app-category-list>
    </div>
  </div>
</div>
  `,
  styles: [`
.categories-page {
  min-height: calc(100vh - 200px);
  background: #f9fafb;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

.content-layout {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 1fr;
  }
}

.form-section, .list-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Fade in animation */
.content-layout {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  isLoadingCategories = false;
  isSubmitting = false;

  constructor(
    private categoryService: CategoryService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoadingCategories = false;
      },
      error: (error) => {
        this.notificationService.error('Kategoriler Yüklenemedi', 'Kategoriler yüklenirken hata oluştu: ' + error.message);
        this.isLoadingCategories = false;
      }
    });
  }

  onCategoryCreate(categoryData: CategoryCreateRequest) {
    this.isSubmitting = true;

    this.categoryService.createCategory(categoryData).subscribe({
      next: (newCategory) => {
        this.categories.unshift(newCategory);
        this.notificationService.success('Category Created', 'Category created successfully!');
        this.isSubmitting = false;
      },
      error: (error) => {
        this.notificationService.error('Category Creation Failed', 'Error creating category: ' + error.message);
        this.isSubmitting = false;
      }
    });
  }

  onCategoryUpdate(data: { category: Category; updatedData: CategoryUpdateRequest }) {
    this.categoryService.updateCategory(data.category.id, data.updatedData).subscribe({
      next: (updatedCategory) => {
        const index = this.categories.findIndex(c => c.id === updatedCategory.id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
        this.notificationService.success('Category Updated', 'Category updated successfully!');
      },
      error: (error) => {
        this.notificationService.error('Category Update Failed', 'Error updating category: ' + error.message);
      }
    });
  }

  onEditCategory(category: Category) {
    // This will be handled by the list component's edit functionality
    console.log('Editing category:', category);
  }

  onDeleteCategory(category: Category) {
    this.categoryService.deleteCategory(category.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.notificationService.success('Category Deleted', response.message || 'Category deleted successfully!');
        } else {
          this.notificationService.error('Category Deletion Failed', response.error || 'Category could not be deleted');
        }
      },
      error: (error) => {
        this.notificationService.error('Category Deletion Failed', 'Error deleting category: ' + error.message);
      }
    });
  }

  onValidationError(error: string) {
    this.notificationService.warning('Form Error', error);
  }
}
