import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { REGEX_PERMITE_11_2_DIGITS, REGEX_PERMITE_11_3_DIGITS } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Injectable } from '@angular/core';
import { REG_X } from '@ng-mf/data-access-user';

@Injectable({ providedIn: 'root' })
export class PartidaFormService {
  private form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  /*
    * Validador personalizado que verifica si un campo cumple con el formato de máximo dígitos.
  */
  private static maxDigitsValidator(maxEnteros: number, maxDecimales: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value == null || value === '') return null;
      const regex = new RegExp(`^\\d{1,${maxEnteros}}(\\.\\d{1,${maxDecimales}})?$`);
      return regex.test(value) ? null : { maxDigits: { maxEnteros, maxDecimales } };
    };
  }

  /** Crea o recrea el formulario con valores iniciales opcionales */
  createForm(initial?: Partial<Record<string, string | number>>): FormGroup {
    // Create controls and expose some aliases used across components
    const CANTIDAD_CTRL = this.fb.control(initial?.['cantidad'] ?? null, [Validators.required, Validators.min(1), this.cantidadPatternValidator.bind(this), this.noLeadingSpacesValidator.bind(this)]);
    const CANTIDAD_PARTIDAS_CTRL = this.fb.control(initial?.['cantidadPartidas'] ?? null, [Validators.required, Validators.min(1),  PartidaFormService.maxDigitsValidator(11, 3), this.noLeadingSpacesValidator.bind(this)]);
    const VALOR_FACTURA_CTRL = this.fb.control(initial?.['valorFacturaUSD'] ?? null, [Validators.required, this.noLeadingSpacesValidator.bind(this)]);
    const VALOR_PARTIDA_CTRL = this.fb.control(initial?.['valorPartidaUSD'] ?? null, [Validators.required,   PartidaFormService.maxDigitsValidator(11, 2), this.noLeadingSpacesValidator.bind(this)]);
    const FRACCION_CTRL = this.fb.control(initial?.['fraccionArancelaria'] ?? initial?.['fraccionArancelariaTIGIE'] ?? null, [Validators.required]);
    const FRACCION_TIGIE = this.fb.control(initial?.['fraccionArancelariaTIGIE'] ?? null, [Validators.required]);
    const FRACCION_TIGIE_TIGIE = this.fb.control(initial?.['fraccionArancelariaTIGIE_TIGIE'] ?? null, [Validators.required]);
    const UNIDAD_CTRL = this.fb.control(initial?.['unidadMedida'] ?? null, [Validators.required]);

    // Main group
    this.form = this.fb.group({
      cantidad: CANTIDAD_CTRL,
      fraccionArancelaria: FRACCION_CTRL,
      unidadMedida: UNIDAD_CTRL,
      cantidadPartidas: CANTIDAD_PARTIDAS_CTRL,
      valorFacturaUSD: VALOR_FACTURA_CTRL,
      // provide aliases so existing components that expect different control names keep working
      valorPartidaUSD: VALOR_PARTIDA_CTRL,
      fraccionArancelariaTIGIE: FRACCION_TIGIE,
      fraccionArancelariaTIGIE_TIGIE: FRACCION_TIGIE_TIGIE,
    });

    return this.form;
  }

  getControl(control: string): AbstractControl | null {
    return this.form?.get(control);
  }

  getForm(): FormGroup {
    if (!this.form) {
      this.createForm();
    }
    return this.form;
  }

  setFieldValue(campo: string, valor: unknown): void {
    const CONTROL = this.getForm().get(campo);
    if (CONTROL) {
      CONTROL.setValue(valor);
    }
  }

  markAllAsTouched(): void {
    this.getForm().markAllAsTouched();
  }

  isValid(): boolean {
    return this.getForm().valid;
  }

  reset(): void {
    this.getForm().reset();
  }

  /* Validators */
  noLeadingSpacesValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string' && control.value.trim() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  }

  /**
   * Valida que el valor de la cantidad sea un número y que tenga hasta 11 dígitos y 3 decimales.
   * @param control - Control que se va a validar.
   * @returns - Objeto de errores si la validación falla, null si la validación pasa.
   */
  cantidadPatternValidator(control: AbstractControl): ValidationErrors | null {
    const SOLO_NUMEROS = REG_X.SOLO_NUMEROS;
    const ONCE_TRES_DIGITS = REGEX_PERMITE_11_3_DIGITS;

    if (control.value && !new RegExp(SOLO_NUMEROS).test(control.value)) {
      return { soloNumeros: true };
    }

    if (control.value && !new RegExp(ONCE_TRES_DIGITS).test(control.value)) {
      return { onceTresDigits: true };
    }

    return null;
  }

  /**
   * Valida que el valor de la cantidad sea un número y que tenga hasta 11 dígitos y 2 decimales.
   * @param control - Control que se va a validar.
   * @returns - Objeto de errores si la validación falla, null si la validación pasa.
   */
  valorFacturaUSDValidator(control: AbstractControl): ValidationErrors | null {
    const DECIMALES_DOS_LUGARES = REG_X.DECIMALES_DOS_LUGARES;
    const ONCE_DOS_DIGITS = REGEX_PERMITE_11_2_DIGITS;

    if (control.value && !new RegExp(DECIMALES_DOS_LUGARES).test(control.value)) {
      return { decimalesDosLugares: true };
    }

    if (control.value && !new RegExp(ONCE_DOS_DIGITS).test(control.value)) {
      return { onceDosDigits: true };
    }

    return null;
  }
}
