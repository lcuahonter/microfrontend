import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { TipoNacionalidad, TipoPersona } from '../../../core/models/usuario.model';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { Router } from '@angular/router';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

@Component({
  selector: 'vuc-registro-wizard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    StepperComponent, AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="wizard-container">
      <div class="card wizard-card">
        <div class="card-header">
          <h5 class="card-title">Registro de Usuario VUCEM</h5>
          <p class="card-subtitle text-muted mb-0">Complete todos los pasos para registrarse</p>
        </div>
        <div class="card-body">
          <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

          <!-- PASO 0: Nacionalidad y tipo -->
          @if (paso() === 0) {
            <div class="wizard-step">
              <h3>Tipo de Persona y Nacionalidad</h3>
              <div class="mb-3">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="tipoPersona" id="tpFisica" value="FISICA" [formControl]="tipoPersonaCtrl">
                  <label class="form-check-label" for="tpFisica">Persona Física</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="tipoPersona" id="tpMoral" value="MORAL" [formControl]="tipoPersonaCtrl">
                  <label class="form-check-label" for="tpMoral">Persona Moral</label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="tipoNac" id="tnMex" value="MEXICANO" [formControl]="tipoNacionalidadCtrl">
                  <label class="form-check-label" for="tnMex">Mexicano</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="tipoNac" id="tnExt" value="EXTRANJERO" [formControl]="tipoNacionalidadCtrl">
                  <label class="form-check-label" for="tnExt">Extranjero</label>
                </div>
              </div>
            </div>
          }

          <!-- PASO 1: Datos personales -->
          @if (paso() === 1) {
            <div class="wizard-step">
              <h3>Datos Personales</h3>
              <form [formGroup]="formDatos" class="wizard-form">
                <div class="mb-3">
                  <label class="form-label">RFC</label>
                  <input class="form-control text-uppercase" formControlName="rfc" maxlength="13" placeholder="AAAA000000XX0">
                  @if (formDatos.get('rfc')?.hasError('required') && formDatos.get('rfc')?.touched) {
                    <div class="invalid-feedback d-block">El RFC es requerido</div>
                  }
                </div>
                @if (tipoPersonaCtrl.value === 'FISICA' && tipoNacionalidadCtrl.value === 'MEXICANO') {
                  <div class="mb-3">
                    <label class="form-label">CURP</label>
                    <input class="form-control text-uppercase" formControlName="curp" maxlength="18">
                  </div>
                }
                <div class="mb-3">
                  <label class="form-label">{{ tipoPersonaCtrl.value === 'MORAL' ? 'Razón Social' : 'Nombre(s)' }}</label>
                  <input class="form-control" formControlName="nombre">
                  @if (formDatos.get('nombre')?.hasError('required') && formDatos.get('nombre')?.touched) {
                    <div class="invalid-feedback d-block">Este campo es requerido</div>
                  }
                </div>
                @if (tipoPersonaCtrl.value === 'FISICA') {
                  <div class="mb-3">
                    <label class="form-label">Primer Apellido</label>
                    <input class="form-control" formControlName="primerApellido">
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Segundo Apellido</label>
                    <input class="form-control" formControlName="segundoApellido">
                  </div>
                }
              </form>
            </div>
          }

          <!-- PASO 2: Correo -->
          @if (paso() === 2) {
            <div class="wizard-step">
              <h3>Correo Electrónico</h3>
              <vuc-alert type="info">El correo será utilizado para notificaciones de sus trámites.</vuc-alert>
              <form [formGroup]="formCorreo" class="wizard-form">
                <div class="mb-3">
                  <label class="form-label">Correo Electrónico</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input class="form-control" formControlName="correo" type="email">
                  </div>
                  @if (formCorreo.get('correo')?.hasError('email')) {
                    <div class="invalid-feedback d-block">Formato de correo incorrecto</div>
                  }
                </div>
                <div class="mb-3">
                  <label class="form-label">Confirmar Correo</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                    <input class="form-control" formControlName="confirmacion" type="email">
                  </div>
                  @if (formCorreo.hasError('noCoincide')) {
                    <div class="invalid-feedback d-block">Los correos no coinciden</div>
                  }
                </div>
              </form>
            </div>
          }

          <!-- PASO 3: Términos y condiciones -->
          @if (paso() === 3) {
            <div class="wizard-step">
              <h3>Términos y Condiciones</h3>
              <div class="terminos-box">
                <p>Al registrarse en la Ventanilla Única de Comercio Exterior Mexicana (VUCEM), acepta los siguientes términos:</p>
                <ul>
                  <li>Proporcionar información veraz y actualizada.</li>
                  <li>Mantener la confidencialidad de sus credenciales.</li>
                  <li>Usar el sistema únicamente para trámites legales de comercio exterior.</li>
                  <li>Notificar cualquier uso no autorizado de su cuenta.</li>
                </ul>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="aceptaTerminos" [formControl]="aceptaTerminosCtrl">
                <label class="form-check-label" for="aceptaTerminos">
                  Acepto los términos y condiciones de uso de VUCEM
                </label>
              </div>
            </div>
          }

          <!-- PASO 4: e.firma -->
          @if (paso() === 4) {
            <div class="wizard-step">
              <h3>Firma Electrónica</h3>
              <vuc-alert type="info">Para completar el registro debe firmar con su e.firma (FIEL).</vuc-alert>
              <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
            </div>
          }

          <!-- PASO 5: Confirmación -->
          @if (paso() === 5) {
            <div class="wizard-step">
              @if (registroExitoso()) {
                <div class="success-container">
                  <i class="bi bi-check-circle success-icon"></i>
                  <h4>¡Registro Exitoso!</h4>
                  <p>Su cuenta ha sido creada. Revise su correo electrónico para confirmar su registro.</p>
                  <button class="btn btn-primary" (click)="irAlLogin()">
                    <i class="bi bi-box-arrow-in-right"></i> Ir al Inicio de Sesión
                  </button>
                </div>
              } @else {
                <h3>Confirmar Registro</h3>
                <div class="resumen">
                  <p><strong>Tipo:</strong> {{ tipoPersonaCtrl.value }} | {{ tipoNacionalidadCtrl.value }}</p>
                  <p><strong>RFC:</strong> {{ formDatos.value.rfc }}</p>
                  <p><strong>Nombre:</strong> {{ formDatos.value.nombre }} {{ formDatos.value.primerApellido }}</p>
                  <p><strong>Correo:</strong> {{ formCorreo.value.correo }}</p>
                </div>
              }
            </div>
          }

          <!-- Navegación -->
          @if (!registroExitoso()) {
            <div class="wizard-nav">
              @if (paso() > 0) {
                <button class="btn btn-outline-primary" (click)="retroceder()">
                  <i class="bi bi-arrow-left"></i> Anterior
                </button>
              }
              <span class="flex-grow-1"></span>
              @if (paso() < pasos.length - 1) {
                <button class="btn btn-primary" (click)="avanzar()" [disabled]="!puedeContinuar()">
                  Siguiente <i class="bi bi-arrow-right"></i>
                </button>
              } @else {
                <button class="btn btn-primary" (click)="registrar()" [disabled]="cargando()">
                  @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
                  @else { <i class="bi bi-person-check"></i> Registrar }
                </button>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wizard-container { max-width: 720px; margin: 0 auto; }
    .wizard-step h3 { color: #404041; margin-bottom: 16px; }
    .wizard-form { display: flex; flex-direction: column; gap: 8px; }
    .terminos-box { padding: 16px; background: #f8f9fa; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .wizard-nav { display: flex; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #dee2e6; }
    .success-container { text-align: center; padding: 32px; }
    .success-icon { font-size: 72px; color: #2e7d32; display: block; margin-bottom: 16px; }
    .success-container h4 { color: #2e7d32; }
    .resumen { background: #f8f9fa; padding: 16px; border-radius: 8px; }
    .resumen p { margin: 4px 0; }
  `],
})
export class RegistroWizardComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsuariosApiService);
  private router = inject(Router);

  paso = signal(0);
  tipoPersonaCtrl = new FormControl('FISICA');
  tipoNacionalidadCtrl = new FormControl('MEXICANO');
  aceptaTerminosCtrl = new FormControl(false);
  cargando = signal(false);
  registroExitoso = signal(false);
  fielData: unknown = null;

  readonly pasos: WizardStep[] = [
    { label: 'Tipo', icon: 'person' },
    { label: 'Datos', icon: 'badge' },
    { label: 'Correo', icon: 'email' },
    { label: 'Términos', icon: 'gavel' },
    { label: 'e.firma', icon: 'security' },
    { label: 'Confirmar', icon: 'check' },
  ];

  formDatos = this.fb.group({
    rfc: ['', Validators.required],
    curp: [''],
    nombre: ['', Validators.required],
    primerApellido: [''],
    segundoApellido: [''],
  });

  formCorreo = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    confirmacion: ['', Validators.required],
  });

  puedeContinuar(): boolean {
    if (this.paso() === 1) { return this.formDatos.valid; }
    if (this.paso() === 2) { return this.formCorreo.valid && this.formCorreo.value.correo === this.formCorreo.value.confirmacion; }
    if (this.paso() === 3) { return Boolean(this.aceptaTerminosCtrl.value); }
    if (this.paso() === 4) { return Boolean(this.fielData); }
    return true;
  }

  avanzar() { if (this.puedeContinuar()) { this.paso.update(p => p + 1); } }
  retroceder() { this.paso.update(p => p - 1); }

  onFirmado(data: unknown) { this.fielData = data; }

  registrar() {
    this.cargando.set(true);
    const DTO = {
      rfc: this.formDatos.value.rfc!,
      curp: this.formDatos.value.curp || undefined,
      nombre: this.formDatos.value.nombre!,
      primerApellido: this.formDatos.value.primerApellido || '',
      segundoApellido: this.formDatos.value.segundoApellido || undefined,
      correo: this.formCorreo.value.correo!,
      confirmacionCorreo: this.formCorreo.value.confirmacion!,
      tipoPersona: this.tipoPersonaCtrl.value as TipoPersona,
      tipoNacionalidad: this.tipoNacionalidadCtrl.value as TipoNacionalidad,
      aceptaTerminos: Boolean(this.aceptaTerminosCtrl.value),
    };
    this.api.registrarUsuario(DTO).subscribe(() => {
      this.cargando.set(false);
      this.registroExitoso.set(true);
    });
  }

  irAlLogin() { this.router.navigate(['/login']); }
}
