import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { EstatusUsuario, Usuario } from '../../core/models/usuario.model';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { QUICK_ACTIONS } from './dashboard.constants';
import { RouterModule } from '@angular/router';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, RouterModule,
  ],
  template: `
    <div class="dashboard">
      <h4 class="dashboard__title">Panel de Control — Módulo Usuarios</h4>

      <!-- KPI Cards -->
      <div class="dashboard__kpis">
        @for (kpi of kpis; track kpi.label) {
          <div class="card kpi-card">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="kpi-card__icon" [style.background]="kpi.color">
                <i class="bi" [class]="kpi.icon"></i>
              </div>
              <div class="kpi-card__data">
                <span class="kpi-card__value">{{ kpi.valor }}</span>
                <span class="kpi-card__label">{{ kpi.label }}</span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Accesos rápidos -->
      <div class="card dashboard__section">
        <div class="card-header">
          <h5 class="card-title">Accesos Rápidos</h5>
        </div>
        <div class="card-body">
          <div class="quick-actions">
            @for (action of quickActions; track action.label) {
              <button class="btn btn-outline-primary quick-action-btn" [routerLink]="[action.route]">
                <i class="bi" [class]="action.icon"></i>
                {{ action.label }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Tabla usuarios recientes -->
      <div class="card dashboard__section">
        <div class="card-header">
          <h5 class="card-title">Últimos Usuarios Registrados</h5>
        </div>
        <div class="card-body">
          @if (cargando()) {
            <div class="text-center p-4">
              <div class="spinner-border" role="status"></div>
            </div>
          } @else {
            <table class="table table-striped table-bordered table-hover">
              <thead class="table-light">
                <tr>
                  <th>RFC</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Estatus</th>
                  <th>Registro</th>
                </tr>
              </thead>
              <tbody>
                @for (u of usuarios(); track u.rfc) {
                  <tr>
                    <td>{{ u.rfc }}</td>
                    <td>{{ u.nombre }} {{ u.primerApellido }}</td>
                    <td>{{ u.tipoPersona }}</td>
                    <td><span class="badge" [class]="'chip-' + u.estatus">{{ u.estatus }}</span></td>
                    <td>{{ u.fechaRegistro }}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { }
    .dashboard__title { color: #1a2035; margin-bottom: 24px; }
    .dashboard__kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .kpi-card__icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: white; flex-shrink: 0; }
    .kpi-card__value { display: block; font-size: 28px; font-weight: 700; color: #1a2035; }
    .kpi-card__label { display: block; font-size: 13px; color: #6c757d; }
    .dashboard__section { margin-bottom: 24px; }
    .quick-actions { display: flex; flex-wrap: wrap; gap: 12px; }
    .quick-action-btn { gap: 8px; }
    .chip-ACTIVO { background: #2e7d32 !important; color: white !important; }
    .chip-BLOQUEADO { background: #a94442 !important; color: white !important; }
    .chip-PENDIENTE_CORREO { background: #8a6d3b !important; color: white !important; }
  `],
})
export class DashboardComponent implements OnInit {
  private api = inject(UsuariosApiService);
  auth = inject(AuthService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);

  readonly kpis = [
    { label: 'Usuarios Activos', valor: '128', icon: 'bi-people', color: '#006847' },
    { label: 'Pendientes', valor: '7', icon: 'bi-hourglass-split', color: '#8a6d3b' },
    { label: 'Roles Asignados', valor: '342', icon: 'bi-person-badge', color: '#2e7d32' },
    { label: 'Trámites Activos', valor: '56', icon: 'bi-file-text', color: '#611232' },
  ];

  readonly quickActions = QUICK_ACTIONS;

  ngOnInit() {
    this.api.listarUsuarios().subscribe(lista => {
      this.usuarios.set(lista);
      this.cargando.set(false);
    });
  }
}
