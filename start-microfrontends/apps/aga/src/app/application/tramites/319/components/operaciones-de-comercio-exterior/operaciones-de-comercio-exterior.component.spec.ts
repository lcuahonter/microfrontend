import { validadorDeMesyAno } from './operaciones-de-comercio-exterior.component';
import { FormControl } from '@angular/forms';

describe('validadorDeMesyAno', () => {
  it('should return null for valid MM/YYYY format', () => {
    const control = new FormControl('12/2023');
    const validator = validadorDeMesyAno();
    expect(validator(control)).toBeNull();
  });

  it('should return error for invalid month', () => {
    const control = new FormControl('13/2023');
    const validator = validadorDeMesyAno();
    expect(validator(control)).toEqual({ invalidMonthYear: true });
  });

  it('should return error for invalid format', () => {
    const control = new FormControl('2023/12');
    const validator = validadorDeMesyAno();
    expect(validator(control)).toEqual({ invalidMonthYear: true });
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    const validator = validadorDeMesyAno();
    expect(validator(control)).toBeNull();
  });

  it('should return error for non-numeric input', () => {
    const control = new FormControl('ab/cdef');
    const validator = validadorDeMesyAno();
    expect(validator(control)).toEqual({ invalidMonthYear: true });
  });
});