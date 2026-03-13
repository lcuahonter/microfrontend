import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[libSoloAlfabetos]',
  standalone: true,
})
export class SoloAlfabetosDirective {
  private regex = /^[a-zA-Z]*$/;
  
    @HostListener('keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
      const INPUT = event.key;
  
      if (!this.regex.test(INPUT)) {
        event.preventDefault();
      }
    }
}
