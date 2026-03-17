import { AbstractControl, ValidatorFn } from "@angular/forms";
import { REGEX_FECHA_VALIDA } from "@libs/shared/data-access-user/src";

/**
 * Representa el estado de pago de derechos en el sistema.
 * Contiene información relacionada con el pago realizado, como clave, dependencia, banco, llave de pago, fecha e importe.
 */
export interface PagoDerechosState {
  /**
   * Clave única que identifica el pago de derechos.
   * @example "ABC123"
   */
  clave: string;

  /**
   * Nombre de la dependencia asociada al pago.
   * @example "Secretaría de Medio Ambiente"
   */
  dependencia: string;

  /**
   * Nombre del banco donde se realizó el pago.
   * @example "Banco Nacional"
   */
  banco: string;

  /**
   * Llave única que identifica el pago en el sistema.
   * @example "LLAVE12345"
   */
  llavePago: string;

  /**
   * Fecha en la que se realizó el pago.
   * Formato esperado: "YYYY-MM-DD".
   * @example "2023-04-01"
   */
  fecha: string;

  /**
   * Importe total del pago realizado.
   * Representado como una cadena para mantener el formato exacto.
   * @example "1500.00"
   */
  importePago: string;
}

  /**
   * Constante que define las propiedades de la fecha de pago en el modelo de trámites.
   * Contiene información sobre la etiqueta, si es obligatorio y si está habilitado.
   * 
   * @property {string} labelNombre - Etiqueta que representa el nombre del campo, en este caso "Fecha de pago:".
   * @property {boolean} required - Indica si el campo es obligatorio. Valor `true` significa que es requerido.
   * @property {boolean} habilitado - Indica si el campo está habilitado para su uso. Valor `true` significa que está activo.
   */
  export const FECHA_FACTURA = {
    /**
     * Etiqueta que representa el nombre del campo, en este caso "Fecha de pago:".
     */
    labelNombre: 'Fecha de pago',
    
    /**
     * Indica si el campo es obligatorio. Valor `true` significa que es requerido.
     */
    required: true,
    
    /**
     * Indica si el campo está habilitado para su uso. Valor `true` significa que está activo.
     */
    habilitado: true,
  };

/**
 * Validador de fecha que verifica si el valor del control sigue el formato dd/mm/yyyy.
 * 
 * @returns {ValidatorFn} Una función de validador que toma un AbstractControl y devuelve un objeto de error o null.
 */
export function validadorDeFecha(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const IS_VALID = REGEX_FECHA_VALIDA.test(control.value);
    return IS_VALID ? null : { 'invalidDate': { value: control.value } };
  };
}


/**
 * Representa una sustancia sensible con información química y descriptiva.
 */
export interface SustanciaSensible {
  /**
   * Número CAS (Chemical Abstracts Service) que identifica de manera única una sustancia química.
   * Es opcional.
   */
  numeroCAS?: string;

  /**
   * Código CAS que puede ser utilizado como identificador alternativo de la sustancia química.
   * Es opcional.
   */
  cas?: string;

  /**
   * Descripción no arancelaria de la sustancia, utilizada para especificar detalles adicionales.
   * Es opcional.
   */
  descripcionNoArancelaria?: string;

  /**
   * Nombre químico de la sustancia, utilizado para identificarla de manera descriptiva.
   * Es opcional.
   */
  nombreQuimico?: string;
}



