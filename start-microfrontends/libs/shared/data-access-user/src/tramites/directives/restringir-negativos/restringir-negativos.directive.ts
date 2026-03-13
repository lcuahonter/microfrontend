import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Directiva que restringe la entrada de valores negativos en campos de tipo input numérico.
 * Se utiliza como atributo [libRestringirNegativos] para evitar que el usuario ingrese números negativos, signos o letras no válidas.
 */
@Directive({
  selector: '[libRestringirNegativos]',
  standalone: true,
})

export class RestringirNegativosDirective {

  /** Inyecta la referencia al elemento input para manipular su valor y restringir la entrada de negativos. */
  constructor(private el: ElementRef<HTMLInputElement>) {}

  /**
 * Escucha el evento keydown y previene la entrada de caracteres no permitidos como signos negativos, positivos y letras 'e'/'E'.
 * Además, si el valor actual inicia con '-', lo reemplaza por '0' para evitar valores negativos.
 * @param event Evento de teclado.
 */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const FORBIDDEN_KEYS = ['-', '+', 'e', 'E'];
    const FORBIDDEN_CODES = ['Minus', 'NumpadSubtract'];
    const INPUT = this.el.nativeElement;
    if (FORBIDDEN_KEYS.includes(event.key) || FORBIDDEN_CODES.includes(event.code)) {
      event.preventDefault();
    }
    // optional safeguard: ensure no negative input
    if (INPUT.value.startsWith('-')) {
      INPUT.value = '0';
    }
  }

  /**
 * Escucha el evento de pegado y previene que se peguen valores negativos en el input.
 * Si el texto pegado contiene un signo negativo, lo bloquea y limpia el valor pegado.
 * @param event Evento de portapapeles.
 */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const INPUT = this.el.nativeElement;
    const PASTED_TEXT = event.clipboardData?.getData('text') ?? '';
    if (PASTED_TEXT.includes('-')) {
      event.preventDefault();
      // Optional: sanitize pasted value just in case
      INPUT.value = INPUT.value.replace('-', '');
    }
  }

  /**
 * Escucha el evento de entrada y valida que el valor no sea negativo ni contenga el signo '-'.
 * Si detecta un valor negativo o con '-', lo reemplaza por '0' y dispara el evento de input.
 */
  @HostListener('input', ['$event'])
  onInput(): void {
    const INPUT = this.el.nativeElement;
    const VALUE = INPUT.value;
    if (VALUE.includes('-') || parseFloat(VALUE) < 0) {
      INPUT.value = '0';
      INPUT.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  /**
 * Escucha el evento de scroll (rueda del mouse) y previene que el usuario disminuya el valor por debajo de cero usando la rueda.
 * Si el valor es cero o menor y se intenta decrementar, se bloquea la acción.
 * @param event Evento de la rueda del mouse.
 */
  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    const INPUT = this.el.nativeElement;
    const VALUE = parseFloat(INPUT.value || '0');
    if (event.deltaY > 0 && VALUE <= 0) {
      event.preventDefault();
    }
  }
}
