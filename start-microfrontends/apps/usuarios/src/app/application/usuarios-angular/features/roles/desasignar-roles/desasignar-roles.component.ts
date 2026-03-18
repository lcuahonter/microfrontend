import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Usuario, RolAsignado } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-desasignar-roles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatCheckboxModule, MatProgressSpinnerModule,
    UserSearchComponent, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title"><mat-icon>person_remove</mat-icon> Desasignar Roles</h2>

      <vuc-user-search (seleccionado)="onUsuarioSeleccionado($event)"></vuc-user-search>

      @if (usuario()) {
        <div class="roles-section">
          <h3>Roles Asignados a {{ usuario()!.nombre }} {{ usuario()!.primerApellido }}</h3>
          @if (!usuario()!.roles?.length) {
            <vuc-alert type="info">Este usuario no tiene roles asignados.</vuc-alert>
          } @else {
            @for (rol of usuario()!.roles; track rol.id) {
              <div class="rol-item">
                <mat-checkbox (change)="toggleRol(rol.id, $event.checked)">
                  <div class="rol-info">
                    <strong>{{ rol.nombreRol }}</strong>
                    <span>{{ rol.tipoRol }}</span>
                    @if (rol.dependencia) { <span>— {{ rol.dependencia }}</span> }
                  </div>
                </mat-checkbox>
              </div>
            }
          }

          @if (rolesSeleccionados.length) {
            <mat-form-field appearance="outline" style="width:100%;margin-top:16px">
              <mat-label>Motivo de desasignación</mat-label>
              <textarea matInput [(ngModel)]="motivo" rows="3" placeholder="Describa el motivo..."></textarea>
            </mat-form-field>

            @if (exito()) {
              <vuc-alert type="success">Roles desasignados correctamente.</vuc-alert>
            }

            <button mat-raised-button color="warn" (click)="desasignar()" [disabled]="!motivo || cargando()">
              @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
              @else { <mat-icon>remove_circle</mat-icon> Desasignar ({{ rolesSeleccionados.length }}) Roles }
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
    .roles-section h3 { margin-bottom: 16px; color: #006847; }
    .rol-item { padding: 12px 16px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 8px; }
    .rol-info { display: flex; gap: 8px; align-items: center; font-size: 14px; }
  `],
})
export class DesasignarRolesComponent {
  private api = inject(UsuariosApiService);

  usuario = signal<Usuario | null>(null);
  rolesSeleccionados: number[] = [];
  motivo = '';
  cargando = signal(false);
  exito = signal(false);

  onUsuarioSeleccionado(u: Usuario) {
    this.usuario.set(u);
    this.rolesSeleccionados = [];
    this.exito.set(false);
  }

  toggleRol(id: number, checked: boolean) {
    if (checked) this.rolesSeleccionados.push(id);
    else this.rolesSeleccionados = this.rolesSeleccionados.filter(r => r !== id);
  }

  desasignar() {
    this.cargando.set(true);
    this.api.desasignarRoles({ rfcUsuario: this.usuario()!.rfc, rolIds: this.rolesSeleccionados, motivo: this.motivo }).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
      this.rolesSeleccionados = [];
    });
  }
}
