import { Directive, HostListener } from '@angular/core';
/**
 * Directiva que permite únicamente la entrada de caracteres alfanuméricos (letras y números) en el input.
 * Se utiliza como atributo [libAlphaNumericOnly] en los campos de formulario.
 */
@Directive({
  selector: '[libAlphaNumericOnly]',
  standalone: true,
})

export class AlphaNumericOnlyDirective {

  /** Patrón que permite solo caracteres alfanuméricos, acentuados, ñ/Ñ y espacios. */
  private readonly PATTERN = /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s]$/;

  /**
 * Escucha el evento keypress y permite únicamente la entrada de caracteres alfanuméricos.
 * Permite teclas especiales (backspace, delete, tab, escape, enter) y combinaciones Ctrl+A/C/V/X/Z.
 * Bloquea cualquier otro carácter que no cumpla con el patrón alfanumérico.
 * @param event Evento de teclado.
 */
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const CHAR = String.fromCharCode(event.which ?? event.keyCode);

    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 13, 27, 46].includes(event.which)) {
      return;
    }

    // Allow Ctrl+A/C/V/X/Z
    if (event.ctrlKey && [65, 67, 86, 88, 90].includes(event.which)) {
      return;
    }

    // Block invalid characters
    if (!this.PATTERN.test(CHAR)) {
      event.preventDefault();
    }
  }
}
