import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Dependencia, Rol, UnidadAdministrativa } from '../../../core/models/rol.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { TramitesListComponent } from '../../../shared/components/tramites-list/tramites-list.component';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-asignar-roles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    UserSearchComponent, TramitesListComponent, AlertComponent, StepperComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-person-gear"></i> Asignar Roles</h4>

      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="irPaso($event)"></vuc-stepper>

      <!-- Paso 0: Buscar usuario -->
      @if (paso() === 0) {
        <div class="step-content">
          <vuc-user-search (seleccionado)="onUsuarioSeleccionado($event)"></vuc-user-search>
          @if (usuarioSeleccionado()) {
            <div class="mt-3">
              <button class="btn btn-primary" (click)="paso.set(1)">
                Continuar <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          }
        </div>
      }

      <!-- Paso 1: Seleccionar rol -->
      @if (paso() === 1) {
        <div class="step-content">
          @if (catalogos()) {
            <form [formGroup]="formRol" class="form-grid">
              <div class="mb-3">
                <label class="form-label">Rol</label>
                <select class="form-select" formControlName="rolId">
                  <option value="">-- Seleccione --</option>
                  @for (rol of catalogos()!.roles; track rol.id) {
                    <option [value]="rol.id">{{ rol.nombre }} ({{ rol.tipoRol }})</option>
                  }
                </select>
                @if (formRol.get('rolId')?.hasError('required') && formRol.get('rolId')?.touched) {
                  <div class="invalid-feedback d-block">Debe seleccionar un rol</div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Dependencia</label>
                <select class="form-select" formControlName="dependenciaId" (change)="onDependenciaChange($event)">
                  <option value="">-- Seleccione --</option>
                  @for (dep of catalogos()!.dependencias; track dep.id) {
                    <option [value]="dep.id">{{ dep.nombre }}</option>
                  }
                </select>
              </div>
              @if (unidadesFiltradas().length) {
                <div class="mb-3">
                  <label class="form-label">Unidad Administrativa</label>
                  <select class="form-select" formControlName="unidadId">
                    <option value="">-- Seleccione --</option>
                    @for (ua of unidadesFiltradas(); track ua.id) {
                      <option [value]="ua.id">{{ ua.nombre }}</option>
                    }
                  </select>
                </div>
              }
            </form>
          }
          <div class="step-nav">
            <button class="btn btn-outline-primary" (click)="paso.set(0)"><i class="bi bi-arrow-left"></i> Anterior</button>
            <button class="btn btn-primary" (click)="paso.set(2)" [disabled]="formRol.invalid">
              Continuar <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      }

      <!-- Paso 2: Trámites -->
      @if (paso() === 2) {
        <div class="step-content">
          <vuc-tramites-list (seleccionCambiada)="tramitesSeleccionados = $event"></vuc-tramites-list>
          @if (exito()) {
            <vuc-alert type="success">Rol asignado correctamente al usuario {{ usuarioSeleccionado()!.rfc }}</vuc-alert>
          }
          @if (error()) {
            <vuc-alert type="error">{{ error() }}</vuc-alert>
          }
          <div class="step-nav">
            <button class="btn btn-outline-primary" (click)="paso.set(1)"><i class="bi bi-arrow-left"></i> Anterior</button>
            <button class="btn btn-primary" (click)="guardar()" [disabled]="cargando()">
              @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
              @else { <i class="bi bi-save"></i> Guardar Asignación }
            </button>
          </div>
        </div>
      }
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

  paso = signal(0);
  usuarioSeleccionado = signal<Usuario | null>(null);
  catalogos = signal<{ roles: Rol[]; dependencias: Dependencia[]; unidades: UnidadAdministrativa[] } | null>(null);
  unidadesFiltradas = signal<UnidadAdministrativa[]>([]);
  tramitesSeleccionados: number[] = [];
  cargando = signal(false);
  exito = signal(false);
  error = signal('');

  readonly pasos: WizardStep[] = [
    { label: 'Buscar Usuario', icon: 'search' },
    { label: 'Asignar Rol', icon: 'badge' },
    { label: 'Asignar Trámites', icon: 'assignment' },
  ];

  formRol = this.fb.group({
    rolId: ['', Validators.required],
    dependenciaId: [''],
    unidadId: [''],
  });

  ngOnInit() {
    this.api.getCatalogosRoles().subscribe(cat => this.catalogos.set(cat));
  }

  irPaso(i: number) { if (i < this.paso()) { this.paso.set(i); } }

  onUsuarioSeleccionado(u: Usuario) { this.usuarioSeleccionado.set(u); }

  onDependenciaChange(event: Event) {
    const DEP_ID = Number((event.target as HTMLSelectElement).value);
    const TODAS = this.catalogos()?.unidades ?? [];
    this.unidadesFiltradas.set(TODAS.filter(u => u.dependenciaId === DEP_ID));
    this.formRol.patchValue({ unidadId: '' });
  }

  guardar() {
    if (!this.usuarioSeleccionado()) { return; }
    this.cargando.set(true);
    const DTO = {
      rfcUsuario: this.usuarioSeleccionado()!.rfc,
      rolId: Number(this.formRol.value.rolId!),
      dependenciaId: this.formRol.value.dependenciaId ? Number(this.formRol.value.dependenciaId) : undefined,
      unidadAdministrativaId: this.formRol.value.unidadId ? Number(this.formRol.value.unidadId) : undefined,
      tramiteIds: this.tramitesSeleccionados,
    };
    this.api.asignarRol(DTO).subscribe({
      next: () => { this.cargando.set(false); this.exito.set(true); },
      error: () => { this.cargando.set(false); this.error.set('Error al asignar el rol.'); },
    });
  }
}
