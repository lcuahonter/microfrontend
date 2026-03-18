import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { TramitesListComponent } from '../../../shared/components/tramites-list/tramites-list.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { Usuario } from '../../../core/models/usuario.model';
import { Rol, Dependencia, UnidadAdministrativa } from '../../../core/models/rol.model';

@Component({
  selector: 'vuc-asignar-roles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatCardModule, MatStepperModule,
    MatProgressSpinnerModule, UserSearchComponent, TramitesListComponent, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <h2 class="page-title"><mat-icon>manage_accounts</mat-icon> Asignar Roles</h2>

      <mat-stepper linear #stepper>
        <!-- Paso 1: Buscar usuario -->
        <mat-step label="Buscar Usuario">
          <div class="step-content">
            <vuc-user-search (seleccionado)="onUsuarioSeleccionado($event)"></vuc-user-search>
            @if (usuarioSeleccionado()) {
              <div style="margin-top:16px">
                <button mat-raised-button color="primary" matStepperNext>
                  Continuar <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            }
          </div>
        </mat-step>

        <!-- Paso 2: Seleccionar rol -->
        <mat-step label="Asignar Rol">
          <div class="step-content">
            @if (catalogos()) {
              <form [formGroup]="formRol" class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Rol</mat-label>
                  <mat-select formControlName="rolId">
                    @for (rol of catalogos()!.roles; track rol.id) {
                      <mat-option [value]="rol.id">{{ rol.nombre }} ({{ rol.tipoRol }})</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Dependencia</mat-label>
                  <mat-select formControlName="dependenciaId" (selectionChange)="onDependenciaChange($event.value)">
                    @for (dep of catalogos()!.dependencias; track dep.id) {
                      <mat-option [value]="dep.id">{{ dep.nombre }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                @if (unidadesFiltradas().length) {
                  <mat-form-field appearance="outline">
                    <mat-label>Unidad Administrativa</mat-label>
                    <mat-select formControlName="unidadId">
                      @for (ua of unidadesFiltradas(); track ua.id) {
                        <mat-option [value]="ua.id">{{ ua.nombre }}</mat-option>
                      }
                    </mat-select>
                  </mat-form-field>
                }
              </form>
            }
            <div class="step-nav">
              <button mat-stroked-button matStepperPrevious><mat-icon>arrow_back</mat-icon> Anterior</button>
              <button mat-raised-button color="primary" matStepperNext [disabled]="formRol.invalid">
                Continuar <mat-icon>arrow_forward</mat-icon>
              </button>
            </div>
          </div>
        </mat-step>

        <!-- Paso 3: Trámites -->
        <mat-step label="Asignar Trámites">
          <div class="step-content">
            <vuc-tramites-list (seleccionCambiada)="tramitesSeleccionados = $event"></vuc-tramites-list>
            @if (exito()) {
              <vuc-alert type="success">Rol asignado correctamente al usuario {{ usuarioSeleccionado()!.rfc }}</vuc-alert>
            }
            @if (error()) {
              <vuc-alert type="error">{{ error() }}</vuc-alert>
            }
            <div class="step-nav">
              <button mat-stroked-button matStepperPrevious><mat-icon>arrow_back</mat-icon> Anterior</button>
              <button mat-raised-button color="primary" (click)="guardar()" [disabled]="cargando()">
                @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
                @else { <mat-icon>save</mat-icon> Guardar Asignación }
              </button>
            </div>
          </div>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .step-content { padding: 24px 0; }
    .form-grid { display: flex; flex-direction: column; gap: 8px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
  `],
})
export class AsignarRolesComponent implements OnInit {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  usuarioSeleccionado = signal<Usuario | null>(null);
  catalogos = signal<{ roles: Rol[]; dependencias: Dependencia[]; unidades: UnidadAdministrativa[] } | null>(null);
  unidadesFiltradas = signal<UnidadAdministrativa[]>([]);
  tramitesSeleccionados: number[] = [];
  cargando = signal(false);
  exito = signal(false);
  error = signal('');

  formRol = this.fb.group({
    rolId: ['', Validators.required],
    dependenciaId: [''],
    unidadId: [''],
  });

  ngOnInit() {
    this.api.getCatalogosRoles().subscribe(cat => this.catalogos.set(cat));
  }

  onUsuarioSeleccionado(u: Usuario) { this.usuarioSeleccionado.set(u); }

  onDependenciaChange(depId: number) {
    const todas = this.catalogos()?.unidades ?? [];
    this.unidadesFiltradas.set(todas.filter(u => u.dependenciaId === depId));
  }

  guardar() {
    if (!this.usuarioSeleccionado()) return;
    this.cargando.set(true);
    const dto = {
      rfcUsuario: this.usuarioSeleccionado()!.rfc,
      rolId: +this.formRol.value.rolId!,
      dependenciaId: this.formRol.value.dependenciaId ? +this.formRol.value.dependenciaId : undefined,
      unidadAdministrativaId: this.formRol.value.unidadId ? +this.formRol.value.unidadId : undefined,
      tramiteIds: this.tramitesSeleccionados,
    };
    this.api.asignarRol(dto).subscribe({
      next: () => { this.cargando.set(false); this.exito.set(true); },
      error: () => { this.cargando.set(false); this.error.set('Error al asignar el rol.'); },
    });
  }
}
