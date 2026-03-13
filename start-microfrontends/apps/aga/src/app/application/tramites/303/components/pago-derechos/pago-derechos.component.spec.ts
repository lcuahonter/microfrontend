import { FormBuilder } from '@angular/forms';
import { PagoDerechosComponent } from './pago-derechos.component';
import { Tramite303Service } from '../../../../core/services/303/tramite303.service';
import { of, throwError } from 'rxjs';

describe('PagoDerechosComponent', () => {
  let component: PagoDerechosComponent;
  let fb: FormBuilder;
  let mockService: any;

  beforeEach(() => {
    fb = new FormBuilder();
    mockService = {
      consultaBanco: jest.fn()
    };
    component = new PagoDerechosComponent(fb, mockService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the form with default values', () => {
    expect(component.pagoDerechos).toBeDefined();
    expect(component.pagoDerechos.get('claveReferencia')?.value).toBe('');
    expect(component.pagoDerechos.get('fechaPago')?.value).toBe('');
  });

  it('should call catalogoBancos and set catBancos on success', () => {
    const bancosMock = [{ id: 1, descripcion: 'Banco 1' }];
    mockService.consultaBanco.mockReturnValue(of(bancosMock));
    component.catalogoBancos();
    expect(mockService.consultaBanco).toHaveBeenCalled();
    // Simulate observable emission
    setTimeout(() => {
      expect(component.catBancos).toEqual(bancosMock);
    }, 0);
  });

  it('should handle error in catalogoBancos', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockService.consultaBanco.mockReturnValue(throwError(() => new Error('fail')));
    component.catalogoBancos();
    setTimeout(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        'Error al consultar catálogo IMMEX',
        expect.any(Error)
      );
      errorSpy.mockRestore();
    }, 0);
  });

  it('should reset the form when borrarDatosPago is called', () => {
    component.pagoDerechos.patchValue({
      claveReferencia: 'test',
      fechaPago: '2024-01-01',
      importePago: 100
    });
    component.borrarDatosPago();
    expect(component.pagoDerechos.get('claveReferencia')?.value).toBeNull();
    expect(component.pagoDerechos.get('fechaPago')?.value).toBeNull();
    expect(component.pagoDerechos.get('importePago')?.value).toBeNull();
  });
});
