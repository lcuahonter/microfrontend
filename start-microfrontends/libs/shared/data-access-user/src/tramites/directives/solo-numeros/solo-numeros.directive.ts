import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[libSoloNumeros]',
  standalone: true,
})
export class SoloNumerosDirective {
  
  // eslint-disable-next-line class-methods-use-this
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const TECLAPERMITIDA = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'
    ];

    if (TECLAPERMITIDA.indexOf(event.key) !== -1)
      {return;}

    const INPUT = (event.target as HTMLInputElement).value;
    const NUMERO = /^[0-9.]$/;

    // Permitir solo un punto decimal
    if (event.key === '.') {
      if (INPUT.includes('.')) {
      event.preventDefault();
      return;
      }
      // No permitir punto como primer caracter
      if (INPUT.length === 0) {
      event.preventDefault();
      return;
      }
      return;
    }

    // Permitir solo dos decimales
    if (INPUT.includes('.')) {
      const DECIMAL_PART = INPUT.split('.')[1] || '';
      if (DECIMAL_PART.length >= 2 && 
        (event.key >= '0' && event.key <= '9')) {
      event.preventDefault();
      return;
      }
    }

    if (!NUMERO.test(event.key))
      {event.preventDefault();}
  }
}
