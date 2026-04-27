import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../shared/components/fiel-signature/fiel-signature.component';
import { UserSearchComponent } from '../../shared/components/user-search/user-search.component';
import { Usuario } from '../../core/models/usuario.model';
import { UsuariosApiService } from '../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-persona-oir-recibir',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    StepperComponent, AlertComponent,
    UserSearchComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <h4 class="page-title"><i class="bi bi-telephone"></i> Persona Autorizada para Oír y Recibir</h4>
      <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

      @if (paso() === 0) {
        <h3>Buscar Usuario</h3>
        <vuc-user-search (seleccionado)="usuario.set($event)"></vuc-user-search>
        @if (usuario()) {
          <button class="btn btn-primary mt-3" (click)="paso.set(1)">
            Continuar <i class="bi bi-arrow-right"></i>
          </button>
        }
      }

      @if (paso() === 1) {
        <h3>Datos de la Persona Autorizada</h3>
        <form [formGroup]="form" class="form-fields">
          <div class="mb-3">
            <label class="form-label">Nombre(s)</label>
            <input class="form-control" formControlName="nombre">
          </div>
          <div class="mb-3">
            <label class="form-label">Primer Apellido</label>
            <input class="form-control" formControlName="primerApellido">
          </div>
          <div class="mb-3">
            <label class="form-label">Segundo Apellido</label>
            <input class="form-control" formControlName="segundoApellido">
          </div>
          <div class="mb-3">
            <label class="form-label">Correo Electrónico</label>
            <input class="form-control" formControlName="correo" type="email">
          </div>
          <div class="mb-3">
            <label class="form-label">Teléfono (opcional)</label>
            <input class="form-control" formControlName="telefono" maxlength="10">
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
        <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
        @if (exito()) { <vuc-alert type="success">Persona autorizada registrada correctamente.</vuc-alert> }
        @if (fielData) {
          <button class="btn btn-primary mt-3" (click)="guardar()" [disabled]="cargando()">
            @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
            @else { <i class="bi bi-save"></i> Registrar Persona }
          </button>
        }
      }

      @if (paso() === 3 && exito()) {
        <vuc-alert type="success">Registro completado exitosamente.</vuc-alert>
      }
    </div>
  `,
  styles: [`
    .page-container { max-width: 600px; margin: 0 auto; }
    .page-title { display: flex; align-items: center; gap: 8px; color: #1a2035; margin-bottom: 24px; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .step-nav { display: flex; gap: 12px; margin-top: 16px; }
  `],
})
export class PersonaOirRecibirComponent {
  private api = inject(UsuariosApiService);
  private fb = inject(FormBuilder);

  paso = signal(0);
  usuario = signal<Usuario | null>(null);
  fielData: unknown = null;
  cargando = signal(false);
  exito = signal(false);

  readonly pasos: WizardStep[] = [
    { label: 'Usuario', icon: 'person' },
    { label: 'Datos', icon: 'badge' },
    { label: 'e.firma', icon: 'security' },
    { label: 'Listo', icon: 'check' },
  ];

  form = this.fb.group({
    nombre: ['', Validators.required],
    primerApellido: ['', Validators.required],
    segundoApellido: [''],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
  });

  onFirmado(data: unknown) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const DTO = {
      nombre: this.form.value.nombre!,
      primerApellido: this.form.value.primerApellido!,
      segundoApellido: this.form.value.segundoApellido || undefined,
      correo: this.form.value.correo!,
      telefono: this.form.value.telefono || undefined,
      activo: true,
      fechaAlta: new Date().toISOString().split('T')[0],
    };
    this.api.altaPersonaOirRecibir(this.usuario()!.rfc, DTO).subscribe(() => {
      this.cargando.set(false);
      this.exito.set(true);
      this.paso.set(3);
    });
  }
}
