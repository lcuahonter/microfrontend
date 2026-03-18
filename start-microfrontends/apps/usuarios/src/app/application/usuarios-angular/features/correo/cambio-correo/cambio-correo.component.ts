import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StepperComponent, WizardStep } from '../../../shared/components/stepper/stepper.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'vuc-cambio-correo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
    StepperComponent, AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title><mat-icon>email</mat-icon> Cambio de Correo Electrónico</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <vuc-stepper [pasos]="pasos" [pasoActual]="paso()" (pasoClick)="paso.set($event)"></vuc-stepper>

          <!-- PASO 0: Nuevo correo -->
          @if (paso() === 0) {
            <h3>Ingrese el Nuevo Correo</h3>
            <vuc-alert type="info">El cambio requiere confirmación con su e.firma.</vuc-alert>
            <form [formGroup]="form" class="form-fields">
              <mat-form-field appearance="outline">
                <mat-label>Correo Actual</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput [value]="auth.usuario()?.correo || ''" readonly>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Nuevo Correo</mat-label>
                <mat-icon matPrefix>email</mat-icon>
                <input matInput formControlName="correoNuevo" type="email">
                @if (form.get('correoNuevo')?.hasError('email')) {
                  <mat-error>Formato incorrecto</mat-error>
                }
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Confirmar Nuevo Correo</mat-label>
                <input matInput formControlName="confirmacion" type="email">
              </mat-form-field>
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
                <mat-icon style="font-size:64px;color:#43a047">check_circle</mat-icon>
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
                <button mat-stroked-button (click)="paso.update(p => p - 1)"><mat-icon>arrow_back</mat-icon> Anterior</button>
              }
              <span style="flex:1"></span>
              @if (paso() === 0) {
                <button mat-raised-button color="primary" (click)="paso.set(1)" [disabled]="form.invalid">
                  Siguiente <mat-icon>arrow_forward</mat-icon>
                </button>
              }
              @if (paso() === 1 && fielData) {
                <button mat-raised-button color="primary" (click)="guardar()" [disabled]="cargando()">
                  @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>save</mat-icon> Guardar Cambio }
                </button>
              }
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { max-width: 560px; margin: 0 auto; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .step-nav { display: flex; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e0e0; }
    .success-center { text-align: center; padding: 24px; }
  `],
})
export class CambioCorreoComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsuariosApiService);
  auth = inject(AuthService);

  paso = signal(0);
  cargando = signal(false);
  exito = signal(false);
  fielData: any = null;

  pasos: WizardStep[] = [
    { label: 'Nuevo Correo', icon: 'email' },
    { label: 'e.firma', icon: 'security' },
    { label: 'Resultado', icon: 'check' },
  ];

  form = this.fb.group({
    correoNuevo: ['', [Validators.required, Validators.email]],
    confirmacion: ['', Validators.required],
  });

  onFirmado(data: any) { this.fielData = data; }

  guardar() {
    this.cargando.set(true);
    const dto = {
      rfcUsuario: this.auth.usuario()!.rfc,
      correoActual: this.auth.usuario()!.correo,
      correoNuevo: this.form.value.correoNuevo!,
      confirmacionCorreo: this.form.value.confirmacion!,
    };
    this.api.cambiarCorreo(dto).subscribe({
      next: () => { this.cargando.set(false); this.exito.set(true); this.paso.set(2); },
      error: () => { this.cargando.set(false); this.paso.set(2); },
    });
  }
}
