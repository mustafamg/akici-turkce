import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    // Simulating an API call with a delay and returning a fake JWT token
    if (username === 'admin' && password === 'password') {
      const fakeToken = 'fake-jwt-token-for-admin';
      return of({ success: true, token: fakeToken }).pipe(
        delay(1000),
        tap(response => {
          if (response.success) {
            if (rememberMe) {
              localStorage.setItem(this.tokenKey, response.token);
            } else {
              sessionStorage.setItem(this.tokenKey, response.token);
            }
          }
        })
      );
    } else {
      return of({ success: false, status: 401 }).pipe(delay(1000));
    }
  }

  signup(username: string, password: string, role: string): Observable<any> {
    // Simulating an API call with a delay
    return of({ success: true }).pipe(delay(1000));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const token = this.getToken();
    return token === 'fake-jwt-token-for-admin';
  }
}
