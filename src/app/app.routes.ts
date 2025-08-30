import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './auth/components/login/login';  // Update this import path
import { Signup } from './auth/components/signup/signup'; // Update this import path

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup }
];