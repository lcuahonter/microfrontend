import {
  Directive,
  ElementRef,
  HostListener,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[libUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Optional() @Self() private control?: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInputChange(_event: Event): void {
    const INPUT = this.el.nativeElement;
    const NEW_VALUE = INPUT.value.toUpperCase();

    if (this.control) {
      this.control.control?.setValue(NEW_VALUE, { emitEvent: true });
    } else {
      this.renderer.setProperty(INPUT, 'value', NEW_VALUE);
    }
  }
}
