import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistroCaatAereoService } from './RegistroCaatAereoController.service';
import { CaatAereoData, CatalogoLista, Catalogo } from '../models/certi-registro.model';

describe('RegistroCaatAereoService', () => {
  let service: RegistroCaatAereoService;
  let httpMock: HttpTestingController;

  const mockCatalogoLista: CatalogoLista = {
    datos: [
      { id: 1, descripcion: 'Tipo CAAT 1' },
      { id: 2, descripcion: 'Tipo CAAT 2' },
      { id: 3, descripcion: 'Tipo CAAT 3' }
    ]
  };

  const mockCodigoAereoCatalogo: CatalogoLista = {
    datos: [
      { id: 101, descripcion: 'Código Aéreo A' },
      { id: 102, descripcion: 'Código Aéreo B' },
      { id: 103, descripcion: 'Código Aéreo C' }
    ]
  };

  const mockCaatAereoData: CaatAereoData = {
    TipoDeCaatAereo: 'Aéreo Comercial',
    DodigoDeTransportacion: 'AER001',
    EmpresaDeTransportacion: 'Transportes Aéreos SA'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroCaatAereoService]
    });

    service = TestBed.inject(RegistroCaatAereoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /**
   * Test service creation
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * Test constructor
   */
  it('should have http client injected', () => {
    expect(service['http']).toBeDefined();
  });

  /**
   * Tests for obtenerCAATAereo method
   */
  describe('#obtenerCAATAereo', () => {
    it('should fetch CAAT Aereo catalog data successfully', () => {
      const expectedUrl = 'assets/json/40401/tipo_caat_aereo.json';
      service.obtenerCAATAereo().subscribe((data: CatalogoLista) => {
        expect(data).toEqual(mockCatalogoLista);
        expect(data.datos).toHaveLength(3);
        expect(data.datos[0].id).toBe(1);
        expect(data.datos[0].descripcion).toBe('Tipo CAAT 1');
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogoLista);
    });

    it('should handle HTTP error when fetching CAAT Aereo catalog', () => {
      const expectedUrl = 'assets/json/40401/tipo_caat_aereo.json';
      const errorMessage = 'Error loading CAAT Aereo catalog';

      service.obtenerCAATAereo().subscribe({
        next: () => fail('Expected an error, but got success'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  /**
   * Tests for obtenerCodigoAereo method
   */
  describe('#obtenerCodigoAereo', () => {
    it('should fetch Codigo Aereo catalog data successfully', () => {
      const expectedUrl = 'assets/json/40401/codigo_transportacion_aereo.json';

      service.obtenerCodigoAereo().subscribe((data: CatalogoLista) => {
        expect(data).toEqual(mockCodigoAereoCatalogo);
        expect(data.datos).toHaveLength(3);
        expect(data.datos[0].id).toBe(101);
        expect(data.datos[0].descripcion).toBe('Código Aéreo A');
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCodigoAereoCatalogo);
    });

    it('should handle HTTP error when fetching Codigo Aereo catalog', () => {
      const expectedUrl = 'assets/json/40401/codigo_transportacion_aereo.json';
      const errorMessage = 'Error loading Codigo Aereo catalog';

      service.obtenerCodigoAereo().subscribe({
        next: () => fail('Expected an error, but got success'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle empty catalog data', () => {
      const expectedUrl = 'assets/json/40401/codigo_transportacion_aereo.json';
      const emptyData: CatalogoLista = { datos: [] };

      service.obtenerCodigoAereo().subscribe((data: CatalogoLista) => {
        expect(data).toEqual(emptyData);
        expect(data.datos).toHaveLength(0);
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(emptyData);
    });
  });

  /**
   * Tests for obtenerCAATAereoData method
   */
  describe('#obtenerCAATAereoData', () => {
    it('should fetch CAAT Aereo data successfully', () => {
      const expectedUrl = 'assets/json/40401/caat.aereo.data.json';

      service.obtenerCAATAereoData().subscribe((data: CaatAereoData) => {
        expect(data).toEqual(mockCaatAereoData);
        expect(data.TipoDeCaatAereo).toBe('Aéreo Comercial');
        expect(data.DodigoDeTransportacion).toBe('AER001');
        expect(data.EmpresaDeTransportacion).toBe('Transportes Aéreos SA');
      });
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCaatAereoData);
    });

    it('should handle HTTP error when fetching CAAT Aereo data', () => {
      const expectedUrl = 'assets/json/40401/caat.aereo.data.json';
      const errorMessage = 'Error loading CAAT Aereo data';

      service.obtenerCAATAereoData().subscribe({
        next: () => fail('Expected an error, but got success'),
        error: (error) => {
          expect(error.status).toBe(403);
          expect(error.statusText).toBe('Forbidden');
        }
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 403, statusText: 'Forbidden' });
    });

    it('should handle incomplete data structure', () => {
      const expectedUrl = 'assets/json/40401/caat.aereo.data.json';
      const incompleteData = {
        TipoDeCaatAereo: 'Aéreo',
        DodigoDeTransportacion: '',
        EmpresaDeTransportacion: 'Test Company'
      };

      service.obtenerCAATAereoData().subscribe((data: CaatAereoData) => {
        expect(data.TipoDeCaatAereo).toBe('Aéreo');
        expect(data.DodigoDeTransportacion).toBe('');
        expect(data.EmpresaDeTransportacion).toBe('Test Company');
      });

      const req = httpMock.expectOne(expectedUrl);
      req.flush(incompleteData);
    });
  });

  /**
   * Integration tests for multiple method calls
   */
  describe('Integration tests', () => {
    it('should handle multiple concurrent requests', () => {
      let caatAereoResult: CatalogoLista | undefined;
      let codigoAereoResult: CatalogoLista | undefined;
      let caatDataResult: CaatAereoData | undefined;

      service.obtenerCAATAereo().subscribe(data => caatAereoResult = data);
      service.obtenerCodigoAereo().subscribe(data => codigoAereoResult = data);
      service.obtenerCAATAereoData().subscribe(data => caatDataResult = data);

      const caatReq = httpMock.expectOne('assets/json/40401/tipo_caat_aereo.json');
      const codigoReq = httpMock.expectOne('assets/json/40401/codigo_transportacion_aereo.json');
      const dataReq = httpMock.expectOne('assets/json/40401/caat.aereo.data.json');

      expect(caatReq.request.method).toBe('GET');
      expect(codigoReq.request.method).toBe('GET');
      expect(dataReq.request.method).toBe('GET');

      caatReq.flush(mockCatalogoLista);
      codigoReq.flush(mockCodigoAereoCatalogo);
      dataReq.flush(mockCaatAereoData);

      expect(caatAereoResult).toEqual(mockCatalogoLista);
      expect(codigoAereoResult).toEqual(mockCodigoAereoCatalogo);
      expect(caatDataResult).toEqual(mockCaatAereoData);
    });

    it('should handle mixed success and error responses', () => {
      let successCount = 0;
      let errorCount = 0;

      service.obtenerCAATAereo().subscribe({
        next: () => successCount++,
        error: () => errorCount++
      });

      service.obtenerCodigoAereo().subscribe({
        next: () => successCount++,
        error: () => errorCount++
      });

      service.obtenerCAATAereoData().subscribe({
        next: () => successCount++,
        error: () => errorCount++
      });

      const caatReq = httpMock.expectOne('assets/json/40401/tipo_caat_aereo.json');
      const codigoReq = httpMock.expectOne('assets/json/40401/codigo_transportacion_aereo.json');
      const dataReq = httpMock.expectOne('assets/json/40401/caat.aereo.data.json');

      caatReq.flush(mockCatalogoLista);
      codigoReq.flush(mockCodigoAereoCatalogo);
      dataReq.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(successCount).toBe(2);
      expect(errorCount).toBe(1);
    });
  });

  /**
   * Edge case tests
   */
  describe('Edge cases', () => {
    it('should handle null responses gracefully', () => {
      service.obtenerCAATAereo().subscribe((data: CatalogoLista) => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('assets/json/40401/tipo_caat_aereo.json');
      req.flush(null);
    });

    it('should handle malformed JSON gracefully', () => {
      service.obtenerCAATAereoData().subscribe({
        next: () => fail('Expected an error due to malformed JSON'),
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne('assets/json/40401/caat.aereo.data.json');
      req.error(new ErrorEvent('JSON Parse Error'));
    });
  });
});
