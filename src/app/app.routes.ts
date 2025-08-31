import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './auth/components/login/login';  // Update this import path
import { Signup } from './auth/components/signup/signup'; // Update this import path
import { AddVideoComponent } from './add-video/add-video';
import { AdminLayout } from './admin/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard';
import { AuthGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'add-video', component: AddVideoComponent },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard }
    ]
  }
];
