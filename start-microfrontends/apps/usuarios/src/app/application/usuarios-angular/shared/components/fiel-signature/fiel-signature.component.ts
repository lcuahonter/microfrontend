import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';
import { CommonModule } from '@angular/common';
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
    AlertComponent,
  ],
  template: `
    <div class="fiel-container">
      <h3 class="fiel-title">
        <i class="bi bi-shield-lock"></i> e.firma (FIEL)
      </h3>
      <p class="fiel-desc">Firme digitalmente con su certificado (.cer) y llave privada (.key)</p>

      <form [formGroup]="form" (ngSubmit)="verificar()">
        <!-- Archivo .cer -->
        <div class="fiel-upload">
          <label class="fiel-upload__label">Certificado (.cer)</label>
          <div class="fiel-upload__zone" (click)="cerInput.click()">
            <i class="bi bi-upload"></i>
            <span>{{ cerNombre || 'Seleccionar archivo .cer' }}</span>
          </div>
          <input #cerInput type="file" accept=".cer" hidden (change)="onCerChange($event)">
        </div>

        <!-- Archivo .key -->
        <div class="fiel-upload">
          <label class="fiel-upload__label">Llave Privada (.key)</label>
          <div class="fiel-upload__zone" (click)="keyInput.click()">
            <i class="bi bi-key"></i>
            <span>{{ keyNombre || 'Seleccionar archivo .key' }}</span>
          </div>
          <input #keyInput type="file" accept=".key" hidden (change)="onKeyChange($event)">
        </div>

        <!-- Contraseña -->
        <div class="mb-3">
          <label class="form-label">Contraseña de la llave privada</label>
          <div class="input-group">
            <input class="form-control" [type]="mostrarPass ? 'text' : 'password'" formControlName="passphrase">
            <button class="btn btn-outline-secondary" type="button" (click)="mostrarPass = !mostrarPass">
              <i class="bi" [class.bi-eye]="!mostrarPass" [class.bi-eye-slash]="mostrarPass"></i>
            </button>
          </div>
        </div>

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

        <button class="btn btn-primary w-100 mt-2" type="submit"
                [disabled]="cargando || !cerFile || !keyFile || form.invalid">
          @if (cargando) {
            <div class="spinner-border spinner-border-sm text-light me-2" role="status"></div>
            Verificando...
          } @else {
            <i class="bi bi-patch-check"></i> Verificar e.firma
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
    const FILE = (event.target as HTMLInputElement).files?.[0];
    if (FILE) { this.cerFile = FILE; this.cerNombre = FILE.name; }
  }

  onKeyChange(event: Event) {
    const FILE = (event.target as HTMLInputElement).files?.[0];
    if (FILE) { this.keyFile = FILE; this.keyNombre = FILE.name; }
  }

  verificar() {
    if (!this.cerFile || !this.keyFile || this.form.invalid) { return; }
    this.cargando = true;
    this.error = '';
    const PASS = this.form.value.passphrase!;

    this.api.verificarFiel(this.cerFile, this.keyFile, PASS).subscribe({
      next: (res: { valido: boolean; rfc: string; nombre: string }) => {
        this.cargando = false;
        this.resultado = { valido: true, rfc: res.rfc, nombre: res.nombre, cerFile: this.cerFile!, keyFile: this.keyFile!, passphrase: PASS };
        this.firmado.emit(this.resultado);
      },
      error: () => {
        this.cargando = false;
        this.error = 'La e.firma no es válida. Verifique sus archivos y contraseña.';
      },
    });
  }
}
