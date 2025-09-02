import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { CategoryCreateRequest } from '../../models/category.interface';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
<div class="category-form-container">
  <div class="form-header">
    <h2>➕ Add New Category</h2>
    <p>Create a new category for your video collection</p>
  </div>

  <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="category-form">
    <!-- Category Name -->
    <div class="form-group">
      <label for="name" class="form-label">
        Category Name <span class="required">*</span>
      </label>
      <input
        type="text"
        id="name"
        formControlName="name"
        class="form-input"
        [class.error]="nameControl?.invalid && nameControl?.touched"
        placeholder="Enter category name"
        maxlength="50">

      <!-- Name Validation Errors -->
      <div *ngIf="nameControl?.invalid && nameControl?.touched" class="error-messages">
        <div *ngIf="nameControl?.hasError('required')" class="error-message">
          Category name is required
        </div>
        <div *ngIf="nameControl?.hasError('minlength')" class="error-message">
          Category name must be at least 2 characters
        </div>
        <div *ngIf="nameControl?.hasError('maxlength')" class="error-message">
          Category name cannot exceed 50 characters
        </div>
        <div *ngIf="nameControl?.hasError('nameExists')" class="error-message">
          This category name is already taken
        </div>
      </div>

      <!-- Name checking indicator -->
      <div *ngIf="isCheckingName" class="checking-indicator">
        <span class="spinner"></span>
        <span>Checking category name...</span>
      </div>
    </div>

    <!-- Category Description -->
    <div class="form-group">
      <label for="description" class="form-label">
        Description <span class="optional">(Optional)</span>
      </label>
      <textarea
        id="description"
        formControlName="description"
        class="form-textarea"
        rows="3"
        placeholder="Enter a brief description of the category"
        maxlength="200"></textarea>

      <div class="char-counter">
        {{ descriptionControl?.value?.length || 0 }}/200
      </div>
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="submit-btn"
      [disabled]="categoryForm.invalid || isLoading || isCheckingName">
      <span *ngIf="isLoading" class="loading-spinner"></span>
      <span *ngIf="!isLoading">✨ Create Category</span>
      <span *ngIf="isLoading">Creating...</span>
    </button>
  </form>
</div>
  `,
  styles: [`
.category-form-container {
  padding: 2rem;
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.category-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.required {
  color: #C41E3A;
}

.optional {
  color: #9ca3af;
  font-weight: 400;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  font-family: inherit;
  background: #fafafa;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #C41E3A;
  background: white;
  box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
}

.form-input.error, .form-textarea.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.error-messages {
  margin-top: 0.5rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message::before {
  content: "⚠️";
  font-size: 0.8rem;
}

.checking-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #C41E3A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.submit-btn {
  width: 100%;
  background: #C41E3A;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(196, 30, 58, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background: #9e1730;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(196, 30, 58, 0.4);
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Form animation */
.category-form {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
  `]
})
export class CategoryFormComponent implements OnInit {
  @Input() isLoading = false;
  @Output() categorySubmit = new EventEmitter<CategoryCreateRequest>();
  @Output() validationError = new EventEmitter<string>();

  categoryForm!: FormGroup;
  isCheckingName = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.setupNameValidation();
  }

  get nameControl() {
    return this.categoryForm.get('name');
  }

  get descriptionControl() {
    return this.categoryForm.get('description');
  }

  private initializeForm() {
    this.categoryForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      description: ['', [
        Validators.maxLength(200)
      ]]
    });
  }

  private setupNameValidation() {
    this.nameControl?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(name => {
        if (!name || name.length < 2 || this.nameControl?.hasError('required')) {
          return [];
        }

        this.isCheckingName = true;
        return this.categoryService.checkCategoryNameExists(name);
      })
    ).subscribe({
      next: (exists) => {
        this.isCheckingName = false;
        if (exists) {
          this.nameControl?.setErrors({ ...this.nameControl.errors, nameExists: true });
        } else if (this.nameControl?.hasError('nameExists')) {
          const errors = { ...this.nameControl.errors };
          delete errors['nameExists'];
          this.nameControl.setErrors(Object.keys(errors).length ? errors : null);
        }
      },
      error: () => {
        this.isCheckingName = false;
      }
    });
  }

  onSubmit() {
    if (this.categoryForm.valid && !this.isLoading && !this.isCheckingName) {
      const categoryData: CategoryCreateRequest = {
        name: this.categoryForm.value.name.trim(),
        description: this.categoryForm.value.description?.trim() || undefined
      };

      this.categorySubmit.emit(categoryData);

      // Reset form after successful submission would be handled by parent component
      setTimeout(() => {
        if (!this.isLoading) {
          this.categoryForm.reset();
        }
      }, 100);
    } else {
      this.validationError.emit('Lütfen tüm zorunlu alanları doğru şekilde doldurun');
    }
  }
}
