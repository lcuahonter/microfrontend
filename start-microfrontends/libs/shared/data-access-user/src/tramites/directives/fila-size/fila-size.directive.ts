import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { Directive, Input } from '@angular/core';

/**
 * Directiva personalizada para validar el tamaño máximo permitido de un archivo en un input tipo file.
 * Se utiliza como atributo [filaSize] en el input y permite establecer el límite en bytes.
 */
@Directive({
  selector: '[filaSize]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FilaSizeDirective,
      multi: true,
    },
  ],
})

export class FilaSizeDirective implements Validator {

  /** Tamaño máximo permitido para el archivo en bytes. Se establece mediante el atributo [filaSize]. */
  @Input('filaSize') maxFileSize!: number | string;

  /**
   * Valida que el archivo seleccionado no exceda el tamaño máximo permitido.
   * @param control Control de formulario que contiene el archivo.
   * @returns Un objeto de error si el archivo excede el tamaño permitido, o null si es válido.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    const FILE = control.value as File;
    if (!FILE) {
      return null;
    }
    const LIMIT = typeof this.maxFileSize === 'string' ? parseInt(this.maxFileSize, 10) : this.maxFileSize;
    if (FILE && LIMIT && FILE.size > LIMIT) {
      return { fileSize: true };
    }
    return null;
  }
}
