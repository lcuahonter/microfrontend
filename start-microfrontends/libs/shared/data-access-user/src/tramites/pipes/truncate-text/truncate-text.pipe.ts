import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateText',
  standalone: true,
})
/**
 * @description Pipe para truncar texto a un número específico de caracteres.
 * Si el texto excede el límite, se añade una elipsis al final.
 * @param value El texto a truncar.
 * @param limit El número máximo de caracteres permitidos.
 */
export class TruncateText implements PipeTransform {
  // eslint-disable-next-line class-methods-use-this
  transform(value: string, limit: number): string {
    return value && value.length > limit
      ? value.slice(0, limit - 1) + '…'
      : value;
  }
}
