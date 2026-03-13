import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreFrontSidebarComponent } from '../../components/store-front-navbar/store-front-sidebar.component';

@Component({
  selector: 'app-store-front-layout.ts',
  standalone: true,
  imports: [RouterOutlet, StoreFrontSidebarComponent],
  templateUrl: './store-front-layout.ts.component.html',
  styleUrls: ['./store-front-layout.component.scss'],
})
export class StoreFrontLayoutTsComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
