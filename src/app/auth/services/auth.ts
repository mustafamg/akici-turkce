import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    // Simulating an API call with a delay
    if (username === 'test' && password === 'password') {
      return of({ success: true }).pipe(delay(1000)); // Simulate successful login
    } else {
      return of({ success: false, status: 401 }).pipe(delay(1000)); // Simulate failed login
    }
  }

  signup(username: string, password: string, role: string): Observable<any> {
    // Simulating an API call with a delay
    return of({ success: true }).pipe(delay(1000)); // Simulate successful signup
  }
}
