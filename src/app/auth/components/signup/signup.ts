import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class Signup {
  signupForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['learner']  // default role, hidden from user
    });
  }

  get username() {
    return this.signupForm.get('username');
  }

  get password() {
    return this.signupForm.get('password');
  }

  // Optional: You can remove this getter since role is hidden and won't be validated
  // get role() {
  //   return this.signupForm.get('role');
  // }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;

    const { username, password, role } = this.signupForm.value;
    
    this.authService.signup(username, password, role).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        console.error('Signup error:', err); // Optional: for debugging
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}