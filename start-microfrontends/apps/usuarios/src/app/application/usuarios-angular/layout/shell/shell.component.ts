import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NAV_ITEMS } from './nav-items.constants';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'vuc-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
  ],
  template: `
    <div class="shell-container d-flex">
      <!-- Sidebar -->
      @if (sidenavOpen()) {
        <nav class="shell-sidenav d-flex flex-column">
          <!-- Logo -->
          <div class="shell-logo d-flex align-items-center gap-2">
            <img src="assets/logo-vucem.svg" alt="VUCEM" onerror="this.style.display='none'" style="height:32px">
            <div class="shell-logo__text d-flex flex-column">
              <span class="shell-logo__title">VUCEM</span>
              <span class="shell-logo__sub">Módulo Usuarios</span>
            </div>
          </div>

          <!-- Rol activo -->
          @if (auth.rol()) {
            <div class="shell-rol d-flex align-items-center gap-2">
              <i class="bi bi-person-badge"></i>
              <span>{{ auth.rol()!.nombreRol }}</span>
            </div>
          }

          <hr class="border-secondary my-0">

          <!-- Navegación -->
          <ul class="shell-nav list-unstyled flex-grow-1 mt-2">
            @for (item of navItems; track item.route) {
              <li>
                <a class="shell-nav__link d-flex align-items-center gap-2"
                   [routerLink]="[item.route]" routerLinkActive="active-link">
                  <i class="bi" [class]="item.icon"></i>
                  <span>{{ item.label }}</span>
                </a>
              </li>
            }
          </ul>
        </nav>
      }

      <!-- Contenido principal -->
      <div class="shell-content d-flex flex-column flex-grow-1">
        <!-- Toolbar -->
        <nav class="shell-toolbar navbar navbar-dark px-3">
          <button class="btn btn-sm btn-link p-0 text-white" (click)="toggleSidenav()">
            <i class="bi bi-list fs-4"></i>
          </button>
          <span class="shell-toolbar__title ms-3 text-white">Ventanilla Única de Comercio Exterior</span>
          <span class="flex-grow-1"></span>

          <!-- Usuario -->
          @if (auth.usuario()) {
            <div class="dropdown">
              <button class="btn btn-sm btn-link text-white d-flex align-items-center gap-1 dropdown-toggle"
                      type="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle"></i>
                <span>{{ auth.usuario()!.nombre }} {{ auth.usuario()!.primerApellido }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <span class="dropdown-item-text">
                    <i class="bi bi-person-badge me-2"></i>{{ auth.usuario()!.rfc }}
                  </span>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item" (click)="auth.logout()">
                    <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          }
        </nav>

        <!-- Router outlet -->
        <div class="shell-body flex-grow-1">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shell-container { height: 100vh; overflow: hidden; }
    .shell-sidenav { width: 260px; min-width: 260px; background: #1a2035; color: white; overflow-y: auto; }
    .shell-logo { padding: 20px 16px; }
    .shell-logo__title { font-size: 18px; font-weight: 700; color: white; }
    .shell-logo__sub { font-size: 11px; color: #adb5bd; }
    .shell-rol { padding: 8px 16px 12px; font-size: 13px; color: #adb5bd; }
    .shell-nav__link { padding: 10px 16px; color: rgba(255,255,255,0.8); text-decoration: none; border-left: 3px solid transparent; transition: background 0.2s; font-size: 16px; }
    .shell-nav__link:hover { background: rgba(255,255,255,0.08); color: white; }
    .shell-nav__link.active-link { background: rgba(255,255,255,0.1); border-left-color: #006847; color: white; }
    .shell-nav__link.active-link i { color: #9FD16C; }
    .shell-toolbar { background: #006847; position: sticky; top: 0; z-index: 100; min-height: 56px; }
    .shell-toolbar__title { font-size: 15px; font-weight: 500; }
    .shell-content { overflow-y: auto; }
    .shell-body { padding: 24px; background: #f8f9fa; min-height: calc(100vh - 56px); }
  `],
})
export class ShellComponent {
  auth = inject(AuthService);
  navItems = NAV_ITEMS;
  sidenavOpen = signal(true);
  toggleSidenav() { this.sidenavOpen.update(v => !v); }
}
