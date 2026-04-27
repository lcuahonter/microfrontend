import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const NUEVA = group.get('nueva')?.value;
  const CONFIRMACION = group.get('confirmacion')?.value;
  return NUEVA && CONFIRMACION && NUEVA !== CONFIRMACION ? { noCoinciden: true } : null;
}

@Component({
  selector: 'vuc-cambio-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    AlertComponent,
  ],
  template: `
    <div class="page-container">
      <div class="card form-card">
        <div class="card-header">
          <h5 class="card-title"><i class="bi bi-key"></i> Cambio de Contraseña</h5>
        </div>
        <div class="card-body">
          @if (!exito()) {
            <form [formGroup]="form" (ngSubmit)="guardar()" class="form-fields">
              <div class="mb-3">
                <label class="form-label">Contraseña Actual</label>
                <div class="input-group">
                  <input class="form-control" [type]="mostrar()[0] ? 'text' : 'password'" formControlName="actual">
                  <button class="btn btn-outline-secondary" type="button" (click)="toggleMostrar(0)">
                    <i class="bi" [class.bi-eye]="!mostrar()[0]" [class.bi-eye-slash]="mostrar()[0]"></i>
                  </button>
                </div>
                @if (form.get('actual')?.hasError('required') && form.get('actual')?.touched) {
                  <div class="invalid-feedback d-block">La contraseña actual es requerida</div>
                }
              </div>

              <div class="mb-3">
                <label class="form-label">Nueva Contraseña</label>
                <div class="input-group">
                  <input class="form-control" [type]="mostrar()[1] ? 'text' : 'password'" formControlName="nueva" (input)="calcularFuerza()">
                  <button class="btn btn-outline-secondary" type="button" (click)="toggleMostrar(1)">
                    <i class="bi" [class.bi-eye]="!mostrar()[1]" [class.bi-eye-slash]="mostrar()[1]"></i>
                  </button>
                </div>
                <div class="form-text">Mínimo 8 caracteres, mayúsculas, números y símbolos</div>
                @if (form.get('nueva')?.hasError('required') && form.get('nueva')?.touched) {
                  <div class="invalid-feedback d-block">La nueva contraseña es requerida</div>
                }
                @if (form.get('nueva')?.hasError('minlength') && form.get('nueva')?.touched) {
                  <div class="invalid-feedback d-block">Mínimo 8 caracteres</div>
                }
              </div>

              <!-- Indicador de fuerza -->
              @if (form.value.nueva) {
                <div class="password-strength">
                  <div class="strength-bar">
                    <div class="strength-fill" [class]="'strength-' + fuerza()" [style.width.%]="fuerzaPct()"></div>
                  </div>
                  <span class="strength-label">{{ fuerzaLabel() }}</span>
                </div>
              }

              <div class="mb-3">
                <label class="form-label">Confirmar Nueva Contraseña</label>
                <div class="input-group">
                  <input class="form-control" [type]="mostrar()[2] ? 'text' : 'password'" formControlName="confirmacion">
                  <button class="btn btn-outline-secondary" type="button" (click)="toggleMostrar(2)">
                    <i class="bi" [class.bi-eye]="!mostrar()[2]" [class.bi-eye-slash]="mostrar()[2]"></i>
                  </button>
                </div>
                @if (form.hasError('noCoinciden')) {
                  <div class="invalid-feedback d-block">Las contraseñas no coinciden</div>
                }
              </div>

              @if (error()) {
                <vuc-alert type="error">{{ error() }}</vuc-alert>
              }

              <div class="form-actions">
                <button class="btn btn-outline-primary" type="button" routerLink="/dashboard">Cancelar</button>
                <button class="btn btn-primary" type="submit" [disabled]="form.invalid || cargando()">
                  @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
                  @else { <i class="bi bi-save"></i> Cambiar Contraseña }
                </button>
              </div>
            </form>
          } @else {
            <vuc-alert type="success">Contraseña actualizada correctamente.</vuc-alert>
            <button class="btn btn-primary" routerLink="/dashboard">
              <i class="bi bi-house"></i> Ir al Dashboard
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 480px; margin: 0 auto; }
    .form-fields { display: flex; flex-direction: column; gap: 8px; padding-top: 16px; }
    .password-strength { margin-bottom: 8px; }
    .strength-bar { height: 6px; background: #dee2e6; border-radius: 3px; overflow: hidden; margin-bottom: 4px; }
    .strength-fill { height: 100%; border-radius: 3px; transition: all 0.3s; }
    .strength-debil { background: #a94442; }
    .strength-media { background: #8a6d3b; }
    .strength-fuerte { background: #2e7d32; }
    .strength-label { font-size: 12px; color: #6c757d; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
  `],
})
export class CambioPasswordComponent {
  private fb = inject(FormBuilder);

  mostrar = signal([false, false, false]);
  fuerza = signal<'debil' | 'media' | 'fuerte'>('debil');
  fuerzaPct = signal(0);
  fuerzaLabel = signal('Débil');
  cargando = signal(false);
  exito = signal(false);
  error = signal('');

  form = this.fb.group({
    actual: ['', Validators.required],
    nueva: ['', [Validators.required, Validators.minLength(8)]],
    confirmacion: ['', Validators.required],
  }, { validators: passwordsMatch });

  toggleMostrar(i: number) {
    this.mostrar.update(arr => arr.map((v, idx) => idx === i ? !v : v));
  }

  calcularFuerza() {
    const PASS = this.form.value.nueva || '';
    let score = 0;
    if (PASS.length >= 8) { score++; }
    if (/[A-Z]/.test(PASS)) { score++; }
    if (/[0-9]/.test(PASS)) { score++; }
    if (/[^A-Za-z0-9]/.test(PASS)) { score++; }
    if (score <= 1) { this.fuerza.set('debil'); this.fuerzaPct.set(25); this.fuerzaLabel.set('Débil'); }
    else if (score <= 2) { this.fuerza.set('media'); this.fuerzaPct.set(60); this.fuerzaLabel.set('Media'); }
    else { this.fuerza.set('fuerte'); this.fuerzaPct.set(100); this.fuerzaLabel.set('Fuerte'); }
  }

  guardar() {
    if (this.form.invalid) { return; }
    this.cargando.set(true);
    setTimeout(() => { this.cargando.set(false); this.exito.set(true); }, 1000);
  }
}
