import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumeroTelefonico]',
  standalone: true,
})
export class NumeroTelefonicoDirective {
  constructor(private el: ElementRef) {
    // Lógica de inicialización si es necesario
  }

  @HostListener('input', ['$event'])
  onInputChange(_event: Event): void {
    const INPUT = this.el.nativeElement as HTMLInputElement;

    let valor = INPUT.value.replace(/\D/g, '');

    if (valor.length > 3 && valor.length <= 6) {
      valor = valor.replace(/(\d{3})(\d+)/, '$1 $2');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
    }
    INPUT.value = valor;
  }
}
