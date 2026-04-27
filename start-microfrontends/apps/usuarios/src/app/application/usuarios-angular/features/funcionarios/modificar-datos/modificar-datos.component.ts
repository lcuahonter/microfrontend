import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UserSearchComponent } from '../../../shared/components/user-search/user-search.component';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-modificar-datos',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    UserSearchComponent, FielSignatureComponent, AlertComponent, StepperComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-pencil"></i> Modificar Datos de Usuario</h4>

      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      @if (paso() === 0) {
        <vuc-user-search (seleccionado)="onUsuario($event)"></vuc-user-search>
        @if (usuario()) {
          <button class="btn btn-primary mt-3" (click)="paso.set(1)">
            Editar Datos <i class="bi bi-arrow-right"></i>
          </button>
        }
      }

      @if (paso() === 1 && usuario()) {
        <h3>Editar Datos de {{ usuario()!.nombre }} {{ usuario()!.primerApellido }}</h3>
        <form [formGroup]="form" class="form-fields">
          <div class="mb-3">
            <label class="form-label">Nombre(s)</label>
            <input class="form-control" formControlName="nombre">
            @if (form.get('nombre')?.hasError('required') && form.get('nombre')?.touched) {
              <div class="invalid-feedback d-block">El nombre es requerido</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Primer Apellido</label>
            <input class="form-control" formControlName="primerApellido">
            @if (form.get('primerApellido')?.hasError('required') && form.get('primerApellido')?.touched) {
              <div class="invalid-feedback d-block">El primer apellido es requerido</div>
            }
          </div>
          <div class="mb-3">
            <label class="form-label">Segundo Apellido</label>
            <input class="form-control" formControlName="segundoApellido">
          </div>
        </form>
        <div class="step-nav">
          <button class="btn btn-outline-primary" (click)="paso.set(0)"><i class="bi bi-arrow-left"></i> Anterior</button>
          <button class="btn btn-primary" (click)="paso.set(2)" [disabled]="form.invalid">
            Confirmar con e.firma <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      }

      @if (paso() === 2) {
        <h3>Confirme los cambios con su e.firma</h3>
        <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
        @if (fielData) {
          <button class="btn btn-primary mt-3" (click)="guardar()" [disabled]="cargando()">
            @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
            @else { <i class="bi bi-save"></i> Guardar Cambios }
          </button>
        }
        @if (exito()) {
          <vuc-alert type="success">Datos actualizados correctamente.</vuc-alert>
        }
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 640px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
  `],
})
export class ModificarDatosComponent {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  paso = signal(0);
  usuario = signal<Usuario | null>(null);
  fielData: unknown = null;
  cargando = signal(false);
  exito = signal(false);

  readonly pasos: WizardStep[] = [
    { label: 'Buscar', icon: 'search' },
    { label: 'Editar', icon: 'edit' },
    { label: 'Confirmar', icon: 'security' },
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    primerApellido: ['', Validators.required],
    segundoApellido: [''],
  });

  onUsuario(u: Usuario) {
    this.usuario.set(u);
    this.form.patchValue({ nombre: u.nombre, primerApellido: u.primerApellido, segundoApellido: u.segundoApellido });
  }

  onFirmado(data: unknown) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    this.api.modificarDatos(this.usuario()!.rfc, {
      nombre: this.form.value.nombre!,
      primerApellido: this.form.value.primerApellido!,
      segundoApellido: this.form.value.segundoApellido || undefined,
    }).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
    });
  }
}
