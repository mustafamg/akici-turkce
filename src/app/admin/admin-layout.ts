import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout">
      <header class="admin-header">
        <div class="header-content">
          <h1 class="admin-title">Admin Dashboard</h1>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </header>

      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .admin-header {
      background-color: #C41E3A; /* Same red as other pages */
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .logout-btn {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
      color: white !important;
    }

    .logout-btn:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .admin-main {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class AdminLayout {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
