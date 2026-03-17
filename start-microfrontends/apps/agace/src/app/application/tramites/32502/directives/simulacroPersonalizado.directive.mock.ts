import { Directive, Input } from '@angular/core';

@Directive({ selector: '[libMiPersonalizada]' })
export class MiPersonalizadaDirective {
  @Input() libMiPersonalizada!: string | boolean | number;
}