import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { RolAsignado, TipoRol } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-seleccion-rol',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="selrol-container">
      <div class="selrol-header">
        <mat-icon>manage_accounts</mat-icon>
        <h2>Seleccione su Rol</h2>
        <p>Tiene múltiples roles asignados. Seleccione con cuál desea continuar.</p>
      </div>
      <div class="selrol-grid">
        @for (rol of roles; track rol.id) {
          <mat-card class="selrol-card" (click)="seleccionar(rol)">
            <mat-card-content>
              <div class="selrol-card__icon" [class]="'selrol-icon--' + rol.tipoRol">
                <mat-icon>{{ iconMap[rol.tipoRol] ?? 'person' }}</mat-icon>
              </div>
              <h3>{{ rol.nombreRol }}</h3>
              @if (rol.dependencia) { <p class="selrol-dep">{{ rol.dependencia }}</p> }
              @if (rol.unidadAdministrativa) { <p class="selrol-ua">{{ rol.unidadAdministrativa }}</p> }
              <span class="selrol-badge">{{ rol.tipoRol }}</span>
            </mat-card-content>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .selrol-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f5f5f5; padding: 32px; }
    .selrol-header { text-align: center; margin-bottom: 40px; }
    .selrol-header mat-icon { font-size: 56px; width: 56px; height: 56px; color: #006847; }
    .selrol-header h2 { font-size: 28px; margin: 8px 0 4px; }
    .selrol-header p { color: #666; }
    .selrol-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; width: 100%; max-width: 800px; }
    .selrol-card { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; text-align: center; padding: 8px; }
    .selrol-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .selrol-card__icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .selrol-card__icon mat-icon { font-size: 32px; width: 32px; height: 32px; color: white; }
    .selrol-icon--OPERATIVO { background: #1976d2; }
    .selrol-icon--AUTORIZADOR { background: #388e3c; }
    .selrol-icon--ADMINISTRADOR { background: #f57c00; }
    .selrol-icon--FUNCIONARIO { background: #7b1fa2; }
    .selrol-card h3 { margin: 0 0 4px; font-size: 16px; }
    .selrol-dep { color: #666; font-size: 13px; margin: 0; }
    .selrol-ua { color: #999; font-size: 12px; margin: 0; }
    .selrol-badge { display: inline-block; margin-top: 8px; padding: 2px 10px; background: #e8f5e9; color: #2e7d32; border-radius: 12px; font-size: 11px; font-weight: 600; }
  `],
})
export class SeleccionRolComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  roles = this.auth.rolesDisponibles();
  readonly iconMap: Record<string, string> = {
    OPERATIVO: 'work', AUTORIZADOR: 'verified_user',
    ADMINISTRADOR: 'admin_panel_settings', FUNCIONARIO: 'account_balance',
  };

  seleccionar(rol: RolAsignado) {
    this.auth.seleccionarRol(rol);
    this.router.navigate(['/dashboard']);
  }
}
