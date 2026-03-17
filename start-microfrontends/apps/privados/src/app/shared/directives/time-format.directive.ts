import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTimeFormat]',
  standalone: true,
})
export class TimeFormatDirective {
  constructor(private control: NgControl) {}

  // Permite solo dígitos y :
  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9:]/g, ''); // elimina todo excepto números y ':'

    // Limita la longitud a 5 caracteres (HH:mm)
    if (value.length > 5) value = value.substring(0, 5);

    // Corrige formato si tiene un solo dígito de hora
    if (value.length === 2 && !value.includes(':')) {
      value += ':'; // inserta el ':'
    }

    // Actualiza el input visualmente
    input.value = value;

    // Actualiza el FormControl si está vinculado a Reactive Form
    this.control.control?.setValue(value, { emitEvent: true });
  }

  // Previene caracteres no válidos al presionar teclas
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const allowed = /[0-9:]/;
    if (!allowed.test(event.key)) {
      event.preventDefault();
    }
  }
}
