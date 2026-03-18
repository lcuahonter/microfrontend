import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';
import { Usuario, EstatusUsuario } from '../../core/models/usuario.model';

@Component({
  selector: 'vuc-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatChipsModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="dashboard">
      <h2 class="dashboard__title">Panel de Control — Módulo Usuarios</h2>

      <!-- KPI Cards -->
      <div class="dashboard__kpis">
        @for (kpi of kpis; track kpi.label) {
          <mat-card class="kpi-card">
            <mat-card-content>
              <div class="kpi-card__icon" [style.background]="kpi.color">
                <mat-icon>{{ kpi.icon }}</mat-icon>
              </div>
              <div class="kpi-card__data">
                <span class="kpi-card__value">{{ kpi.valor }}</span>
                <span class="kpi-card__label">{{ kpi.label }}</span>
              </div>
            </mat-card-content>
          </mat-card>
        }
      </div>

      <!-- Accesos rápidos -->
      <mat-card class="dashboard__section">
        <mat-card-header>
          <mat-card-title>Accesos Rápidos</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="quick-actions">
            @for (action of quickActions; track action.label) {
              <button mat-stroked-button [routerLink]="[action.route]" class="quick-action-btn">
                <mat-icon>{{ action.icon }}</mat-icon>
                {{ action.label }}
              </button>
            }
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Tabla usuarios recientes -->
      <mat-card class="dashboard__section">
        <mat-card-header>
          <mat-card-title>Últimos Usuarios Registrados</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (cargando()) {
            <div style="text-align:center;padding:24px"><mat-spinner diameter="36"></mat-spinner></div>
          } @else {
            <table mat-table [dataSource]="usuarios()" class="dashboard-table">
              <ng-container matColumnDef="rfc">
                <th mat-header-cell *matHeaderCellDef>RFC</th>
                <td mat-cell *matCellDef="let u">{{ u.rfc }}</td>
              </ng-container>
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let u">{{ u.nombre }} {{ u.primerApellido }}</td>
              </ng-container>
              <ng-container matColumnDef="tipo">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let u">{{ u.tipoPersona }}</td>
              </ng-container>
              <ng-container matColumnDef="estatus">
                <th mat-header-cell *matHeaderCellDef>Estatus</th>
                <td mat-cell *matCellDef="let u">
                  <mat-chip [class]="'chip-' + u.estatus">{{ u.estatus }}</mat-chip>
                </td>
              </ng-container>
              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Registro</th>
                <td mat-cell *matCellDef="let u">{{ u.fechaRegistro }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="columnas"></tr>
              <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
            </table>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard { }
    .dashboard__title { font-size: 24px; font-weight: 600; color: #1a2035; margin-bottom: 24px; }
    .dashboard__kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card mat-card-content { display: flex; align-items: center; gap: 16px; padding: 16px !important; }
    .kpi-card__icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .kpi-card__icon mat-icon { color: white; font-size: 28px; width: 28px; height: 28px; }
    .kpi-card__value { display: block; font-size: 28px; font-weight: 700; color: #1a2035; }
    .kpi-card__label { display: block; font-size: 13px; color: #666; }
    .dashboard__section { margin-bottom: 24px; }
    .quick-actions { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 8px; }
    .quick-action-btn { gap: 8px; }
    .dashboard-table { width: 100%; }
    .chip-ACTIVO { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .chip-BLOQUEADO { background: #ffebee !important; color: #c62828 !important; }
    .chip-PENDIENTE_CORREO { background: #fff8e1 !important; color: #e65100 !important; }
  `],
})
export class DashboardComponent implements OnInit {
  private api = inject(UsuariosApiService);
  auth = inject(AuthService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  columnas = ['rfc', 'nombre', 'tipo', 'estatus', 'fecha'];

  kpis = [
    { label: 'Usuarios Activos', valor: '128', icon: 'people', color: '#1976d2' },
    { label: 'Pendientes', valor: '7', icon: 'pending', color: '#f57c00' },
    { label: 'Roles Asignados', valor: '342', icon: 'badge', color: '#388e3c' },
    { label: 'Trámites Activos', valor: '56', icon: 'description', color: '#7b1fa2' },
  ];

  quickActions = [
    { label: 'Nuevo Registro', icon: 'person_add', route: '/registro' },
    { label: 'Asignar Rol', icon: 'manage_accounts', route: '/roles/asignar' },
    { label: 'Alta Accionista', icon: 'group_add', route: '/accionista/alta' },
    { label: 'Nueva Suplencia', icon: 'swap_horiz', route: '/suplencias' },
    { label: 'Cambio Correo', icon: 'email', route: '/correo/cambio' },
  ];

  ngOnInit() {
    this.api.listarUsuarios().subscribe(lista => {
      this.usuarios.set(lista);
      this.cargando.set(false);
    });
  }
}
