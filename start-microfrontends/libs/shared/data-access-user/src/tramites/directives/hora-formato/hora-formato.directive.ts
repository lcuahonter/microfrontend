import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[HoraFormato]',
  standalone: true,
})
export class HoraFormatoDirective {
  constructor(private el: ElementRef) {
    // Lógica de inicialización si es necesario
  }

  @HostListener('input', ['$event']) onInputChange(_event: Event): void {
    const INPUT = this.el.nativeElement;
    let value = INPUT.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos

    if (value.length > 4) {
      value = value.slice(0, 4); // Limitar la longitud a 4 caracteres
    }
    if (value.length >= 2) {
      let hours = value.slice(0, 2);
      const MINUTES = value.slice(2, 4);
      hours = hours.length === 1 ? '0' + hours : hours;
      value = hours + (MINUTES ? ':' + MINUTES : '');
    } else if (value.length >= 1) {
      value = value.slice(0, 2);
    }
    INPUT.value = value;
  }
}
