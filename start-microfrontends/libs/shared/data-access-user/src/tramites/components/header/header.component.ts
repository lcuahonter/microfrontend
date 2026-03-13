import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'c-header',
  standalone: true,
  imports: [NavComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(public router: Router) {}  

  get isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url.startsWith('/login');
  }

}
