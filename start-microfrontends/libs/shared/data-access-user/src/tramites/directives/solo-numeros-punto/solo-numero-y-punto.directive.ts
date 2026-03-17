import { Directive, HostListener, Input } from '@angular/core';
import { REGEX_DECIMAL } from '../../constantes/regex.constants';

/**
 * Directiva que permite ingresar solo números decimales con 2 dígitos después del punto.
 *
 * ### Uso:
 * ```html
 * <input type="text" libSoloNumericaDecimal />
 * ```
 */
@Directive({
  selector: '[libSoloNumericaDecimal]',
  standalone: true,
})
export class SoloNumericaDecimalDirective {
  REGEX_DECIMAL_PUNTO = /[^0-9.]/g;

  @Input() libSoloNumericaDecimal: boolean = true;

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!this.libSoloNumericaDecimal) {
      return;
    }
    const INPUT = event.target as HTMLInputElement;
    let filtered = INPUT.value.replace(this.REGEX_DECIMAL_PUNTO, '');
    const PARTS = filtered.split('.');
    if (PARTS.length > 2) {
      filtered = PARTS[0] + '.' + PARTS.slice(1).join('');
    }

    if (PARTS[1] && PARTS[1].length > 2) {
      filtered = PARTS[0] + '.' + PARTS[1].slice(0, 2);
    }
    INPUT.value = filtered;
  }
}
