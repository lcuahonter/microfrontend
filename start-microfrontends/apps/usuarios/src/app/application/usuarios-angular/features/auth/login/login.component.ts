import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'vuc-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatTabsModule, MatProgressSpinnerModule,
    MatDividerModule, AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="login-container">
      <!-- Panel izquierdo -->
      <div class="login-left">
        <div class="login-brand">
          <mat-icon class="login-brand__icon">language</mat-icon>
          <h1>VUCEM</h1>
          <p>Ventanilla Única de Comercio Exterior Mexicana</p>
        </div>
        <div class="login-info">
          <div class="login-info__item">
            <mat-icon>verified</mat-icon>
            <span>Trámites seguros y confiables</span>
          </div>
          <div class="login-info__item">
            <mat-icon>access_time</mat-icon>
            <span>Disponible 24/7</span>
          </div>
          <div class="login-info__item">
            <mat-icon>security</mat-icon>
            <span>Protección con e.firma</span>
          </div>
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="login-right">
        <div class="login-form-container">
          <h2 class="login-title">Iniciar Sesión</h2>
          <p class="login-subtitle">Módulo de Administración de Usuarios</p>

          <mat-tab-group>
            <!-- Tab: Contraseña -->
            <mat-tab label="Contraseña">
              <form [formGroup]="formPassword" (ngSubmit)="loginPassword()" class="login-form">
                <mat-form-field appearance="outline">
                  <mat-label>RFC</mat-label>
                  <mat-icon matPrefix>badge</mat-icon>
                  <input matInput formControlName="rfc" placeholder="AAAA000000XX0" maxlength="13" style="text-transform:uppercase">
                  @if (formPassword.get('rfc')?.hasError('required') && formPassword.get('rfc')?.touched) {
                    <mat-error>El RFC es requerido</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Contraseña</mat-label>
                  <mat-icon matPrefix>lock</mat-icon>
                  <input matInput [type]="mostrarPass() ? 'text' : 'password'" formControlName="password">
                  <button mat-icon-button matSuffix type="button" (click)="mostrarPass.update(v => !v)">
                    <mat-icon>{{ mostrarPass() ? 'visibility_off' : 'visibility' }}</mat-icon>
                  </button>
                </mat-form-field>

                @if (error()) {
                  <vuc-alert type="error">{{ error() }}</vuc-alert>
                }

                <button mat-raised-button color="primary" type="submit"
                        [disabled]="cargando() || formPassword.invalid" class="login-btn">
                  @if (cargando()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    <mat-icon>login</mat-icon> Ingresar
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
            </mat-tab>

            <!-- Tab: e.firma -->
            <mat-tab label="e.firma (FIEL)">
              <div style="padding-top:16px">
                <vuc-fiel-signature (firmado)="loginFiel($event)"></vuc-fiel-signature>
              </div>
            </mat-tab>
          </mat-tab-group>

          <mat-divider style="margin:24px 0"></mat-divider>
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
    .login-brand__icon { font-size: 56px; width: 56px; height: 56px; margin-bottom: 16px; color: #a5d6a7; }
    .login-brand h1 { font-size: 40px; margin: 0 0 8px; font-weight: 700; }
    .login-brand p { font-size: 16px; color: #a5d6a7; margin: 0; }
    .login-info__item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; font-size: 15px; color: #c8e6c9; }
    .login-right { flex: 1; display: flex; align-items: center; justify-content: center; background: white; padding: 48px; }
    .login-form-container { width: 100%; max-width: 440px; }
    .login-title { font-size: 28px; font-weight: 700; margin: 0 0 4px; color: #1a2035; }
    .login-subtitle { color: #666; margin: 0 0 32px; font-size: 14px; }
    .login-form { display: flex; flex-direction: column; gap: 8px; padding-top: 16px; }
    .login-btn { height: 48px; font-size: 15px; }
    .login-forgot { text-align: center; color: #006847; font-size: 13px; text-decoration: none; margin-top: 8px; }
    .login-demo { margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 8px; font-size: 12px; color: #555; }
    .login-register { text-align: center; font-size: 14px; color: #666; }
    .login-register a { color: #006847; font-weight: 600; }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  formPassword = this.fb.group({
    rfc: ['', Validators.required],
    password: ['', Validators.required],
  });

  cargando = signal(false);
  error = signal('');
  mostrarPass = signal(false);

  loginPassword() {
    if (this.formPassword.invalid) return;
    this.cargando.set(true);
    this.error.set('');
    const { rfc, password } = this.formPassword.value;

    this.auth.loginConPassword(rfc!, password!).subscribe({
      next: (res: any) => {
        this.cargando.set(false);
        if (res.error) { this.error.set(res.error); return; }
        const roles = this.auth.rolesDisponibles();
        if (roles.length > 1) this.router.navigate(['/seleccion-rol']);
        else this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Error al conectar con el servidor.');
      },
    });
  }

  loginFiel(result: any) {
    this.router.navigate(['/dashboard']);
  }
}
