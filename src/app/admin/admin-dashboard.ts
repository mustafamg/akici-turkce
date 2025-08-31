import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <!-- Success Popup -->
      <div *ngIf="showSuccessPopup" class="success-popup">
        <div class="popup-content">
          <svg class="success-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>You are successfully logged in!</span>
        </div>
      </div>

      <div class="welcome-section">
        <h2>Welcome to Admin Dashboard</h2>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <div class="stat-number">1,234</div>
        </div>

        <div class="stat-card">
          <h3>Active Sessions</h3>
          <div class="stat-number">89</div>
        </div>

        <div class="stat-card">
          <h3>System Health</h3>
          <div class="stat-number">98%</div>
        </div>

        <div class="stat-card">
          <h3>Revenue</h3>
          <div class="stat-number">$12,345</div>
        </div>
      </div>

      <div class="recent-activity">
        <h3>Recent Activity</h3>
        <div class="activity-list">
          <div class="activity-item">
            <span class="activity-time">2 hours ago</span>
            <span class="activity-desc">New user registered</span>
          </div>
          <div class="activity-item">
            <span class="activity-time">4 hours ago</span>
            <span class="activity-desc">Video uploaded</span>
          </div>
          <div class="activity-item">
            <span class="activity-time">6 hours ago</span>
            <span class="activity-desc">System backup completed</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem 0;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .welcome-section h2 {
      color: #C41E3A;
      margin-bottom: 0.5rem;
    }

    .welcome-section p {
      color: #6c757d;
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .stat-card h3 {
      color: #6c757d;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #C41E3A;
    }

    .recent-activity {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .recent-activity h3 {
      color: #C41E3A;
      margin-bottom: 1rem;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 0.375rem;
    }

    .activity-time {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .activity-desc {
      color: #495057;
      font-weight: 500;
    }
  `]
})
export class AdminDashboard implements OnInit {
  showSuccessPopup = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Show success popup when component initializes
    this.showSuccessPopup = true;

    // Hide popup after 1 second
    setTimeout(() => {
      this.showSuccessPopup = false;
      this.cdr.detectChanges();
    }, 1000);
  }
}
