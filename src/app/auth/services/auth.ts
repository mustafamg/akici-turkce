import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: { id: number; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private authState = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.authState.asObservable();

  private readonly TOKEN_KEY = 'auth_token';

  login(username: string, password: string) {
    return this.http
      .post<AuthResponse>('http://localhost:3000/auth/login', {
        username,
        password,
      })
      .pipe(
        tap((res) => {
          console.log(res.user.role);

          this.handleAuth(res);
          if (res.user.role === 'admin') {
            this.router.navigate(['/signup']);
          } else {
            this.router.navigate(['/']);
          }
        })
      );
  }

  signup(username: string, password: string) {
    const role = 'learner';
    return this.http
      .post<AuthResponse>('http://localhost:3000/auth/register', {
        username,
        password,
        role,
      })
      .pipe(
        tap((res) =>
          this.router.navigate(['/login'], {
            state: {
              message: 'Registration successful! Please login to continue.',
            },
          })
        )
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem('userRole', res.user.role);
    this.authState.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
