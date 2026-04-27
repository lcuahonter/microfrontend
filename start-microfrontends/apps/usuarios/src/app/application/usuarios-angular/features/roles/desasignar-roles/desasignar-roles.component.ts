import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RolAsignado, Usuario } from '../../../core/models/usuario.model';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-desasignar-roles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    UserSearchComponent, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-person-dash"></i> Desasignar Roles</h4>

      <vuc-user-search (seleccionado)="onUsuarioSeleccionado($event)"></vuc-user-search>

      @if (usuario()) {
        <div class="roles-section">
          <h3>Roles Asignados a {{ usuario()!.nombre }} {{ usuario()!.primerApellido }}</h3>
          @if (!usuario()!.roles?.length) {
            <vuc-alert type="info">Este usuario no tiene roles asignados.</vuc-alert>
          } @else {
            @for (rol of usuario()!.roles; track rol.id) {
              <div class="rol-item">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" [id]="'rol-' + rol.id"
                         (change)="toggleRol(rol.id, $event)">
                  <label class="form-check-label" [for]="'rol-' + rol.id">
                    <div class="rol-info">
                      <strong>{{ rol.nombreRol }}</strong>
                      <span>{{ rol.tipoRol }}</span>
                      @if (rol.dependencia) { <span>— {{ rol.dependencia }}</span> }
                    </div>
                  </label>
                </div>
              </div>
            }
          }

          @if (rolesSeleccionados.length) {
            <div class="mb-3 mt-3">
              <label class="form-label">Motivo de desasignación</label>
              <textarea class="form-control" [formControl]="motivoCtrl" rows="3" placeholder="Describa el motivo..."></textarea>
            </div>

            @if (exito()) {
              <vuc-alert type="success">Roles desasignados correctamente.</vuc-alert>
            }

            <button class="btn btn-danger" (click)="desasignar()" [disabled]="!motivoCtrl.value || cargando()">
              @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
              @else { <i class="bi bi-dash-circle"></i> Desasignar ({{ rolesSeleccionados.length }}) Roles }
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 700px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .roles-section { margin-top: 24px; }
    .roles-section h3 { margin-bottom: 16px; color: #404041; }
    .rol-item { padding: 12px 16px; border: 1px solid #dee2e6; border-radius: 8px; margin-bottom: 8px; }
    .rol-info { display: flex; gap: 8px; align-items: center; font-size: 14px; }
  `],
})
export class DesasignarRolesComponent {
  private api = inject(UsuariosApiService);

  usuario = signal<Usuario | null>(null);
  rolesSeleccionados: number[] = [];
  motivoCtrl = new FormControl('');
  cargando = signal(false);
  exito = signal(false);

  onUsuarioSeleccionado(u: Usuario) {
    this.usuario.set(u);
    this.rolesSeleccionados = [];
    this.motivoCtrl.reset('');
    this.exito.set(false);
  }

  toggleRol(id: number, event: Event) {
    const CHECKED = (event.target as HTMLInputElement).checked;
    if (CHECKED) { this.rolesSeleccionados.push(id); }
    else { this.rolesSeleccionados = this.rolesSeleccionados.filter(r => r !== id); }
  }

  desasignar() {
    this.cargando.set(true);
    this.api.desasignarRoles({ rfcUsuario: this.usuario()!.rfc, rolIds: this.rolesSeleccionados, motivo: this.motivoCtrl.value! }).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
      this.rolesSeleccionados = [];
      this.motivoCtrl.reset('');
    });
  }
}
