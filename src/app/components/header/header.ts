import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  currentBgClass: string = 'bg-beige';
  isLoginPage: boolean = false;
  private routerSubscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateRouteState(this.router.url);
    
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateRouteState(event.url);
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateRouteState(url: string) {
    if (url === '/' || url === '') {
      this.currentBgClass = 'bg-white';
      this.isLoginPage = false;
    } else if (url === '/login' || url === '/signup' || url === '/add-video') {
      this.currentBgClass = 'bg-red';
      this.isLoginPage = true;
    } else if (url.startsWith('/admin')) {
      this.currentBgClass = 'bg-dark-red';
      this.isLoginPage = false;
    } else {
      this.currentBgClass = 'bg-beige';
      this.isLoginPage = false;
    }
  }
}
