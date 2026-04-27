import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

// Validador RFC Mexicano
function rfcValidator(control: AbstractControl): ValidationErrors | null {
  const VAL = control.value?.toString().toUpperCase() || '';
  const RFC_PF = /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/;
  const RFC_PM = /^[A-Z]{3}\d{6}[A-Z0-9]{3}$/;
  if (!VAL) { return null; }
  if (RFC_PF.test(VAL) || RFC_PM.test(VAL)) { return null; }
  return { rfcInvalido: true };
}

@Component({
  selector: 'vuc-rfc-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RfcInputComponent), multi: true }],
  template: `
    <div class="mb-3">
      <label class="form-label">{{ label }}</label>
      <div class="input-group">
        <input class="form-control" [formControl]="rfcControl"
               [placeholder]="placeholder"
               (input)="onInput($event)"
               maxlength="13"
               style="text-transform:uppercase">
        @if (buscando) {
          <span class="input-group-text">
            <div class="spinner-border spinner-border-sm" role="status"></div>
          </span>
        }
      </div>
      <div class="form-text">Formato: AAAA000000XX0 (Física) / AAA000000XX0 (Moral)</div>
      @if (rfcControl.hasError('rfcInvalido') && rfcControl.touched) {
        <div class="invalid-feedback d-block">RFC con formato incorrecto</div>
      }
      @if (rfcControl.hasError('required') && rfcControl.touched) {
        <div class="invalid-feedback d-block">El RFC es requerido</div>
      }
    </div>
    @if (usuarioEncontrado) {
      <div class="rfc-found">
        <i class="bi bi-person text-primary"></i>
        <span>{{ usuarioEncontrado.nombre }} {{ usuarioEncontrado.primerApellido }}</span>
      </div>
    }
  `,
  styles: [`
    .rfc-found { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #006847; margin-top: 4px; padding: 6px 12px; background: #e8f5e9; border-radius: 6px; }
  `],
})
export class RfcInputComponent implements ControlValueAccessor {
  private api = inject(UsuariosApiService);
  private cdr = inject(ChangeDetectorRef);

  @Input() label = 'RFC';
  @Input() placeholder = 'AAAA000000XX0';
  @Input() buscarUsuario = false;

  rfcControl = new FormControl('', [Validators.required, rfcValidator]);
  buscando = false;
  usuarioEncontrado: { nombre: string; primerApellido: string } | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (v: string) => void = (_v: string) => { /* ControlValueAccessor stub */ };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: () => void = () => { /* ControlValueAccessor stub */ };

  writeValue(val: string): void {
    this.rfcControl.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void {
    if (disabled) { this.rfcControl.disable(); } else { this.rfcControl.enable(); }
  }

  onInput(event: Event) {
    const VAL = (event.target as HTMLInputElement).value.toUpperCase();
    this.rfcControl.setValue(VAL, { emitEvent: false });
    this.onChange(VAL);
    this.onTouched();

    if (this.buscarUsuario && VAL.length >= 12 && !this.rfcControl.hasError('rfcInvalido')) {
      this.buscarUsuarioRfc(VAL);
    } else {
      this.usuarioEncontrado = null;
    }
  }

  private buscarUsuarioRfc(rfc: string) {
    this.buscando = true;
    this.api.buscarUsuario(rfc).subscribe(u => {
      this.buscando = false;
      this.usuarioEncontrado = u;
      this.cdr.markForCheck();
    });
  }
}
