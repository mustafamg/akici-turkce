import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    RouterModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

}
