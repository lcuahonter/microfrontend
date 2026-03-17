import { TestBed } from '@angular/core/testing';
import { Pantallas301Service } from './pantallas301.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Solicitud301State } from '../../../core/estados/tramites/tramite301.store';

describe('Pantallas301Service', () => {
  let service: Pantallas301Service;
  let httpMock: HttpTestingController;

  const mockData: Solicitud301State = {
    linea: 'Línea A',
    lineaCheckbox: 'true',
    nombreQuimico: 'Ácido Acético',
    nombreComercial: 'Vinagre',
    numeroCAS: '64-19-7',
    acondicionamiento: 'Botella',
    estadoFisico: 'Líquido',
    fraccionArancelaria: '1234.56.78',
    descripcionFraccion: 'Productos químicos',
    nico: '01',
    descripcionNico: 'Nico descripción',
    mercancia: 'Químicos',
    folio: 'F123456',
    registro: 'R98765',
    pagoDerechosTabla: [
      {
        lineaDeCaptura: 'test',
        monto: 100
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Pantallas301Service]
    });

    service = TestBed.inject(Pantallas301Service);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getPantallaDatos', () => {
    it('should return data from JSON file', () => {
      service.getPantallaDatos().subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne('assets/json/301/registro_toma_muestras_mercancias.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should throw error if HTTP request fails', () => {
      const mockError = new ErrorEvent('Network error');

      service.getPantallaDatos().subscribe({
        next: () => fail('Expected error, but got success'),
        error: (error) => {
          expect(error.error).toBe(mockError);
        }
      });

      const req = httpMock.expectOne('assets/json/301/registro_toma_muestras_mercancias.json');
      req.error(mockError);
    });
  });

  describe('actualizarRegistroCampo', () => {
    it('should toggle mostrarRegistroCampo to true if initially false', () => {
      service.mostrarRegistroCampo = false;
      service.actualizarRegistroCampo();
      expect(service.mostrarRegistroCampo).toBe(true);
    });

    it('should not toggle mostrarRegistroCampo to false if initially true', () => {
      service.mostrarRegistroCampo = true;
      service.actualizarRegistroCampo();
      expect(service.mostrarRegistroCampo).toBe(true); // unchanged
    });
  });

  describe('obtenerRegistroCampoVisibilidad', () => {
    it('should return true when mostrarRegistroCampo is true', () => {
      service.mostrarRegistroCampo = true;
      expect(service.obtenerRegistroCampoVisibilidad()).toBe(true);
    });

    it('should return false when mostrarRegistroCampo is false', () => {
      service.mostrarRegistroCampo = false;
      expect(service.obtenerRegistroCampoVisibilidad()).toBe(false);
    });
  });
});
