import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExencionImpuestosService } from './exencion-impuestos.service';
import { RespuestaMercancia, DatosDelMercancia } from '../models/exencion-impuestos.model';
import { Tramite103Store } from '../estados/tramite103.store';
import { RespuestaCatalogos, Catalogo } from '@libs/shared/data-access-user/src';

describe('ExencionImpuestosService', () => {
  let service: ExencionImpuestosService;
  let httpMock: HttpTestingController;
  let mockStore: Partial<Tramite103Store>;

  const mockCatalogo: Catalogo = {
    id: 1,
    descripcion: 'Test Item Description',
    clave: 'TEST001',
    relacionadaUmtId: 5,
    relacionadaAcotacionId: 10
  };

  const mockCatalogResponse: RespuestaCatalogos = {
    code: 200,
    data: [mockCatalogo],
    message: 'Success'
  };

  const mockMercanciaData: DatosDelMercancia = {
    id: 1,
    tipoDeMercancia: 'Electrónica',
    unidadMedida: 'Piezas',
    condicionMercancia: 'Nuevo',
    ano: [2023],
    usoEspecifico: 'Personal',
    cantidad: '10',
    marca: 'TestBrand',
    modelo: 'X100',
    serie: '123ABC',
    datosDelMercancia: []
  };

  const mockMercanciaResponse: RespuestaMercancia = {
    success: true,
    message: 'Success',
    datos: mockMercanciaData
  };

  const mockErrorResponse = {
    status: 404,
    statusText: 'Not Found'
  };

  beforeEach(() => {
    mockStore = {
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExencionImpuestosService,
        { provide: Tramite103Store, useValue: mockStore }
      ]
    });

    service = TestBed.inject(ExencionImpuestosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAduana', () => {
    it('should return aduana data', () => {
      service.getAduana().subscribe(response => {
        expect(response).toEqual(mockCatalogResponse);
      });

      const req = httpMock.expectOne('assets/json/103/aduanaIngresara.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogResponse);
    });

    it('should handle errors for getAduana', () => {
      service.getAduana().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne('assets/json/103/aduanaIngresara.json');
      req.flush('Error', mockErrorResponse);
    });
  });

  describe('getDestinoMercancia', () => {
    it('should return destino mercancia data', () => {
      service.getDestinoMercancia().subscribe(response => {
        expect(response).toEqual(mockCatalogResponse);
      });

      const req = httpMock.expectOne('assets/json/103/destinoMercancia.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogResponse);
    });

    it('should handle errors for getDestinoMercancia', () => {
      service.getDestinoMercancia().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne('assets/json/103/destinoMercancia.json');
      req.flush('Error', mockErrorResponse);
    });
  });

  describe('getCondicionMercancia', () => {
    it('should return condicion mercancia data', () => {
      service.getCondicionMercancia().subscribe(response => {
        expect(response).toEqual(mockCatalogResponse);
      });

      const req = httpMock.expectOne('assets/json/103/condicion-mercancia.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogResponse);
    });

    it('should handle errors for getCondicionMercancia', () => {
      service.getCondicionMercancia().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne('assets/json/103/condicion-mercancia.json');
      req.flush('Error', mockErrorResponse);
    });
  });

  describe('getUnidadMedida', () => {
    it('should return unidad medida data', () => {
      service.getUnidadMedida().subscribe(response => {
        expect(response).toEqual(mockCatalogResponse);
      });

      const req = httpMock.expectOne('assets/json/103/unidad-medida.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogResponse);
    });

    it('should handle errors for getUnidadMedida', () => {
      service.getUnidadMedida().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne('assets/json/103/unidad-medida.json');
      req.flush('Error', mockErrorResponse);
    });
  });

  describe('getAno', () => {
    it('should return ano data', () => {
      service.getAno().subscribe(response => {
        expect(response).toEqual(mockCatalogResponse);
      });

      const req = httpMock.expectOne('assets/json/103/ano.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogResponse);
    });

    it('should handle errors for getAno', () => {
      service.getAno().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne('assets/json/103/ano.json');
      req.flush('Error', mockErrorResponse);
    });
  });

  describe('getPais', () => {
    it('should return pais data', () => {
      service.getPais().subscribe(response => {
        expect(response).toEqual(mockCatalogResponse);
      });

      const req = httpMock.expectOne('assets/json/103/pais.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCatalogResponse);
    });

    it('should handle errors for getPais', () => {
      service.getPais().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne('assets/json/103/pais.json');
      req.flush('Error', mockErrorResponse);
    });
  });

  describe('agregarMercancias', () => {
    it('should return mercancia data with correct structure', () => {
      service.agregarMercancias().subscribe(response => {
        expect(response).toEqual(mockMercanciaResponse);
        expect(response.datos.id).toBe(1);
        expect(response.datos.tipoDeMercancia).toBe('Electrónica');
        expect(response.datos.unidadMedida).toBe('Piezas');
      });

      const req = httpMock.expectOne('assets/json/103/mercanciaDatos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockMercanciaResponse);
    });

    it('should handle errors for agregarMercancias', () => {
      service.agregarMercancias().subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toEqual(404);
        }
      });

      const req = httpMock.expectOne('assets/json/103/mercanciaDatos.json');
      req.flush('Error', mockErrorResponse);
    });
  });

  describe('HTTP request verification', () => {
    it('should call correct endpoints', () => {
      service.getAduana().subscribe();
      service.getDestinoMercancia().subscribe();
      service.getCondicionMercancia().subscribe();
      service.getUnidadMedida().subscribe();
      service.getAno().subscribe();
      service.getPais().subscribe();
      service.agregarMercancias().subscribe();

      httpMock.expectOne('assets/json/103/aduanaIngresara.json');
      httpMock.expectOne('assets/json/103/destinoMercancia.json');
      httpMock.expectOne('assets/json/103/condicion-mercancia.json');
      httpMock.expectOne('assets/json/103/unidad-medida.json');
      httpMock.expectOne('assets/json/103/ano.json');
      httpMock.expectOne('assets/json/103/pais.json');
      httpMock.expectOne('assets/json/103/mercanciaDatos.json');
    });
  });
});