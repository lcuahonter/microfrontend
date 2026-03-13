import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { STORE_FRONT_ROUTES } from '../../../routes.constants';

@Component({
  selector: 'front-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './store-front-sidebar.component.html',
  styleUrl: './store-front-sidebar.component.scss',
})
export class StoreFrontSidebarComponent {
  storeFrontRoutes = STORE_FRONT_ROUTES;
  @Output() linkClicked = new EventEmitter<void>();

  onLinkClick() {
    this.linkClicked.emit();
  }
}
