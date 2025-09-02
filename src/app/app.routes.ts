import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './auth/components/login/login';  // Update this import path
import { Signup } from './auth/components/signup/signup'; // Update this import path
import { AddVideoComponent } from './add-video/add-video';
import { AdminLayout } from './admin/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard';
import { CategoriesComponent } from './admin/categories/categories.component';
import { AuthGuard } from './auth/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'add-video', component: AddVideoComponent },
      { path: 'categories', component: CategoriesComponent }
    ]
  }
];
