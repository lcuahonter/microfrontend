import { DatosAgregarFormulario } from '../../../models/shared/forms-model';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormulariosService {
  private destroy$ = new Subject<void>();

  /**
   * Método que agrega un valor a un campo de un formulario desactivado
   * @param datosForm datos del formulario
   */
  static agregarValorCamposDesactivados(
    datosForm: DatosAgregarFormulario
  ): void {
    datosForm.form.controls[datosForm.field].enable();
    datosForm.form.controls[datosForm.field].setValue(datosForm.valor);
    datosForm.form.controls[datosForm.field].disable();
  }

  /**
   * Método que agrega un valor a un campo de un formulario desactivado
   * @param form formulario
   * @param field campo
   * @param valor valor
   */
  static agregarValorCampoDesactivado(
    form: FormGroup,
    field: string,
    valor: string
  ): void {
    form.controls[field].enable();
    form.controls[field].setValue(valor);
    form.controls[field].disable();
  }

  /**
   * Convierte el valor de un campo de un formulario a un número.
   *
   * @param {FormGroup} form - El formulario que contiene el campo.
   * @param {string} field - El nombre del campo cuyo valor se va a convertir.
   * @returns {number} - El valor del campo convertido a número. Si el campo no tiene valor, retorna 0.
   */
  static convertirValorANumero(form: FormGroup, field: string): number {
    return form.get(field)?.value ? parseInt(form.get(field)?.value, 10) : 0;
  }

  /**
   * Inserta un valor en un campo específico de un formulario.
   * @param datosForm - Objeto que contiene la información necesaria para agregar el valor al formulario.
   */
  static insertarValorCampoForm(datosForm: DatosAgregarFormulario): void {
    datosForm.form.get(datosForm.field)?.setValue(datosForm.valor);
  }

  /**
   * Obtiene los nombres de los campos de un formulario.
   *
   * @param form - El grupo de formulario del cual se obtendrán los nombres de los campos.
   * @returns Un arreglo de cadenas de texto que representan los nombres de los campos del formulario.
   */
  static obtenerNombresCamposForm(form: FormGroup): string[] {
    return Object.keys(form.controls);
  }

  /**
   * Obtiene una lista de los nombres de los campos que están deshabilitados en un formulario.
   *
   * @param form - El formulario del cual se obtendrán los campos deshabilitados.
   * @returns Una lista de cadenas que representan los nombres de los campos deshabilitados.
   */
  static obtenerCamposDisabled(form: FormGroup): string[] {
    const CAMPOS_DISABLED: string[] = [];
    Object.keys(form.controls).forEach((key) => {
      if (form.controls[key].disabled) {
        CAMPOS_DISABLED.push(key);
      }
    });
    return CAMPOS_DISABLED;
  }
}
