import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [      
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  videos = [
    {level: 'Intermediate', title: 'İstanbul\'da Bir Gün - Vlog', type: 'Vlog', src: '/img/placeholder.svg'},
    {level: 'Beginner', title: 'Türk Mutfağı: Baklava Tarifi', type: 'Cooking', src: '/img/placeholder.svg'},
    {level: 'Advanced', title: 'Türkiye\'nin Tarihi Yerleri', type: 'Documentary', src: '/img/placeholder.svg'},
    {level: 'Intermediate', title: 'Türkçe Müzik: Popüler Şarkılar', type: 'Music', src: '/img/placeholder.svg'},
  ];
}
