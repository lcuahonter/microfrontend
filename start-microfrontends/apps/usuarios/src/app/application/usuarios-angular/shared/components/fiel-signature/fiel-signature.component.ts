import { Component, Output, EventEmitter, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AlertComponent } from '../alert/alert.component';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

export interface FielResult {
  valido: boolean;
  rfc: string;
  nombre: string;
  cerFile: File;
  keyFile: File;
  passphrase: string;
}

@Component({
  selector: 'vuc-fiel-signature',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, AlertComponent,
  ],
  template: `
    <div class="fiel-container">
      <h3 class="fiel-title">
        <mat-icon>security</mat-icon> e.firma (FIEL)
      </h3>
      <p class="fiel-desc">Firme digitalmente con su certificado (.cer) y llave privada (.key)</p>

      <form [formGroup]="form" (ngSubmit)="verificar()">
        <!-- Archivo .cer -->
        <div class="fiel-upload">
          <label class="fiel-upload__label">Certificado (.cer)</label>
          <div class="fiel-upload__zone" (click)="cerInput.click()">
            <mat-icon>upload_file</mat-icon>
            <span>{{ cerNombre || 'Seleccionar archivo .cer' }}</span>
          </div>
          <input #cerInput type="file" accept=".cer" hidden (change)="onCerChange($event)">
        </div>

        <!-- Archivo .key -->
        <div class="fiel-upload">
          <label class="fiel-upload__label">Llave Privada (.key)</label>
          <div class="fiel-upload__zone" (click)="keyInput.click()">
            <mat-icon>vpn_key</mat-icon>
            <span>{{ keyNombre || 'Seleccionar archivo .key' }}</span>
          </div>
          <input #keyInput type="file" accept=".key" hidden (change)="onKeyChange($event)">
        </div>

        <!-- Contraseña -->
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>Contraseña de la llave privada</mat-label>
          <input matInput [type]="mostrarPass ? 'text' : 'password'" formControlName="passphrase">
          <button mat-icon-button matSuffix type="button" (click)="mostrarPass = !mostrarPass">
            <mat-icon>{{ mostrarPass ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <!-- Error -->
        @if (error) {
          <vuc-alert type="error">{{ error }}</vuc-alert>
        }

        <!-- Éxito -->
        @if (resultado) {
          <vuc-alert type="success">
            Firma verificada: <strong>{{ resultado.nombre }}</strong> ({{ resultado.rfc }})
          </vuc-alert>
        }

        <button mat-raised-button color="primary" type="submit"
                [disabled]="cargando || !cerFile || !keyFile || form.invalid"
                style="width:100%; margin-top:8px">
          @if (cargando) {
            <mat-spinner diameter="20" style="display:inline-block;margin-right:8px"></mat-spinner>
            Verificando...
          } @else {
            <mat-icon>verified</mat-icon> Verificar e.firma
          }
        </button>
      </form>
    </div>
  `,
  styles: [`
    .fiel-container { padding: 16px; }
    .fiel-title { display: flex; align-items: center; gap: 8px; color: #006847; margin-bottom: 8px; }
    .fiel-desc { color: #666; margin-bottom: 24px; font-size: 14px; }
    .fiel-upload { margin-bottom: 16px; }
    .fiel-upload__label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 6px; color: #555; }
    .fiel-upload__zone {
      border: 2px dashed #ccc; border-radius: 8px; padding: 16px;
      text-align: center; cursor: pointer; display: flex; align-items: center;
      justify-content: center; gap: 8px; color: #888; transition: border-color 0.2s;
    }
    .fiel-upload__zone:hover { border-color: #006847; color: #006847; }
  `],
})
export class FielSignatureComponent {
  private fb = inject(FormBuilder);
  private api = inject(UsuariosApiService);

  @Output() firmado = new EventEmitter<FielResult>();

  form = this.fb.group({
    passphrase: ['', Validators.required],
  });

  cerFile: File | null = null;
  keyFile: File | null = null;
  cerNombre = '';
  keyNombre = '';
  cargando = false;
  mostrarPass = false;
  error = '';
  resultado: FielResult | null = null;

  onCerChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.cerFile = file; this.cerNombre = file.name; }
  }

  onKeyChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) { this.keyFile = file; this.keyNombre = file.name; }
  }

  verificar() {
    if (!this.cerFile || !this.keyFile || this.form.invalid) return;
    this.cargando = true;
    this.error = '';
    const pass = this.form.value.passphrase!;

    this.api.verificarFiel(this.cerFile, this.keyFile, pass).subscribe({
      next: (res: any) => {
        this.cargando = false;
        this.resultado = { valido: true, rfc: res.rfc, nombre: res.nombre, cerFile: this.cerFile!, keyFile: this.keyFile!, passphrase: pass };
        this.firmado.emit(this.resultado);
      },
      error: () => {
        this.cargando = false;
        this.error = 'La e.firma no es válida. Verifique sus archivos y contraseña.';
      },
    });
  }
}
