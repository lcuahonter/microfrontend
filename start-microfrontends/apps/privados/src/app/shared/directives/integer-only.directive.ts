import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[integerOnly]',
  standalone: true,
})
export class IntegerOnlyDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^0-9]/g, ''); // solo dígitos 0–9

    if (filteredValue !== input.value) {
      input.value = filteredValue;
      this.control.control?.setValue(filteredValue, { emitEvent: false });
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

    if (
      allowedKeys.includes(event.key) ||
      (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase()))
    ) {
      return; // permite edición básica y atajos (Ctrl+A, Ctrl+C, etc.)
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault(); // bloquea todo lo que no sea dígito
    }
  }
}
