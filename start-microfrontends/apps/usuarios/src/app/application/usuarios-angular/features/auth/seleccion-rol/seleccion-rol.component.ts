import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RolAsignado, TipoRol } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'vuc-seleccion-rol',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="selrol-container">
      <div class="selrol-header">
        <i class="bi bi-person-gear selrol-icon-main"></i>
        <h3>Seleccione su Rol</h3>
        <p>Tiene múltiples roles asignados. Seleccione con cuál desea continuar.</p>
      </div>
      <div class="selrol-grid">
        @for (rol of roles; track rol.id) {
          <div class="card selrol-card" (click)="seleccionar(rol)">
            <div class="card-body text-center">
              <div class="selrol-card__icon mb-3" [class]="'selrol-icon--' + rol.tipoRol">
                <i class="bi" [class]="iconMap[rol.tipoRol] ?? 'bi-person'"></i>
              </div>
              <h3 class="card-title">{{ rol.nombreRol }}</h3>
              @if (rol.dependencia) { <p class="selrol-dep">{{ rol.dependencia }}</p> }
              @if (rol.unidadAdministrativa) { <p class="selrol-ua">{{ rol.unidadAdministrativa }}</p> }
              <span class="selrol-badge">{{ rol.tipoRol }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .selrol-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8f9fa; padding: 32px; }
    .selrol-header { text-align: center; margin-bottom: 40px; }
    .selrol-icon-main { font-size: 56px; color: #006847; display: block; margin-bottom: 8px; }
    .selrol-header h3 { margin: 8px 0 4px; }
    .selrol-header p { color: #6c757d; }
    .selrol-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; width: 100%; max-width: 800px; }
    .selrol-card { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
    .selrol-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .selrol-card__icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 32px; color: white; }
    .selrol-icon--OPERATIVO { background: #006847; }
    .selrol-icon--AUTORIZADOR { background: #2e7d32; }
    .selrol-icon--ADMINISTRADOR { background: #8a6d3b; }
    .selrol-icon--FUNCIONARIO { background: #611232; }
    .selrol-dep { color: #6c757d; font-size: 13px; margin: 0; }
    .selrol-ua { color: #adb5bd; font-size: 12px; margin: 0; }
    .selrol-badge { display: inline-block; margin-top: 8px; padding: 2px 10px; background: #dff0d8; color: #3c763d; border-radius: 12px; font-size: 11px; font-weight: 600; }
  `],
})
export class SeleccionRolComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  roles = this.auth.rolesDisponibles();
  readonly iconMap: Record<string, string> = {
    OPERATIVO: 'bi-briefcase', AUTORIZADOR: 'bi-shield-check',
    ADMINISTRADOR: 'bi-person-gear', FUNCIONARIO: 'bi-bank',
  };

  seleccionar(rol: RolAsignado) {
    this.auth.seleccionarRol(rol);
    this.router.navigate(['/dashboard']);
  }
}
