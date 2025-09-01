import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styles: [`
    /* No additional styles needed as styles are in the HTML file */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
      color: #1e293b;
    }



    .main-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-title {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #C41E3A, #A0182E);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .dashboard-subtitle {
      color: #64748b;
      font-size: 1.1rem;
      font-weight: 400;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(196, 30, 58, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #C41E3A, #A0182E);
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(196, 30, 58, 0.15);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.users {
      background: linear-gradient(135deg, #fef3c7, #fbbf24);
    }

    .stat-icon.sessions {
      background: linear-gradient(135deg, #dbeafe, #3b82f6);
    }

    .stat-icon.health {
      background: linear-gradient(135deg, #dcfce7, #22c55e);
    }

    .stat-icon.revenue {
      background: linear-gradient(135deg, #fce7f3, #ec4899);
    }

    .stat-value {
      font-size: 3rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 0.5rem;
      line-height: 1;
    }

    .stat-change {
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .stat-change.positive {
      color: #22c55e;
    }

    .stat-change.neutral {
      color: #64748b;
    }

    .activity-section {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(196, 30, 58, 0.1);
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .activity-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1e293b;
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
      padding: 1rem;
      border-radius: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .activity-item:hover {
      background: #f1f5f9;
      transform: translateX(4px);
      border-color: #C41E3A;
    }

    .activity-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .activity-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #C41E3A;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .activity-text {
      font-weight: 500;
      color: #1e293b;
    }

    .activity-time {
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 500;
    }

    .floating-elements {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }

    .floating-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(196, 30, 58, 0.1), rgba(160, 24, 46, 0.05));
      animation: float 6s ease-in-out infinite;
    }

    .floating-circle:nth-child(1) {
      width: 100px;
      height: 100px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    .floating-circle:nth-child(2) {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }

    .floating-circle:nth-child(3) {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 30%;
      animation-delay: 4s;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    .success-popup {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #22c55e;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: slideIn 0.3s ease;
    }

    .success-icon {
      width: 20px;
      height: 20px;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
      }

      .dashboard-title {
        font-size: 2rem;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .main-container {
        padding: 1rem;
      }
    }
  `]
})
export class AdminDashboard implements OnInit, AfterViewInit {
  showSuccessPopup = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Show success popup when component initializes
    this.showSuccessPopup = true;

    // Hide popup after 1 second
    setTimeout(() => {
      this.showSuccessPopup = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  ngAfterViewInit() {
    // Add smooth scrolling and interaction effects
    this.initializeAnimations();
  }

  private initializeAnimations() {
    const statCards = this.elementRef.nativeElement.querySelectorAll('.stat-card');

    // Animate stat cards on load
    statCards.forEach((card: HTMLElement, index: number) => {
      this.renderer.setStyle(card, 'opacity', '0');
      this.renderer.setStyle(card, 'transform', 'translateY(20px)');

      setTimeout(() => {
        this.renderer.setStyle(card, 'transition', 'all 0.6s ease');
        this.renderer.setStyle(card, 'opacity', '1');
        this.renderer.setStyle(card, 'transform', 'translateY(0)');
      }, index * 150);
    });

    // Add click effects to stat cards
    statCards.forEach((card: HTMLElement) => {
      this.renderer.listen(card, 'click', () => {
        this.renderer.setStyle(card, 'transform', 'scale(0.98)');
        setTimeout(() => {
          this.renderer.setStyle(card, 'transform', '');
        }, 150);
      });
    });

    // Animate activity items
    const activityItems = this.elementRef.nativeElement.querySelectorAll('.activity-item');
    activityItems.forEach((item: HTMLElement, index: number) => {
      this.renderer.setStyle(item, 'opacity', '0');
      this.renderer.setStyle(item, 'transform', 'translateX(-20px)');

      setTimeout(() => {
        this.renderer.setStyle(item, 'transition', 'all 0.5s ease');
        this.renderer.setStyle(item, 'opacity', '1');
        this.renderer.setStyle(item, 'transform', 'translateX(0)');
      }, 800 + index * 100);
    });
  }
}
