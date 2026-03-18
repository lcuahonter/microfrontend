import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AuthService } from '../../../core/services/auth.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const nueva = group.get('nueva')?.value;
  const confirmacion = group.get('confirmacion')?.value;
  return nueva && confirmacion && nueva !== confirmacion ? { noCoinciden: true } : null;
}

@Component({
  selector: 'vuc-cambio-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, AlertComponent,
  ],
  template: `
    <div class="page-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title><mat-icon>lock_reset</mat-icon> Cambio de Contraseña</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (!exito()) {
            <form [formGroup]="form" (ngSubmit)="guardar()" class="form-fields">
              <mat-form-field appearance="outline">
                <mat-label>Contraseña Actual</mat-label>
                <input matInput [type]="mostrar()[0] ? 'text' : 'password'" formControlName="actual">
                <button mat-icon-button matSuffix type="button" (click)="toggleMostrar(0)">
                  <mat-icon>{{ mostrar()[0] ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nueva Contraseña</mat-label>
                <input matInput [type]="mostrar()[1] ? 'text' : 'password'" formControlName="nueva" (input)="calcularFuerza()">
                <button mat-icon-button matSuffix type="button" (click)="toggleMostrar(1)">
                  <mat-icon>{{ mostrar()[1] ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-hint>Mínimo 8 caracteres, mayúsculas, números y símbolos</mat-hint>
              </mat-form-field>

              <!-- Indicador de fuerza -->
              @if (form.value.nueva) {
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill" [class]="'strength-' + fuerza()" [style.width.%]="fuerzaPct()"></div>
                  </div>
                  <span class="strength-label">{{ fuerzaLabel() }}</span>
                </div>
              }

              <mat-form-field appearance="outline">
                <mat-label>Confirmar Nueva Contraseña</mat-label>
                <input matInput [type]="mostrar()[2] ? 'text' : 'password'" formControlName="confirmacion">
                <button mat-icon-button matSuffix type="button" (click)="toggleMostrar(2)">
                  <mat-icon>{{ mostrar()[2] ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (form.hasError('noCoinciden')) {
                  <mat-error>Las contraseñas no coinciden</mat-error>
                }
              </mat-form-field>

              @if (error()) {
                <vuc-alert type="error">{{ error() }}</vuc-alert>
              }

              <div class="form-actions">
                <button mat-stroked-button type="button" routerLink="/dashboard">Cancelar</button>
                <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || cargando()">
                  @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>save</mat-icon> Cambiar Contraseña }
                </button>
              </div>
            </form>
          } @else {
            <vuc-alert type="success">Contraseña actualizada correctamente.</vuc-alert>
            <button mat-raised-button color="primary" routerLink="/dashboard">
              <mat-icon>home</mat-icon> Ir al Dashboard
            </button>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { max-width: 480px; margin: 0 auto; }
    .form-card { }
    .form-fields { display: flex; flex-direction: column; gap: 8px; padding-top: 16px; }
    .password-strength { margin-bottom: 8px; }
    .strength-bar { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
    .strength-fill { height: 100%; border-radius: 3px; transition: all 0.3s; }
    .strength-debil { background: #e53935; }
    .strength-media { background: #fb8c00; }
    .strength-fuerte { background: #43a047; }
    .strength-label { font-size: 12px; color: #666; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
  `],
})
export class CambioPasswordComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    actual: ['', Validators.required],
    nueva: ['', [Validators.required, Validators.minLength(8)]],
    confirmacion: ['', Validators.required],
  }, { validators: passwordsMatch });

  mostrar = signal([false, false, false]);
  fuerza = signal<'debil' | 'media' | 'fuerte'>('debil');
  fuerzaPct = signal(0);
  fuerzaLabel = signal('Débil');
  cargando = signal(false);
  exito = signal(false);
  error = signal('');

  toggleMostrar(i: number) {
    this.mostrar.update(arr => arr.map((v, idx) => idx === i ? !v : v));
  }

  calcularFuerza() {
    const pass = this.form.value.nueva || '';
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) { this.fuerza.set('debil'); this.fuerzaPct.set(25); this.fuerzaLabel.set('Débil'); }
    else if (score <= 2) { this.fuerza.set('media'); this.fuerzaPct.set(60); this.fuerzaLabel.set('Media'); }
    else { this.fuerza.set('fuerte'); this.fuerzaPct.set(100); this.fuerzaLabel.set('Fuerte'); }
  }

  guardar() {
    if (this.form.invalid) return;
    this.cargando.set(true);
    setTimeout(() => { this.cargando.set(false); this.exito.set(true); }, 1000);
  }
}
