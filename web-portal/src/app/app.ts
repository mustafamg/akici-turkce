import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './components/header/header';
import { Footer } from "./components/footer/footer";
import { Home } from './components/home/home';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    Header,
    Footer,
    Home
],
  templateUrl: "./app.html",
  styleUrls: ["./app.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
}
