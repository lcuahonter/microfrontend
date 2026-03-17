import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[numericDecimal]',
  standalone: true,
})
export class NumericDecimalDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Normaliza comas → punto
    value = value.replace(',', '.');

    // Permite solo números, punto y evita puntos múltiples
    value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1'); // solo un punto

    // Forzar máximo 2 decimales
    const parts = value.split('.');
    if (parts.length > 1 && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      value = parts.join('.');
    }

    input.value = value;
    this.control.control?.setValue(value, { emitEvent: false });
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];

    // Atajos Ctrl/Command
    if (event.ctrlKey || event.metaKey || allowedKeys.includes(event.key)) {
      return;
    }

    // Permitir un solo punto
    if (event.key === '.') {
      const input = (event.target as HTMLInputElement).value;
      if (input.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    // Solo dígitos
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
