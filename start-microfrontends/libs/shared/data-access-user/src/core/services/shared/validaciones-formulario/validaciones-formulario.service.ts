import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidacionesFormularioService {

  /** Fuente de mensajes para validaciones */
  private mostrarButton = new Subject<boolean>();

  /** Observable de mensajes para validaciones */
  message$ = this.mostrarButton.asObservable();

  /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
  public isValid = ValidacionesFormularioService.isValid;
  static isValid(control: AbstractControl, campo?: string): boolean | null {
    if (control instanceof FormGroup && campo) {
      return control.controls[campo].errors && control.controls[campo].touched;
    }
    return control.errors && control.touched;
  }

  /**
   * Valida que el valor de un select sea diferente de 0.
   * @returns {ValidatorFn} : Retorna una función que valida si el valor de un campo es diferente de 0
   */
  public noCeroValidator = ValidacionesFormularioService.noCeroValidator;
  static noCeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value === 0 ? { noZero: true } : null;
    };
  }

  /**
   * Obtiene el error de un campo requerido
   * @param {AbstractControl}  control : Control del formulario
   * @param {string} campo  : Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo o control es requerido y ha sido tocado, de lo contrario retorna false
   */
  public errorCampoRequerido =
    ValidacionesFormularioService.errorCampoRequerido;
  static errorCampoRequerido(
    control: AbstractControl,
    campo?: string
  ): boolean | null {
    if (control instanceof FormGroup && campo) {
      const CAMPO_CONTROL = control.controls[campo];
      return CAMPO_CONTROL?.errors?.['required'] && CAMPO_CONTROL.touched;
    }
    return control.errors && control.errors['required'] && control.touched;
  }

  /**
   * Obtiene el error de un campo con patterns
   * @param {AbstractControl} control : Control del formulario
   * @param {string} campo Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo o control contiene errores de pattern y ha sido tocado, de lo contrario retorna false
   */
  public errorEmail = ValidacionesFormularioService.errorEmail;
  static errorEmail(control: AbstractControl, campo?: string): boolean | null {
    if (control instanceof FormGroup && campo) {
      const CAMPO_CONTROL = control.controls[campo];
      return CAMPO_CONTROL?.errors?.['email'] && CAMPO_CONTROL.touched;
    }
    return control.errors && control.errors['email'] && control.touched;
  }

  /**
   * Obtiene el error de un campo con patterns
   * @param {AbstractControl} control : Control del formulario
   * @param {string} campo Nombre del campo a validar, si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo o control contiene errores de pattern y ha sido tocado, de lo contrario retorna false
   */
  public errorPattern = ValidacionesFormularioService.errorPattern;
  static errorPattern(
    control: AbstractControl,
    campo?: string
  ): boolean | null {
    if (control instanceof FormGroup && campo) {
      const CAMPO_CONTROL = control.controls[campo];
      return CAMPO_CONTROL?.errors?.['pattern'] && CAMPO_CONTROL.touched;
    }
    return control.errors && control.errors['pattern'] && control.touched;
  }

  /**
   * Valida que la fecha seleccionada no sea anterior o igual a hoy.
   *
   * @param control - Control del formulario que contiene la fecha a validar.
   * @returns Un objeto con el error `minDate` si la fecha es inválida, o `null` si es válida.
   */
  static validaFechaNoHoy(control: AbstractControl): ValidationErrors | null {
    const HOY = new Date();
    HOY.setHours(0, 0, 0, 0);
    const DIA_SELECCIONADO = new Date(control.value);
    return DIA_SELECCIONADO > HOY ? null : { minDate: true };
  }

  /**
   * Valida que el valor numérico no sea menor a 1, permitiendo "00" como valor válido.
   * @param control - Control del formulario que contiene el valor a validar.
   * @returns Un objeto con el error `noMenosUno` si el valor es menor a 1, o `null` si es válido.
   */
  static noMenosUnoValor(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;

    // Si es exactamente la cadena "00", es válido
    if (VALUE === '00') {
      return null;
    }
    // Convierte a número si es necesario
    const NUMERIC_VALUE = Number(VALUE);
    // Valida que no sea menor a 1 ni 0 explícito
    return NUMERIC_VALUE < 1 ? { noMenosUno: true } : null;
  }
  
  /**
   * Valida que el campo no contenga solo espacios en blanco.
   * @param control - Control del formulario que contiene el valor a validar.
   * @returns Un objeto con el error `whitespace` si el campo contiene solo espacios, o `null` si es válido.
   */
  static noWhitespaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (control.value === null || control.value === undefined) {
      return null; // Deja que el validador 'required' maneje valores nulos/indefinidos
    }

    const isWhitespace = (control.value || '').toString().trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  /** Envía un mensaje para validaciones
   * @param {string} message : Mensaje a enviar
   */
  public setMostrarButton(message: boolean): void {
    this.mostrarButton.next(message);
  }
}
