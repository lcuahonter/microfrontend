import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { TipoPersona, TipoNacionalidad } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-registro-wizard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatRadioModule, MatCheckboxModule, MatProgressSpinnerModule, MatDividerModule,
    StepperComponent, AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="wizard-container">
      <mat-card class="wizard-card">
        <mat-card-header>
          <mat-card-title>Registro de Usuario VUCEM</mat-card-title>
          <mat-card-subtitle>Complete todos los pasos para registrarse</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

          <!-- PASO 0: Nacionalidad y tipo -->
          @if (paso() === 0) {
            <div class="wizard-step">
              <h3>Tipo de Persona y Nacionalidad</h3>
              <mat-radio-group [(ngModel)]="tipoPersona" class="radio-group">
                <mat-radio-button value="FISICA">Persona Física</mat-radio-button>
                <mat-radio-button value="MORAL">Persona Moral</mat-radio-button>
              </mat-radio-group>
              <mat-radio-group [(ngModel)]="tipoNacionalidad" class="radio-group" style="margin-top:16px">
                <mat-radio-button value="MEXICANO">Mexicano</mat-radio-button>
                <mat-radio-button value="EXTRANJERO">Extranjero</mat-radio-button>
              </mat-radio-group>
            </div>
          }

          <!-- PASO 1: Datos personales -->
          @if (paso() === 1) {
            <div class="wizard-step">
              <h3>Datos Personales</h3>
              <form [formGroup]="formDatos" class="wizard-form">
                <mat-form-field appearance="outline">
                  <mat-label>RFC</mat-label>
                  <input matInput formControlName="rfc" maxlength="13" style="text-transform:uppercase" placeholder="AAAA000000XX0">
                  @if (formDatos.get('rfc')?.hasError('required') && formDatos.get('rfc')?.touched) {
                    <mat-error>El RFC es requerido</mat-error>
                  }
                </mat-form-field>
                @if (tipoPersona === 'FISICA' && tipoNacionalidad === 'MEXICANO') {
                  <mat-form-field appearance="outline">
                    <mat-label>CURP</mat-label>
                    <input matInput formControlName="curp" maxlength="18" style="text-transform:uppercase">
                  </mat-form-field>
                }
                <mat-form-field appearance="outline">
                  <mat-label>{{ tipoPersona === 'MORAL' ? 'Razón Social' : 'Nombre(s)' }}</mat-label>
                  <input matInput formControlName="nombre">
                </mat-form-field>
                @if (tipoPersona === 'FISICA') {
                  <mat-form-field appearance="outline">
                    <mat-label>Primer Apellido</mat-label>
                    <input matInput formControlName="primerApellido">
                  </mat-form-field>
                  <mat-form-field appearance="outline">
                    <mat-label>Segundo Apellido</mat-label>
                    <input matInput formControlName="segundoApellido">
                  </mat-form-field>
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
                <mat-form-field appearance="outline">
                  <mat-label>Correo Electrónico</mat-label>
                  <mat-icon matPrefix>email</mat-icon>
                  <input matInput formControlName="correo" type="email">
                  @if (formCorreo.get('correo')?.hasError('email')) {
                    <mat-error>Formato de correo incorrecto</mat-error>
                  }
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Confirmar Correo</mat-label>
                  <mat-icon matPrefix>email</mat-icon>
                  <input matInput formControlName="confirmacion" type="email">
                  @if (formCorreo.hasError('noCoincide')) {
                    <mat-error>Los correos no coinciden</mat-error>
                  }
                </mat-form-field>
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
              <mat-checkbox [(ngModel)]="aceptaTerminos">
                Acepto los términos y condiciones de uso de VUCEM
              </mat-checkbox>
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
                  <mat-icon class="success-icon">check_circle</mat-icon>
                  <h3>¡Registro Exitoso!</h3>
                  <p>Su cuenta ha sido creada. Revise su correo electrónico para confirmar su registro.</p>
                  <button mat-raised-button color="primary" (click)="irAlLogin()">
                    <mat-icon>login</mat-icon> Ir al Inicio de Sesión
                  </button>
                </div>
              } @else {
                <h3>Confirmar Registro</h3>
                <div class="resumen">
                  <p><strong>Tipo:</strong> {{ tipoPersona }} | {{ tipoNacionalidad }}</p>
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
                <button mat-stroked-button (click)="retroceder()">
                  <mat-icon>arrow_back</mat-icon> Anterior
                </button>
              }
              <span style="flex:1"></span>
              @if (paso() < pasos.length - 1) {
                <button mat-raised-button color="primary" (click)="avanzar()" [disabled]="!puedeContinuar()">
                  Siguiente <mat-icon>arrow_forward</mat-icon>
                </button>
              } @else {
                <button mat-raised-button color="primary" (click)="registrar()" [disabled]="cargando()">
                  @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>how_to_reg</mat-icon> Registrar }
                </button>
              }
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .wizard-container { max-width: 720px; margin: 0 auto; }
    .wizard-card { }
    .wizard-step h3 { color: #006847; margin-bottom: 16px; }
    .wizard-form { display: flex; flex-direction: column; gap: 8px; }
    .radio-group { display: flex; gap: 24px; }
    .terminos-box { padding: 16px; background: #f5f5f5; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .wizard-nav { display: flex; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e0e0; }
    .success-container { text-align: center; padding: 32px; }
    .success-icon { font-size: 72px; width: 72px; height: 72px; color: #43a047; }
    .success-container h3 { font-size: 24px; color: #2e7d32; }
    .resumen { background: #f9f9f9; padding: 16px; border-radius: 8px; }
    .resumen p { margin: 4px 0; }
  `],
})
export class RegistroWizardComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsuariosApiService);
  private router = inject(Router);

  paso = signal(0);
  tipoPersona = 'FISICA';
  tipoNacionalidad = 'MEXICANO';
  aceptaTerminos = false;
  cargando = signal(false);
  registroExitoso = signal(false);
  fielData: any = null;

  pasos: WizardStep[] = [
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
    if (this.paso() === 1) return this.formDatos.valid;
    if (this.paso() === 2) return this.formCorreo.valid && this.formCorreo.value.correo === this.formCorreo.value.confirmacion;
    if (this.paso() === 3) return this.aceptaTerminos;
    if (this.paso() === 4) return !!this.fielData;
    return true;
  }

  avanzar() { if (this.puedeContinuar()) this.paso.update(p => p + 1); }
  retroceder() { this.paso.update(p => p - 1); }

  onFirmado(data: any) { this.fielData = data; }

  registrar() {
    this.cargando.set(true);
    const dto = {
      rfc: this.formDatos.value.rfc!,
      curp: this.formDatos.value.curp || undefined,
      nombre: this.formDatos.value.nombre!,
      primerApellido: this.formDatos.value.primerApellido || '',
      segundoApellido: this.formDatos.value.segundoApellido || undefined,
      correo: this.formCorreo.value.correo!,
      confirmacionCorreo: this.formCorreo.value.confirmacion!,
      tipoPersona: this.tipoPersona as TipoPersona,
      tipoNacionalidad: this.tipoNacionalidad as TipoNacionalidad,
      aceptaTerminos: this.aceptaTerminos,
    };
    this.api.registrarUsuario(dto).subscribe(() => {
      this.cargando.set(false);
      this.registroExitoso.set(true);
    });
  }

  irAlLogin() { this.router.navigate(['/login']); }
}
