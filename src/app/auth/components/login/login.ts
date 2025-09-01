import { Component, signal, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  /**
   * OnInit lifecycle hook is called once the component is initialized.
   * It is used here to read the router state passed during navigation.
   */
  ngOnInit() {
    // history.state contains the state object passed via router.navigate
    const state = history.state;
    if (state && state.message) {
      // Set the successMessage signal to display the message in the UI
      this.successMessage.set(state.message);
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (response) => {
        // On successful login, AuthService handles navigation.
        // We can stop the loader here, though navigation will soon destroy this component.
        this.isLoading.set(false);
        console.log('Login successful:', response);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          'Login failed. Please check your username and password.'
        );
        console.error('Login error:', err);
      },
    });
    // this.authService.login(username, password).subscribe({
    //   next: (response) => {
    //     this.isLoading = false;
    //     if (response) {
    //       console.log(response);
    //       // this.router.navigate(['/']);
    //     } else {
    //       this.isLoading = false;
    //       this.errorMessage =
    //         'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
    //     }
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
    //   },
    // });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
