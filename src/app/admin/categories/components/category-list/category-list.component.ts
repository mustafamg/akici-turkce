import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Category, CategoryUpdateRequest } from '../../models/category.interface';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
<div class="category-list-container">
  <div class="list-header">
    <h2>Categories</h2>
  </div>

  <div *ngIf="isLoading" class="loading-indicator">
    Loading...
  </div>

  <table *ngIf="!isLoading && categories && categories.length > 0" class="category-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let category of categories">
        <td *ngIf="!isEditing(category.id)">{{ category.name }}</td>
        <td *ngIf="isEditing(category.id) && editForms[category.id]">
          <input type="text" [formControl]="getNameControl(category.id)" />
          <div *ngIf="getNameControl(category.id)?.invalid && getNameControl(category.id)?.touched" class="error-message">
            Category name is required and must be at least 2 characters.
          </div>
        </td>

        <td *ngIf="!isEditing(category.id)">{{ category.description || '-' }}</td>
        <td *ngIf="isEditing(category.id) && editForms[category.id]">
          <input type="text" [formControl]="getDescriptionControl(category.id)" />
          <div *ngIf="getDescriptionControl(category.id)?.invalid && getDescriptionControl(category.id)?.touched" class="error-message">
            Description cannot exceed 200 characters.
          </div>
        </td>



        <td>
          <button *ngIf="!isEditing(category.id)" (click)="startEdit(category)">Edit</button>
          <button *ngIf="isEditing(category.id)" (click)="saveEdit(category)" [disabled]="editForms[category.id].invalid || isSaving[category.id]">
            {{ isSaving[category.id] ? 'Saving...' : 'Save' }}
          </button>
          <button *ngIf="isEditing(category.id)" (click)="cancelEdit(category)">Cancel</button>
          <button (click)="confirmDelete(category)">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <div *ngIf="!isLoading && (!categories || categories.length === 0)" class="no-categories">
    No categories found.
  </div>

  <!-- Delete Confirmation Modal -->
  <div *ngIf="deleteConfirmCategory" class="modal-overlay">
    <div class="modal-content">
      <h3>Delete Confirmation</h3>
      <p>Are you sure you want to delete the "{{ deleteConfirmCategory.name }}" category?</p>
      <div class="modal-actions">
        <button (click)="deleteCategoryConfirmed()" [disabled]="isDeleting">Yes, Delete</button>
        <button (click)="cancelDelete()" [disabled]="isDeleting">Cancel</button>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
.category-list-container {
  padding: 1rem;
  max-width: 100%;
  overflow-x: auto;
}

.list-header {
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.25rem;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
}

.category-table th, .category-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.category-table th {
  background-color: #f3f4f6;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

button {
  margin-right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  background-color: #C41E3A;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.no-categories {
  font-style: italic;
  color: #6b7280;
  margin-top: 1rem;
}

.loading-indicator {
  font-style: italic;
  color: #6b7280;
  margin-top: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
  `]
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
  @Input() isLoading = false;
  @Output() editCategory = new EventEmitter<Category>();
  @Output() updateCategory = new EventEmitter<{ category: Category; updatedData: CategoryUpdateRequest }>();
  @Output() deleteCategory = new EventEmitter<Category>();

  editForms: { [key: string]: FormGroup } = {};
  editingIds: Set<string> = new Set();
  isSaving: { [key: string]: boolean } = {};
  isDeleting = false;
  deleteConfirmCategory: Category | null = null;

  constructor(private fb: FormBuilder) {}

  isEditing(id: string): boolean {
    return this.editingIds.has(id);
  }

  startEdit(category: Category): void {
    this.editingIds.add(category.id);
    this.editForms[category.id] = this.fb.group({
      name: [category.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: [category.description || '', [Validators.maxLength(200)]]
    });
  }

  cancelEdit(category: Category): void {
    this.editingIds.delete(category.id);
    delete this.editForms[category.id];
  }

  saveEdit(category: Category): void {
    const form = this.editForms[category.id];
    if (!form || form.invalid) {
      return;
    }
    this.isSaving[category.id] = true;
    const updatedData: CategoryUpdateRequest = {
      name: this.getNameControl(category.id)?.value?.trim(),
      description: this.getDescriptionControl(category.id)?.value?.trim() || undefined
    };
    this.updateCategory.emit({ category, updatedData });
  }

  confirmDelete(category: Category): void {
    this.deleteConfirmCategory = category;
  }

  deleteCategoryConfirmed(): void {
    if (!this.deleteConfirmCategory) {
      return;
    }
    this.isDeleting = true;
    this.deleteCategory.emit(this.deleteConfirmCategory);
  }

  cancelDelete(): void {
    this.deleteConfirmCategory = null;
    this.isDeleting = false;
  }

  getNameControl(categoryId: string): any {
    return this.editForms[categoryId]?.controls['name'];
  }

  getDescriptionControl(categoryId: string): any {
    return this.editForms[categoryId]?.controls['description'];
  }
}
