import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isAdminRoute: boolean = false;
  private routerSubscription!: Subscription;

  @ViewChild('logoutDialog') logoutDialog!: ElementRef;

  constructor(private router: Router, private authService: AuthService, private renderer: Renderer2) {}

  ngOnInit() {
    this.checkAuthStatus();
    this.checkAdminRoute(this.router.url);

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkAuthStatus();
        this.checkAdminRoute(event.url);
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkAuthStatus() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();
  }

  private checkAdminRoute(url: string) {
    this.isAdminRoute = url.startsWith('/admin');
  }

  openLogoutDialog() {
    this.renderer.setStyle(this.logoutDialog.nativeElement, 'display', 'flex');
  }

  closeLogoutDialog() {
    this.renderer.setStyle(this.logoutDialog.nativeElement, 'display', 'none');
  }

  confirmLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
    this.closeLogoutDialog();
    this.router.navigate(['/']);
  }
}
