import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  /**
   * Marca todos los controles de un FormGroup como "touched"
   * y fuerza la actualización de sus validaciones.
   *
   * @param formGroup Formulario que se desea validar
   */
  public marcarFormularioComoTocado(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const CONTROL = formGroup.get(key);

      if (CONTROL instanceof FormControl) {
        CONTROL.markAsTouched();
        CONTROL.updateValueAndValidity();
      } else if (CONTROL instanceof FormGroup) {
        this.marcarFormularioComoTocado(CONTROL);
      } else if (CONTROL instanceof FormArray) {
        CONTROL.controls.forEach((c) => {
          if (c instanceof FormGroup) {
            this.marcarFormularioComoTocado(c);
          } else {
            c.markAsTouched();
            c.updateValueAndValidity();
          }
        });
      }
    });
  }

}
