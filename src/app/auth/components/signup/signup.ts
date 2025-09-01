import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss'],
})
export class Signup {
  signupForm: FormGroup;
  hidePassword = true;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['learner'], // default role, hidden from user
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

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.signupForm.value;

    this.authService.signup(username, password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        console.log('Signup successful:', response);

        // if (response.success) {
        //   this.router.navigate(['/login']);
        // } else {
        //   this.errorMessage =
        //     'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.';
        // }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message ||
            'Signup failed. The username may already be taken.'
        );
        console.error('Signup error:', err);
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
