import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { FielSignatureComponent } from '../../../shared/components/fiel-signature/fiel-signature.component';

@Component({
  selector: 'vuc-recuperar-password',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatRadioModule, MatProgressSpinnerModule, AlertComponent, FielSignatureComponent,
  ],
  template: `
    <div class="page-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title><mat-icon>key</mat-icon> Recuperar Contraseña</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Tipo de usuario -->
          <div class="option-group">
            <label class="option-label">Tipo de usuario</label>
            <mat-radio-group [(ngModel)]="tipoUsuario" class="radio-group">
              <mat-radio-button value="mexicano">Mexicano</mat-radio-button>
              <mat-radio-button value="extranjero">Extranjero</mat-radio-button>
            </mat-radio-group>
          </div>

          <!-- Método -->
          <div class="option-group">
            <label class="option-label">Método de recuperación</label>
            <mat-radio-group [(ngModel)]="metodo" class="radio-group">
              <mat-radio-button value="rfc">Por RFC</mat-radio-button>
              @if (tipoUsuario === 'mexicano') {
                <mat-radio-button value="curp">Por CURP</mat-radio-button>
              }
              <mat-radio-button value="fiel">Con e.firma</mat-radio-button>
            </mat-radio-group>
          </div>

          <!-- Formulario según método -->
          @if (metodo === 'rfc') {
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>RFC</mat-label>
              <mat-icon matPrefix>badge</mat-icon>
              <input matInput [(ngModel)]="valorIdentificador" placeholder="AAAA000000XX0" maxlength="13" style="text-transform:uppercase">
            </mat-form-field>
          }
          @if (metodo === 'curp') {
            <mat-form-field appearance="outline" style="width:100%">
              <mat-label>CURP</mat-label>
              <input matInput [(ngModel)]="valorIdentificador" maxlength="18" style="text-transform:uppercase">
            </mat-form-field>
          }
          @if (metodo === 'fiel') {
            <vuc-fiel-signature (firmado)="onFirmado($event)"></vuc-fiel-signature>
          }

          @if (enviado()) {
            <vuc-alert type="success">Se ha enviado un enlace de recuperación a su correo registrado.</vuc-alert>
          }

          @if (metodo !== 'fiel') {
            <div class="form-actions">
              <button mat-stroked-button routerLink="/login">Cancelar</button>
              <button mat-raised-button color="primary" (click)="enviar()" [disabled]="!valorIdentificador || cargando()">
                @if (cargando()) { <mat-spinner diameter="20"></mat-spinner> }
                @else { <mat-icon>send</mat-icon> Enviar Enlace }
              </button>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { max-width: 480px; margin: 0 auto; }
    .option-group { margin-bottom: 20px; }
    .option-label { display: block; font-size: 14px; font-weight: 500; color: #555; margin-bottom: 8px; }
    .radio-group { display: flex; gap: 20px; }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
  `],
})
export class RecuperarPasswordComponent {
  tipoUsuario = 'mexicano';
  metodo = 'rfc';
  valorIdentificador = '';
  cargando = signal(false);
  enviado = signal(false);

  enviar() {
    this.cargando.set(true);
    setTimeout(() => { this.cargando.set(false); this.enviado.set(true); }, 1000);
  }

  onFirmado(data: any) { this.enviado.set(true); }
}
