import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-cambio-correo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    StepperComponent, AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title"><i class="bi bi-envelope"></i> Cambio de Correo Electrónico</h5>
        </div>
        <div class="card-body">
          <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

          <!-- PASO 0: Nuevo correo -->
          @if (paso() === 0) {
            <h3>Ingrese el Nuevo Correo</h3>
            <vuc-alert type="info">El cambio requiere confirmación con su e.firma.</vuc-alert>
            <form [formGroup]="form" class="form-fields">
              <div class="mb-3">
                <label class="form-label">Correo Actual</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input class="form-control" [value]="auth.usuario()?.correo || ''" readonly>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Nuevo Correo</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input class="form-control" formControlName="correoNuevo" type="email">
                </div>
                @if (form.get('correoNuevo')?.hasError('required') && form.get('correoNuevo')?.touched) {
                  <div class="invalid-feedback d-block">El correo es requerido</div>
                }
                @if (form.get('correoNuevo')?.hasError('email') && form.get('correoNuevo')?.touched) {
                  <div class="invalid-feedback d-block">Formato de correo incorrecto</div>
                }
              </div>
              <div class="mb-3">
                <label class="form-label">Confirmar Nuevo Correo</label>
                <input class="form-control" formControlName="confirmacion" type="email">
                @if (form.get('confirmacion')?.hasError('required') && form.get('confirmacion')?.touched) {
                  <div class="invalid-feedback d-block">Confirme el correo</div>
                }
              </div>
            </form>
          }

          <!-- PASO 1: e.firma -->
          @if (paso() === 1) {
            <h3>Confirme con su e.firma</h3>
            <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
          }

          <!-- PASO 2: Resultado -->
          @if (paso() === 2) {
            @if (exito()) {
              <div class="success-center">
                <i class="bi bi-check-circle success-icon--large"></i>
                <h3>¡Correo Actualizado!</h3>
                <p>Se envió confirmación a <strong>{{ form.value.correoNuevo }}</strong></p>
              </div>
            } @else {
              <vuc-alert type="error">Error al actualizar el correo. Intente nuevamente.</vuc-alert>
            }
          }

          <!-- Navegación -->
          @if (paso() < 2) {
            <div class="step-nav">
              @if (paso() > 0) {
                <button class="btn btn-outline-primary" (click)="paso.set(paso() - 1)"><i class="bi bi-arrow-left"></i> Anterior</button>
              }
              <span class="flex-grow-1"></span>
              @if (paso() === 0) {
                <button class="btn btn-primary" (click)="paso.set(1)" [disabled]="form.invalid">
                  Siguiente <i class="bi bi-arrow-right"></i>
                </button>
              }
              @if (paso() === 1 && fielData) {
                <button class="btn btn-primary" (click)="guardar()" [disabled]="cargando()">
                  @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
                  @else { <i class="bi bi-save"></i> Guardar Cambio }
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 560px; margin: 0 auto; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .step-nav { display: flex; margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6; }
    .success-center { text-align: center; padding: 24px; }
    .success-icon--large { font-size: 64px; color: #2e7d32; display: block; margin-bottom: 16px; }
  `],
})
export class CambioCorreoComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsuariosApiService);
  auth = inject(AuthService);

  paso = signal(0);
  cargando = signal(false);
  exito = signal(false);
  fielData: unknown = null;

  readonly pasos: WizardStep[] = [
    { label: 'Nuevo Correo', icon: 'email' },
    { label: 'e.firma', icon: 'security' },
    { label: 'Resultado', icon: 'check' },
  ];

  form = this.fb.group({
    correoNuevo: ['', [Validators.required, Validators.email]],
    confirmacion: ['', Validators.required],
  });

  onFirmado(data: unknown) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const DTO = {
      rfcUsuario: this.auth.usuario()!.rfc,
      correoActual: this.auth.usuario()!.correo,
      correoNuevo: this.form.value.correoNuevo!,
      confirmacionCorreo: this.form.value.confirmacion!,
    };
    this.api.cambiarCorreo(DTO).subscribe({
      next: () => { this.cargando.set(false); this.exito.set(true); this.paso.set(2); },
      error: () => { this.cargando.set(false); this.paso.set(2); },
    });
  }
}
