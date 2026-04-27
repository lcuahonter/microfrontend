import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { CommonModule } from '@angular/common';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'vuc-recuperar-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <div class="card form-card">
        <div class="card-header">
          <h5 class="card-title"><i class="bi bi-key"></i> Recuperar Contraseña</h5>
        </div>
        <div class="card-body">
          <!-- Tipo de usuario -->
          <div class="option-group">
            <label class="option-label">Tipo de usuario</label>
            <div class="d-flex gap-3">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="tipoUsuario" id="tipoMex" value="mexicano" [formControl]="tipoUsuarioCtrl">
                <label class="form-check-label" for="tipoMex">Mexicano</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" name="tipoUsuario" id="tipoExt" value="extranjero" [formControl]="tipoUsuarioCtrl">
                <label class="form-check-label" for="tipoExt">Extranjero</label>
              </div>
            </div>
          </div>

          <!-- Método -->
          <div class="option-group">
            <label class="option-label">Método de recuperación</label>
            <div class="d-flex gap-3 flex-wrap">
              <div class="form-check">
                <input class="form-check-input" type="radio" name="metodo" id="metodoRfc" value="rfc" [formControl]="metodoCtrl">
                <label class="form-check-label" for="metodoRfc">Por RFC</label>
              </div>
              @if (tipoUsuarioCtrl.value === 'mexicano') {
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="metodo" id="metodoCurp" value="curp" [formControl]="metodoCtrl">
                  <label class="form-check-label" for="metodoCurp">Por CURP</label>
                </div>
              }
              <div class="form-check">
                <input class="form-check-input" type="radio" name="metodo" id="metodoFiel" value="fiel" [formControl]="metodoCtrl">
                <label class="form-check-label" for="metodoFiel">Con e.firma</label>
              </div>
            </div>
          </div>

          <!-- Formulario según método -->
          @if (metodoCtrl.value === 'rfc') {
            <div class="mb-3">
              <label class="form-label">RFC</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-person-badge"></i></span>
                <input class="form-control text-uppercase" [formControl]="valorIdentificadorCtrl" placeholder="AAAA000000XX0" maxlength="13">
              </div>
            </div>
          }
          @if (metodoCtrl.value === 'curp') {
            <div class="mb-3">
              <label class="form-label">CURP</label>
              <input class="form-control text-uppercase" [formControl]="valorIdentificadorCtrl" maxlength="18">
            </div>
          }
          @if (metodoCtrl.value === 'fiel') {
            <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
          }

          @if (enviado()) {
            <vuc-alert type="success">Se ha enviado un enlace de recuperación a su correo registrado.</vuc-alert>
          }

          @if (metodoCtrl.value !== 'fiel') {
            <div class="form-actions">
              <button class="btn btn-outline-primary" routerLink="/login">Cancelar</button>
              <button class="btn btn-primary" (click)="enviar()" [disabled]="!valorIdentificadorCtrl.value || cargando()">
                @if (cargando()) { <div class="spinner-border spinner-border-sm text-light" role="status"></div> }
                @else { <i class="bi bi-send"></i> Enviar Enlace }
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 480px; margin: 0 auto; }
    .option-group { margin-bottom: 20px; }
    .option-label { display: block; font-size: 14px; font-weight: 500; color: #555; margin-bottom: 8px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
  `],
})
export class RecuperarPasswordComponent {
  tipoUsuarioCtrl = new FormControl('mexicano');
  metodoCtrl = new FormControl('rfc');
  valorIdentificadorCtrl = new FormControl('');
  cargando = signal(false);
  enviado = signal(false);

  enviar() {
    this.cargando.set(true);
    setTimeout(() => { this.cargando.set(false); this.enviado.set(true); }, 1000);
  }

  onFirmado(_data: unknown) { this.enviado.set(true); }
}
