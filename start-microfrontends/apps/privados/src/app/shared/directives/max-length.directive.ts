import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxLength]',
  standalone: true,
})
export class MaxLengthDirective {
  @Input('appMaxLength') maxLength = 10; // valor por defecto

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > this.maxLength) {
      input.value = input.value.slice(0, this.maxLength);
      // Mueve el cursor al final
      const pos = this.maxLength;
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event('input')); // notifica a Angular
    }
  }
}
