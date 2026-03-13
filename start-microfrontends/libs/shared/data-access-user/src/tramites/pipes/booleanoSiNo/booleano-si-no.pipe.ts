import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanoSiNo',
  standalone: true,
})
export class BooleanoSiNoPipe implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform(value: boolean): string {
    return value ? 'Sí' : 'No';
  }
}
