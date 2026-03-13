import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MAX_DIGITS_VALIDATOR } from '@libs/shared/data-access-user/src';

/**
 * Verifica si un control de formulario es válido.
 *
 * @param formGroup - El grupo de formularios que contiene el control.
 * @param controlName - El nombre del control a verificar.
 * @returns Verdadero si el control es inválido y ha sido tocado o modificado, falso en caso contrario.
 */
export const ES_CONTROL_INVALIDO = (
  formGroup: FormGroup,
  controlName: string
): boolean | undefined => {
  const CONTROL = formGroup.get(controlName);
  return Boolean(CONTROL?.invalid && (CONTROL?.dirty || CONTROL?.touched));
};

/**
 * habilita o deshabilita un control de formulario basado en la visibilidad.
 * @param form
 * @param control
 * @param esVisible
 */
export const HABILITAR_CONTROL = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: AbstractControl<any, any> | null,
  esVisible: boolean
): void => {
  if (control) {
    control.reset('');
    if (esVisible) {
      control.enable();
      control.setValidators([Validators.required]);
    } else {
      control.disable();
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }
};

/**
 * Validator personalizado para verificar que no se ingrese coma.
 */
export const NO_COMA_VALIDATOR = (
  control: AbstractControl
): ValidationErrors | null => {
  const VALUE = control.value;
  if (VALUE && VALUE.includes(',')) {
    return { noComma: true };
  }
  return null;
};

/**
 * Validator personalizado para verificar el máximo de 6 dígitos significativos.
 */
export const MAX_DIGIT_VALIDATOR = (
  control: AbstractControl
): ValidationErrors | null => {
  const VALUE = control.value;
  if (VALUE && VALUE > 0) {
    const REGEX = MAX_DIGITS_VALIDATOR;
    if (!REGEX.test(VALUE)) {
      return { maxDigits: true };
    }
  }
  return null;
};
