import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from "./components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    Header,
    Footer
],
  templateUrl: "./app.html",
  styleUrls: ["./app.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
}
