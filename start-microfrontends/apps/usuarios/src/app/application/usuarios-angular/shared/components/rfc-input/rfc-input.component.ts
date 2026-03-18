import { Component, forwardRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsuariosApiService } from '../../../core/services/usuarios-api.service';

// Validador RFC Mexicano
function rfcValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value?.toString().toUpperCase() || '';
  const rfcPF = /^[A-Z]{4}\d{6}[A-Z0-9]{3}$/;
  const rfcPM = /^[A-Z]{3}\d{6}[A-Z0-9]{3}$/;
  if (!val) return null;
  if (rfcPF.test(val) || rfcPM.test(val)) return null;
  return { rfcInvalido: true };
}

@Component({
  selector: 'vuc-rfc-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => RfcInputComponent), multi: true }],
  template: `
    <mat-form-field appearance="outline" style="width:100%">
      <mat-label>{{ label }}</mat-label>
      <input matInput [formControl]="rfcControl"
             [placeholder]="placeholder"
             (input)="onInput($event)"
             maxlength="13"
             style="text-transform:uppercase">
      <mat-hint>Formato: AAAA000000XX0 (Física) / AAA000000XX0 (Moral)</mat-hint>
      @if (buscando) {
        <mat-spinner matSuffix diameter="18"></mat-spinner>
      }
      @if (rfcControl.hasError('rfcInvalido') && rfcControl.touched) {
        <mat-error>RFC con formato incorrecto</mat-error>
      }
      @if (rfcControl.hasError('required') && rfcControl.touched) {
        <mat-error>El RFC es requerido</mat-error>
      }
    </mat-form-field>
    @if (usuarioEncontrado) {
      <div class="rfc-found">
        <mat-icon color="primary">person</mat-icon>
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
  usuarioEncontrado: any = null;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.rfcControl.setValue(val, { emitEvent: false });
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void {
    disabled ? this.rfcControl.disable() : this.rfcControl.enable();
  }

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value.toUpperCase();
    this.rfcControl.setValue(val, { emitEvent: false });
    this.onChange(val);
    this.onTouched();

    if (this.buscarUsuario && val.length >= 12 && !this.rfcControl.hasError('rfcInvalido')) {
      this.buscarUsuarioRfc(val);
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
