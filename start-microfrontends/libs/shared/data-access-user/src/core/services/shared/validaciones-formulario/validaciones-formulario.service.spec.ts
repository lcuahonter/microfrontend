import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { ValidacionesFormularioService } from './validaciones-formulario.service';

describe('ValidacionesFormularioService', () => {
  let service: ValidacionesFormularioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidacionesFormularioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('noWhitespaceValidator', () => {
    it('should return null for valid text', () => {
      const control = new FormControl('texto válido');
      const result = ValidacionesFormularioService.noWhitespaceValidator(control);
      expect(result).toBeNull();
    });

    it('should return whitespace error for empty string', () => {
      const control = new FormControl('');
      const result = ValidacionesFormularioService.noWhitespaceValidator(control);
      expect(result).toEqual({ whitespace: true });
    });

    it('should return whitespace error for spaces only', () => {
      const control = new FormControl('   ');
      const result = ValidacionesFormularioService.noWhitespaceValidator(control);
      expect(result).toEqual({ whitespace: true });
    });

    it('should return whitespace error for tabs and spaces', () => {
      const control = new FormControl('\t  \n  ');
      const result = ValidacionesFormularioService.noWhitespaceValidator(control);
      expect(result).toEqual({ whitespace: true });
    });

    it('should return null for null value', () => {
      const control = new FormControl(null);
      const result = ValidacionesFormularioService.noWhitespaceValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for undefined value', () => {
      const control = new FormControl(undefined);
      const result = ValidacionesFormularioService.noWhitespaceValidator(control);
      expect(result).toBeNull();
    });

    it('should return null for text with leading/trailing spaces', () => {
      const control = new FormControl('  texto con espacios  ');
      const result = ValidacionesFormularioService.noWhitespaceValidator(control);
      expect(result).toBeNull();
    });
  });
});
