import { FormGroup, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @Injectable
 * @description
 * Marca la clase `ServicioDeFormularioService` como un servicio inyectable en Angular. 
 * @providedIn 'root' - Indica que el servicio está disponible en el inyector raíz.
 */
@Injectable({
  providedIn: 'root'
})
export class ServicioDeFormularioService {
  /**
 * @property forms
 * @description
 * Mapa privado que almacena los formularios dinámicos registrados en el servicio. 
 * La clave es un `string` que representa el nombre del formulario, y el valor es una instancia de `FormGroup`.
 * @type {Map<string, FormGroup>}
 */
  private forms = new Map<string, FormGroup>();

  /**
   * @property formTouchedNotifier
   * @description
   * Notificador privado basado en `Subject` que emite el nombre del formulario cuando este ha sido marcado como "tocado".
   * Permite a los componentes suscribirse y reaccionar a los cambios de estado de los formularios.
   * @type {Subject<string>}
   */
  private formTouchedNotifier = new Subject<string>();

  /**
   * @property formTouched$
   * @description
   * Observable público que expone los eventos emitidos por `formTouchedNotifier`.  
   * Permite a los componentes suscribirse para detectar cuándo un formulario ha sido marcado como "tocado".
   * El valor emitido es un `string` que corresponde al nombre del formulario afectado.
   * @type {Observable<string>}
   */
  public formTouched$ = this.formTouchedNotifier.asObservable();

  /**
   * @property arrays
   * @description
   * Mapa para almacenar arreglos dinámicos.  
   * La clave es el nombre del arreglo y el valor es un array genérico.
   */
  private arrays = new Map<string, unknown[]>();

  /**
 * @method registerForm
 * @description
 * Registra un formulario dinámico en el servicio si no ha sido registrado previamente.
 * @param {string} name - El nombre único del formulario.
 * @param {FormGroup} form - La instancia del formulario a registrar.
 */
  registerForm(name: string, form: FormGroup): void {
   
    this.forms.set(name, form);
  }

 /**
 * @method getForm
 * @description
 * Recupera un formulario dinámico registrado en el servicio utilizando su nombre único.
 * @param {string} name - El nombre único del formulario.
 * @returns {FormGroup | undefined} - La instancia del formulario o `undefined` si no se encuentra.
 */
  getForm(name: string): FormGroup | undefined {
    return this.forms.get(name);
  }

  /**
 * @method setFormValue
 * @description
 * Establece valores en un formulario dinámico registrado en el servicio.
 * @param {string} name - El nombre único del formulario.
 * @param {Record<string, string | object>} value - Un objeto que contiene los valores a establecer en el formulario.
 */
  setFormValue(name: string, value: Record<string, string | object | boolean>): void {
    const FORMA = this.getForm(name);
    if (FORMA) {
      FORMA.patchValue(value);
    }
  }

  /**
 * @method getFormValue
 * @description
 * Recupera los valores actuales de un formulario dinámico registrado en el servicio.
 * @param {string} name - El nombre único del formulario.
 * @returns {Record<string, string | object> | undefined} - Los valores del formulario o `undefined` si no se encuentra.
 */
  getFormValue(name: string): Record<string, string | object> | undefined {
    const FORMA = this.getForm(name);
    return FORMA?.value;
  }

 /**
 * @method resetForm
 * @description
 * Restablece un formulario dinámico registrado en el servicio a su estado inicial.
 * @param {string} name - El nombre único del formulario.
 */
  resetForm(name: string): void {
    const FORMA = this.getForm(name);
    if (FORMA) {
      FORMA.reset();
    }
  }

  /**
 * @method isFormValid
 * @description
 * Verifica la validez de un formulario dinámico registrado en el servicio.
 * @param {string} name - El nombre único del formulario.
 * @returns {boolean | undefined} - `true` si el formulario es válido, `false` si no lo es, o `undefined` si no se encuentra.
 */
  isFormValid(name: string): boolean | undefined {
    const FORMA = this.getForm(name);
    return FORMA?.valid;
  }

  /**
   * @method removeControl
   * @description
   * Elimina un control específico de un formulario dinámico registrado en el servicio.
   * @param {string} formName - El nombre único del formulario.
   * @param {string} controlName - El nombre del control a eliminar del formulario.
   */
  removeControl(formName: string, controlName: string): void {
    const FORMA = this.getForm(formName);
    if (FORMA && FORMA.contains(controlName)) {
      FORMA.removeControl(controlName);
    }
  }

  /**
   * @method updateControlValidator
   * @description
   * Actualiza los validadores de un control específico de un formulario dinámico registrado en el servicio.
   * @param {string} formName - El nombre único del formulario.
   * @param {string} controlName - El nombre del control a actualizar en el formulario.
   * @param {ValidatorFn[]} validators - Los validadores a establecer en el control.
   */
  updateControlValidator(formName: string, controlName: string, validators: ValidatorFn[] = []): void {
    const FORMA = this.getForm(formName);
    const CONTROL = FORMA?.get(controlName);

    if (CONTROL) {
      CONTROL.setValidators(validators);
      CONTROL.updateValueAndValidity();
    }
  }

  /**
   * @method markFormAsTouched
   * @description
   * Actualiza los validadores de un control específico de un formulario dinámico registrado en el servicio.
   * @param {string} formName - El nombre único del formulario.
   */
  markFormAsTouched(formName: string): void {
    this.formTouchedNotifier.next(formName);
  }

   /**
   * Registra un arreglo con un nombre único.  
   * Si ya existe, lo reemplaza.
   */
  registerArray<T>(name: string, data: T[] = []): void {
    this.arrays.set(name, [...data]);
  }

  /**
   * Obtiene el arreglo registrado.
   */
  getArray<T>(name: string): T[] | undefined {
    return this.arrays.get(name) as T[] | undefined;
  }

  /**
   * Actualiza el arreglo completo (reemplaza su contenido).
   */
  setArray<T>(name: string, data: T[]): void {
    this.arrays.set(name, [...data]);
  }

  /**
   * Agrega un elemento al arreglo.
   */
  pushToArray<T>(name: string, item: T): void {
    const CURRENT = this.arrays.get(name) ?? [];
    this.arrays.set(name, [...CURRENT, item]);
  }

  /**
   * Longitud del arreglo.
   */
  getArrayLength(name: string): number {
    return this.arrays.get(name)?.length ?? 0;
  }

  /**
   * Retorna true si el arreglo existe y tiene al menos un elemento.
   */
  isArrayFilled(name: string): boolean {
    return (this.arrays.get(name)?.length ?? 0) > 0;
  }

  /**
   * Limpia el arreglo.
   */
  clearArray(name: string): void {
    this.arrays.set(name, []);
  }

/**
 * Fuerza la validación de un formulario dinámico registrado en el servicio.
 * @param name 
 * @returns  boolean - `true` si el formulario es válido, `false` en caso contrario.
 */
  forceValidateForm(name: string): boolean {
  const FORM = this.getForm(name);
  if (!FORM) {
    return false;
  }
  FORM.markAllAsTouched();
  FORM.updateValueAndValidity({ emitEvent: true });

  return FORM.valid;
}
}
