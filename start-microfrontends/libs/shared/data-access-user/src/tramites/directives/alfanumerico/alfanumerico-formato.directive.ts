import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[soloLetrasNumeros]',
  standalone: true,
})
export class SoloLetrasNumerosDirective {
  private regex = /^[a-zA-Z0-9]*$/;

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const INPUT = event.key;

    if (!this.regex.test(INPUT)) {
      event.preventDefault();
    }
  }
}
