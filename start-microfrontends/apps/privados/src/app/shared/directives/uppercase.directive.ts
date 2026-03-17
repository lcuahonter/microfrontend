import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[uppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();

    // actualiza visualmente
    input.value = upperValue;

    // actualiza el FormControl o ngModel vinculado
    this.control.control?.setValue(upperValue, { emitEvent: false });
  }
}
