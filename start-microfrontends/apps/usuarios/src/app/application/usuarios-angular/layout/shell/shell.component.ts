import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: 'dashboard' },
  { label: 'Registro de Usuario', icon: 'person_add', route: 'registro' },
  { label: 'Asignar Roles', icon: 'manage_accounts', route: 'roles/asignar' },
  { label: 'Desasignar Roles', icon: 'person_remove', route: 'roles/desasignar' },
  { label: 'Cambio de Contraseña', icon: 'lock_reset', route: 'password/cambio' },
  { label: 'Recuperar Contraseña', icon: 'key', route: 'password/recuperar' },
  { label: 'Cambio de Correo', icon: 'email', route: 'correo/cambio' },
  { label: 'Alta de Accionista', icon: 'group_add', route: 'accionista/alta' },
  { label: 'Alta de Capturista', icon: 'edit_note', route: 'capturista/alta' },
  { label: 'Persona Oír/Recibir', icon: 'contact_phone', route: 'persona-oir-recibir' },
  { label: 'Trámites', icon: 'description', route: 'tramites' },
  { label: 'Suplencias', icon: 'swap_horiz', route: 'suplencias' },
  { label: 'Modificar Datos', icon: 'edit', route: 'funcionarios/modificar', roles: ['FUNCIONARIO', 'ADMINISTRADOR'] },
];

@Component({
  selector: 'vuc-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
    MatSidenavModule, MatToolbarModule, MatListModule,
    MatIconModule, MatButtonModule, MatMenuModule,
    MatDividerModule, MatChipsModule,
  ],
  template: `
    <mat-sidenav-container class="shell-container">
      <!-- Sidebar -->
      <mat-sidenav mode="side" [opened]="sidenavOpen()" class="shell-sidenav">
        <!-- Logo -->
        <div class="shell-logo">
          <img src="assets/logo-vucem.svg" alt="VUCEM" onerror="this.style.display='none'">
          <div class="shell-logo__text">
            <span class="shell-logo__title">VUCEM</span>
            <span class="shell-logo__sub">Módulo Usuarios</span>
          </div>
        </div>

        <!-- Rol activo -->
        @if (auth.rol()) {
          <div class="shell-rol">
            <mat-icon>badge</mat-icon>
            <span>{{ auth.rol()!.nombreRol }}</span>
          </div>
        }

        <mat-divider></mat-divider>

        <!-- Navegación -->
        <mat-nav-list class="shell-nav">
          @for (item of navItems; track item.route) {
            <a mat-list-item [routerLink]="[item.route]" routerLinkActive="active-link">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <!-- Contenido principal -->
      <mat-sidenav-content class="shell-content">
        <!-- Toolbar -->
        <mat-toolbar class="shell-toolbar" color="primary">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="shell-toolbar__title">Ventanilla Única de Comercio Exterior</span>
          <span class="flex-spacer"></span>

          <!-- Usuario -->
          @if (auth.usuario()) {
            <button mat-button [matMenuTriggerFor]="userMenu" class="shell-user-btn">
              <mat-icon>account_circle</mat-icon>
              <span>{{ auth.usuario()!.nombre }} {{ auth.usuario()!.primerApellido }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item disabled>
                <mat-icon>badge</mat-icon>
                <span>{{ auth.usuario()!.rfc }}</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="auth.logout()">
                <mat-icon>logout</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          }
        </mat-toolbar>

        <!-- Router outlet -->
        <div class="shell-body">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .shell-container { height: 100vh; }
    .shell-sidenav { width: 260px; background: #1a2035; color: white; }
    .shell-logo { display: flex; align-items: center; gap: 12px; padding: 20px 16px; }
    .shell-logo__text { display: flex; flex-direction: column; }
    .shell-logo__title { font-size: 18px; font-weight: 700; color: white; }
    .shell-logo__sub { font-size: 11px; color: #90caf9; }
    .shell-rol { display: flex; align-items: center; gap: 8px; padding: 8px 16px 12px; font-size: 13px; color: #90caf9; }
    .shell-nav .active-link { background: rgba(255,255,255,0.1) !important; border-left: 3px solid #006847; }
    .shell-nav mat-icon { color: #90caf9 !important; }
    .shell-nav .active-link mat-icon { color: #4caf50 !important; }
    ::ng-deep .shell-nav .mat-list-item-title { color: white !important; }
    .shell-toolbar { position: sticky; top: 0; z-index: 100; background: #006847 !important; }
    .shell-toolbar__title { font-size: 15px; font-weight: 500; }
    .flex-spacer { flex: 1; }
    .shell-user-btn { color: white !important; }
    .shell-body { padding: 24px; min-height: calc(100vh - 64px); background: #f5f5f5; }
  `],
})
export class ShellComponent {
  auth = inject(AuthService);
  navItems = NAV_ITEMS;
  sidenavOpen = signal(true);
  toggleSidenav() { this.sidenavOpen.update(v => !v); }
}
