import { FormDataService } from './form-data-service';
import { FormData } from '../models/mod-permiso.model';

describe('FormDataService', () => {
  let service: FormDataService;

  beforeEach(() => {
    service = new FormDataService();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería exponer formData$ como observable', (done) => {
    service.formData$.subscribe((data) => {
      expect(data).toHaveProperty('solicitanteData');
      expect(data).toHaveProperty('completeForm');
      expect(data).toHaveProperty('tercerosRelacionados');
      expect(data).toHaveProperty('pagoDeDerechos');
      expect(data).toHaveProperty('tramitesAsociados');
      done();
    });
  });

  it('debería devolver los datos iniciales con getFormData()', () => {
    const data = service.getFormData();
    expect(data).toEqual({
      solicitanteData: null,
      completeForm: null,
      tercerosRelacionados: null,
      pagoDeDerechos: null,
      tramitesAsociados: null,
    });
  });

  it('debería actualizar una sección específica con updateFormData()', (done) => {
    const solicitanteMock = { nombre: 'Juan' };
    service.updateFormData('solicitanteData', solicitanteMock as any);

    service.formData$.subscribe((data) => {
      expect(data.solicitanteData).toEqual(solicitanteMock);
      done();
    });
  });

  it('debería actualizar varias secciones de los datos', (done) => {
    const solicitanteMock = { nombre: 'Ana' };
    const pagoMock = { monto: 1000 };
    service.updateFormData('solicitanteData', solicitanteMock as any);
    service.updateFormData('pagoDeDerechos', pagoMock as any);

    service.formData$.subscribe((data) => {
      expect(data.solicitanteData).toEqual(solicitanteMock);
      expect(data.pagoDeDerechos).toEqual(pagoMock);
      done();
    });
  });

  it('getFormData() debe reflejar los cambios después de updateFormData()', () => {
    const tercerosMock = [{ nombre: 'Tercero 1' }];
    service.updateFormData('tercerosRelacionados', tercerosMock as any);
    const data = service.getFormData();
    expect(data.tercerosRelacionados).toEqual(tercerosMock);
  });
});