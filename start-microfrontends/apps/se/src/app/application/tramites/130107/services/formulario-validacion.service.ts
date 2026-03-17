import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

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
   * @method registerForm
   * @description
   * Registra un formulario dinámico en el servicio si no ha sido registrado previamente.
   * @param {string} name - El nombre único del formulario.
   * @param {FormGroup} form - La instancia del formulario a registrar.
   */
    registerForm(name: string, form: FormGroup): void {
        if (!this.forms.has(name)) {
            this.forms.set(name, form);
        }
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
    setFormValue(name: string, value: Record<string, string | object>): void {
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
}
