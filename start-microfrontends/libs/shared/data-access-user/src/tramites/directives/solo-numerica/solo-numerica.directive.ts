import { Directive, HostListener, Input } from '@angular/core';
import { REGEX_NUMEROS } from '../../constantes/regex.constants';

/**
 * Directiva que permite ingresar solo caracteres numéricos en un input.
 * También permite limitar la cantidad máxima de dígitos usando el atributo `maxLength`.
 *
 * ### Uso:
 * ```html
 * <input type="text" libSoloNumerica [maxLength]="5" />
 * ```
 */
@Directive({
  selector: '[libSoloNumerica]',
  standalone: true,
})
export class SoloNumericaDirective {
  /**
   * Determina si el campo debe permitir únicamente caracteres numéricos.
   *
   * Si se establece en `true`, se aplicará una validación que restringe
   * la entrada del usuario a solo números. Este valor puede ser
   * configurado desde el componente padre.
   */
  @Input() libSoloNumerica: boolean = true;
  /**
   * Número máximo de dígitos permitidos en el input.
   * Si no se especifica, no se aplica ninguna limitación de longitud.
   */
  @Input() maxLength: number | undefined;

  /**
   * Evento que se dispara al escribir en el input.
   * Filtra caracteres no numéricos y aplica la longitud máxima si está definida.
   *
   * @param event Evento de entrada del usuario.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!this.libSoloNumerica) {
      return;
    }
    const INPUT = event.target as HTMLInputElement;

    // Elimina cualquier carácter que no sea numérico
    let filtered = INPUT.value.replace(REGEX_NUMEROS, '');

    // Aplica límite de longitud si está definido
    if (this.maxLength !== undefined && filtered.length > this.maxLength) {
      filtered = filtered.slice(0, this.maxLength);
    }

    // Actualiza el valor del input
    INPUT.value = filtered;
  }
}
