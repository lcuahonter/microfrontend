import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { modificarTerrestreService } from './modificacar-terrestre.service';
import { CatalogoLista, VehiculoTabla } from '../../models/registro-muestras-mercancias.model';

describe('modificarTerrestreService', () => {
  let service: modificarTerrestreService;
  let httpMock: HttpTestingController;

  const mockCatalogoLista: CatalogoLista = {
    datos: [
      {
        id: 1,
        descripcion: 'Tracto Camión',
      },
      {
        id: 2,
        descripcion: 'Camión',
      },
      {
        id: 3,
        descripcion: 'Remolque',
      }
    ]
  };

  const mockVehiculoTabla: VehiculoTabla = {
    datos: [
      {
        numero: '001',
        tipoDeVehiculo: 'Tracto Camión',
        idDeVehiculo: 'VEH001',
        numeroPlaca: 'ABC123',
        paisEmisor: 'México',
        estado: 'Ciudad de México',
        marca: 'Freightliner',
        modelo: 'Cascadia',
        ano: '2023',
        transponder: 'TRP001',
        colorVehiculo: 'Blanco',
        numuroEconomico: 'ECO001',
        numero2daPlaca: 'XYZ789',
        estado2daPlaca: 'Jalisco',
        paisEmisor2daPlaca: 'México',
        descripcion: 'Vehículo de carga pesada',
        datos: []
      },
      {
        numero: '002',
        tipoDeVehiculo: 'Camión',
        idDeVehiculo: 'VEH002',
        numeroPlaca: 'DEF456',
        paisEmisor: 'Estados Unidos',
        estado: 'California',
        marca: 'Kenworth',
        modelo: 'T680',
        ano: '2022',
        transponder: 'TRP002',
        colorVehiculo: 'Azul',
        numuroEconomico: 'ECO002',
        numero2daPlaca: '',
        estado2daPlaca: '',
        paisEmisor2daPlaca: '',
        descripcion: 'Vehículo comercial',
        datos: []
      }
    ]} as unknown as VehiculoTabla;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [modificarTerrestreService]
    });

    service = TestBed.inject(modificarTerrestreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be provided in root', () => {
      expect(service).toBeInstanceOf(modificarTerrestreService);
    });

    it('should have HttpClient injected', () => {
      expect(service['http']).toBeDefined();
    });
  });

  describe('obtenerTipoDeVehiculo', () => {
    it('should return observable with CatalogoLista data', () => {
      service.obtenerTipoDeVehiculo().subscribe(data => {
        expect(data).toEqual(mockCatalogoLista);
        expect(data.datos).toHaveLength(3);
        expect(data.datos[0].id).toBe(1);
        expect(data.datos[0].descripcion).toBe('Tracto Camión');
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('assets/json/40102/tipo-vehiculo-arrastre.json');
      
      req.flush(mockCatalogoLista);
    });

    it('should handle successful response with empty data', () => {
      const emptyCatalogo: CatalogoLista = {
        datos: [],
      };

      service.obtenerTipoDeVehiculo().subscribe(data => {
        expect(data).toEqual(emptyCatalogo);
        expect(data.datos).toHaveLength(0);
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.flush(emptyCatalogo);
    });

    it('should handle HTTP 404 error', () => {
      service.obtenerTipoDeVehiculo().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.flush('File not found', { 
        status: 404, 
        statusText: 'Not Found' 
      });
    });

    it('should handle HTTP 500 server error', () => {
      service.obtenerTipoDeVehiculo().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.flush('Server Error', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });

    it('should handle network error', () => {
      service.obtenerTipoDeVehiculo().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error.error).toBeInstanceOf(ProgressEvent);
          expect(error.message).toContain('Http failure response');
        }
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.error(new ProgressEvent('Network error'));
    });

    it('should handle malformed JSON response', () => {
      service.obtenerTipoDeVehiculo().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error).toBeDefined();
        }
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.flush('invalid json{', { 
        status: 200, 
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      });
    });

    it('should handle partial data in response', () => {
      const partialCatalogo = {
        datos: [
          {
            id: 1,
            descripcion: 'Tracto Camión'
          }
        ]
      };

      service.obtenerTipoDeVehiculo().subscribe(data => {
        expect(data.datos).toHaveLength(1);
        expect(data.datos[0].id).toBe(1);
        expect(data.datos[0].descripcion).toBe('Tracto Camión');
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.flush(partialCatalogo);
    });

    it('should handle multiple consecutive calls', () => {
      let callCount = 0;

      service.obtenerTipoDeVehiculo().subscribe(data => {
        callCount++;
        expect(data).toEqual(mockCatalogoLista);
      });

      service.obtenerTipoDeVehiculo().subscribe(data => {
        callCount++;
        expect(data).toEqual(mockCatalogoLista);
      });

      const requests = httpMock.match('assets/json/40102/tipo-vehiculo-arrastre.json');
      expect(requests.length).toBe(2);
      
      requests.forEach(req => {
        expect(req.request.method).toBe('GET');
        req.flush(mockCatalogoLista);
      });

      expect(callCount).toBe(2);
    });
  });

  describe('obtenerPedimentoTabla', () => {
    it('should return observable with VehiculoTabla data', () => {
      service.obtenerPedimentoTabla().subscribe(data => {
        expect(data).toEqual(mockVehiculoTabla);
        expect(data.datos).toHaveLength(2);
        expect(data.datos[0].numero).toBe('001');
      });

      const req = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe('assets/json/40102/vahiculo-dummy.json');
      
      req.flush(mockVehiculoTabla);
    });

    it('should handle successful response with empty vehicle table', () => {
      const emptyVehiculoTabla: VehiculoTabla = {

        datos: []
        
      } as unknown as VehiculoTabla;

      service.obtenerPedimentoTabla().subscribe(data => {
        expect(data).toEqual(emptyVehiculoTabla);
        expect(data.datos).toHaveLength(0);
      });

      const req = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      req.flush(emptyVehiculoTabla);
    });

    it('should handle HTTP 403 forbidden error', () => {
      service.obtenerPedimentoTabla().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error.status).toBe(403);
          expect(error.statusText).toBe('Forbidden');
        }
      });

      const req = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      req.flush('Access denied', { 
        status: 403, 
        statusText: 'Forbidden' 
      });
    });

    it('should handle timeout error', () => {
      service.obtenerPedimentoTabla().subscribe({
        next: () => fail('Expected an error, not data'),
        error: (error) => {
          expect(error.status).toBe(0);
          expect(error.statusText).toBe('Unknown Error');
        }
      });

      const req = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      req.error(new ProgressEvent('timeout'), { 
        status: 0, 
        statusText: 'Unknown Error' 
      });
    });

    it('should handle large dataset response', () => {
      const largeMockData = {
        datos: Array.from({ length: 1000 }, (_, index) => ({
          numero: `${String(index + 1).padStart(3, '0')}`,
          tipoDeVehiculo: index % 2 === 0 ? 'Tracto Camión' : 'Camión',
          idDeVehiculo: `VEH${String(index + 1).padStart(3, '0')}`,
          numeroPlaca: `ABC${index}`,
          paisEmisor: 'México',
          estado: 'Estado Test',
          marca: 'Marca Test',
          modelo: 'Modelo Test',
          ano: '2023',
          transponder: `TRP${index}`,
          colorVehiculo: 'Blanco',
          numuroEconomico: `ECO${index}`,
          numero2daPlaca: '',
          estado2daPlaca: '',
          paisEmisor2daPlaca: '',
          descripcion: `Descripción vehículo ${index + 1}`
        })),
        total: 1000,
        mensaje: 'Dataset grande obtenido'
      };

      service.obtenerPedimentoTabla().subscribe(data => {
        expect(data.datos).toHaveLength(1000);
        expect(data.datos[0].numero).toBe('001');
        expect(data.datos[999].numero).toBe('1000');
      });

      const req = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      req.flush(largeMockData);
    });

    it('should handle response with special characters', () => {
      const specialCharVehiculo: VehiculoTabla = {
        datos: [
            {
                numero: '001',
                ano: '2023',
                tipoDeVehiculo: 'Tracto Camión Especial',
                idDeVehiculo: 'VEH-001_SPECIAL',
                numeroPlaca: 'ÁBC-123',
                paisEmisor: 'México',
                estado: 'Ciudad de México',
                marca: 'Freightliner™',
                modelo: 'Cascadia®',
                transponder: 'TRP@001',
                colorVehiculo: 'Azul Océano',
                numuroEconomico: 'ECO#001',
                numero2daPlaca: 'XÑZ-789',
                estado2daPlaca: 'Nuevo León',
                paisEmisor2daPlaca: 'México',
                descripcion: 'Vehículo con caracteres especiales: ',

                datos: []
            }
        ]
      } as unknown as VehiculoTabla;

      service.obtenerPedimentoTabla().subscribe(data => {
        expect(data.datos[0].numeroPlaca).toBe('ÁBC-123');
        expect(data.datos[0].marca).toBe('Freightliner');
      });

      const req = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      req.flush(specialCharVehiculo);
    });

    it('should handle concurrent requests correctly', () => {
      let firstCallCompleted = false;
      let secondCallCompleted = false;

      service.obtenerPedimentoTabla().subscribe(data => {
        expect(data).toEqual(mockVehiculoTabla);
        firstCallCompleted = true;
      });

      service.obtenerPedimentoTabla().subscribe(data => {
        expect(data).toEqual(mockVehiculoTabla);
        secondCallCompleted = true;
      });

      const requests = httpMock.match('assets/json/40102/vahiculo-dummy.json');
      expect(requests.length).toBe(2);
      
      requests.forEach(req => {
        req.flush(mockVehiculoTabla);
      });

      expect(firstCallCompleted).toBeTruthy();
      expect(secondCallCompleted).toBeTruthy();
    });
  });

  describe('Service Integration Tests', () => {
    it('should handle mixed successful and error responses', () => {
      let catalogoSuccess = false;
      let vehiculoError = false;

      service.obtenerTipoDeVehiculo().subscribe({
        next: (data) => {
          expect(data).toEqual(mockCatalogoLista);
          catalogoSuccess = true;
        },
        error: () => fail('Should not error')
      });

      service.obtenerPedimentoTabla().subscribe({
        next: () => fail('Should error'),
        error: (error) => {
          expect(error.status).toBe(500);
          vehiculoError = true;
        }
      });

      const catalogoReq = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      catalogoReq.flush(mockCatalogoLista);

      const vehiculoReq = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      vehiculoReq.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      expect(catalogoSuccess).toBeTruthy();
      expect(vehiculoError).toBeTruthy();
    });

    it('should maintain service state across multiple calls', () => {
      service.obtenerTipoDeVehiculo().subscribe();
      service.obtenerPedimentoTabla().subscribe();
      service.obtenerTipoDeVehiculo().subscribe();

      const requests = httpMock.match(() => true);
      expect(requests.length).toBe(3);

      requests.forEach((req, index) => {
        if (index === 0 || index === 2) {
          expect(req.request.url).toBe('assets/json/40102/tipo-vehiculo-arrastre.json');
        } else {
          expect(req.request.url).toBe('assets/json/40102/vahiculo-dummy.json');
        }
        req.flush({});
      });
    });
  });

  describe('Error Edge Cases', () => {
    it('should handle null response gracefully', () => {
      service.obtenerTipoDeVehiculo().subscribe(data => {
        expect(data).toBeNull();
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.flush(null);
    });

    it('should handle undefined response gracefully', () => {
      service.obtenerPedimentoTabla().subscribe(data => {
        expect(data).toBeUndefined();
      });

      const req = httpMock.expectOne('assets/json/40102/vahiculo-dummy.json');
      req.flush(null);
    });

    it('should handle response with incorrect content-type', () => {
      service.obtenerTipoDeVehiculo().subscribe(data => {
        expect(data).toEqual(mockCatalogoLista);
      });

      const req = httpMock.expectOne('assets/json/40102/tipo-vehiculo-arrastre.json');
      req.flush(mockCatalogoLista, {
        headers: { 'Content-Type': 'text/plain' }
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid successive calls efficiently', () => {
      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        service.obtenerTipoDeVehiculo().subscribe();
      }

      const requests = httpMock.match('assets/json/40102/tipo-vehiculo-arrastre.json');
      expect(requests.length).toBe(10);

      requests.forEach(req => req.flush(mockCatalogoLista));

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});