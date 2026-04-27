import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { Router } from '@angular/router';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'vuc-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="login-container">
      <!-- Panel izquierdo -->
      <div class="login-left">
        <div class="login-brand">
          <i class="bi bi-globe login-brand__icon"></i>
          <h1>VUCEM</h1>
          <p>Ventanilla Única de Comercio Exterior Mexicana</p>
        </div>
        <div class="login-info">
          <div class="login-info__item">
            <i class="bi bi-patch-check"></i>
            <span>Trámites seguros y confiables</span>
          </div>
          <div class="login-info__item">
            <i class="bi bi-clock"></i>
            <span>Disponible 24/7</span>
          </div>
          <div class="login-info__item">
            <i class="bi bi-shield-lock"></i>
            <span>Protección con e.firma</span>
          </div>
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="login-right">
        <div class="login-form-container">
          <h3 class="login-title">Iniciar Sesión</h3>
          <p class="login-subtitle">Módulo de Administración de Usuarios</p>

          <!-- Tabs Bootstrap -->
          <ul class="nav nav-tabs mb-3" id="loginTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link" [class.active]="tabActivo() === 'password'"
                      (click)="tabActivo.set('password')" type="button">
                Contraseña
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" [class.active]="tabActivo() === 'fiel'"
                      (click)="tabActivo.set('fiel')" type="button">
                e.firma (FIEL)
              </button>
            </li>
          </ul>

          <!-- Tab: Contraseña -->
          @if (tabActivo() === 'password') {
            <form [formGroup]="formPassword" (ngSubmit)="loginPassword()" class="login-form">
              <div class="mb-3">
                <label class="form-label">RFC</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person-badge"></i></span>
                  <input class="form-control text-uppercase" formControlName="rfc" placeholder="AAAA000000XX0" maxlength="13">
                </div>
                @if (formPassword.get('rfc')?.hasError('required') && formPassword.get('rfc')?.touched) {
                  <div class="invalid-feedback d-block">El RFC es requerido</div>
                }
              </div>

              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-lock"></i></span>
                  <input class="form-control" [type]="mostrarPass() ? 'text' : 'password'" formControlName="password">
                  <button class="btn btn-sm btn-link p-0 input-group-text" type="button" (click)="mostrarPass.set(!mostrarPass())">
                    <i class="bi" [class.bi-eye]="!mostrarPass()" [class.bi-eye-slash]="mostrarPass()"></i>
                  </button>
                </div>
                @if (formPassword.get('password')?.hasError('required') && formPassword.get('password')?.touched) {
                  <div class="invalid-feedback d-block">La contraseña es requerida</div>
                }
              </div>

              @if (error()) {
                <vuc-alert type="error">{{ error() }}</vuc-alert>
              }

              <button class="btn btn-primary login-btn" type="submit"
                      [disabled]="cargando() || formPassword.invalid">
                @if (cargando()) {
                  <div class="spinner-border spinner-border-sm text-light" role="status"></div>
                } @else {
                  <i class="bi bi-box-arrow-in-right"></i> Ingresar
                }
              </button>

              <a class="login-forgot" routerLink="/password/recuperar">¿Olvidó su contraseña?</a>
            </form>

            <!-- Hint demo -->
            <div class="login-demo">
              <strong>Usuarios de prueba:</strong><br>
              RFC: GOMA800101AB1 / PERA750605CD2<br>
              Contraseña: cualquier texto
            </div>
          }

          <!-- Tab: e.firma -->
          @if (tabActivo() === 'fiel') {
            <div class="pt-3">
              <vuc-fiel-signature (firmado)="loginFiel($event)"></vuc-fiel-signature>
            </div>
          }

          <hr class="my-4">
          <p class="login-register">
            ¿No tiene cuenta?
            <a routerLink="/registro">Regístrese aquí</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; min-height: 100vh; }
    .login-left { flex: 1; background: linear-gradient(135deg, #006847 0%, #004d35 100%); color: white; display: flex; flex-direction: column; justify-content: center; padding: 48px; }
    .login-brand { margin-bottom: 48px; }
    .login-brand__icon { font-size: 56px; margin-bottom: 16px; color: #9FD16C; }
    .login-brand h1 { font-size: 40px; margin: 0 0 8px; font-weight: 700; }
    .login-brand p { font-size: 16px; color: #9FD16C; margin: 0; }
    .login-info__item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 15px; color: rgba(255,255,255,0.85); }
    .login-right { flex: 1; display: flex; align-items: center; justify-content: center; background: white; padding: 48px; }
    .login-form-container { width: 100%; max-width: 440px; }
    .login-title { font-weight: 700; margin: 0 0 4px; color: #1a2035; }
    .login-subtitle { color: #6c757d; margin: 0 0 32px; font-size: 14px; }
    .login-form { display: flex; flex-direction: column; gap: 8px; padding-top: 16px; }
    .login-btn { height: 48px; font-size: 15px; width: 100%; }
    .login-forgot { text-align: center; color: #006847; font-size: 13px; text-decoration: none; margin-top: 8px; display: block; }
    .login-demo { margin-top: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #6c757d; }
    .login-register { text-align: center; font-size: 14px; color: #6c757d; }
    .login-register a { color: #006847; font-weight: 600; }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  tabActivo = signal<'password' | 'fiel'>('password');
  cargando = signal(false);
  error = signal('');
  mostrarPass = signal(false);

  formPassword = this.fb.group({
    rfc: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginPassword() {
    if (this.formPassword.invalid) { return; }
    this.cargando.set(true);
    this.error.set('');
    const { rfc: RFC, password: PASSWORD } = this.formPassword.value;

    this.auth.loginConPassword(RFC!, PASSWORD!).subscribe({
      next: (res: Usuario | { error: string }) => {
        this.cargando.set(false);
        if ('error' in res) { this.error.set(res.error); return; }
        const ROLES = this.auth.rolesDisponibles();
        if (ROLES.length > 1) { this.router.navigate(['/seleccion-rol']); }
        else { this.router.navigate(['/dashboard']); }
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Error al conectar con el servidor.');
      },
    });
  }

  loginFiel(_result: unknown) {
    this.router.navigate(['/dashboard']);
  }
}
