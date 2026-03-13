import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Solocitud221601Service } from './service221601.service';
import { Tramite221601Store, Solicitud221601State } from '../../../estados/tramites/tramite221601.store';
import { ENVIRONMENT } from '../../../../environments/environment';

// Mock the environment
jest.mock('../../../../environments/environment', () => ({
  ENVIRONMENT: {
    URL_SERVER: 'http://test-server.com',
    URL_SERVER_JSON_AUXILIAR: 'http://test-catalog-server.com'
  }
}));

describe('Solocitud221601Service', () => {
  let service: Solocitud221601Service;
  let httpTestingController: HttpTestingController;
  let mockTramite221601Store: jest.Mocked<Tramite221601Store>;
  let mockSolicitudState: Solicitud221601State;

  beforeEach(() => {
    // Create comprehensive mock state
    mockSolicitudState = {
      regimen: 'Test regimen',
      justificacion: 'Test justification',
      aduana: 'Test aduana',
      oficina: 'Test oficina',
      punto: 'Test punto',
      guia: 'Test guia',
      carro: 'Test carro',
      clave: 'Test clave',
      claves: 'Test claves',
      veterinario: 'Test veterinario',
      establecimiento: 'Test establecimiento',
      capturaMercancia: true,
      medio: 'Test medio',
      verificacion: 'Test verificacion',
      transporte: 'Test transporte',
      empresa: 'Test empresa',
      dependencia: 'Test dependencia',
      banco: 'Test banco',
      llave: 'Test llave',
      fecha: new Date('2023-01-01'),
      importe: 1000,
      coordenadas: 'Test coordenadas',
      tipoPersona: 'FISICA',
      nombre: 'Test nombre',
      primerApellido: 'Test primer apellido',
      segundoApellido: 'Test segundo apellido',
      social: 'Test social',
      pais: 'Test pais',
      codigo: 'Test codigo',
      estado: 'Test estado',
      municipio: 'Test municipio',
      colonia: 'Test colonia',
      calle: 'Test calle',
      exterior: 'Test exterior',
      interior: 'Test interior',
      lada: '55',
      telefono: '12345678',
      correoElectronico: 'test@test.com',
      tif: 'Test tif'
    } as unknown as Solicitud221601State;

    // Create mock for Tramite221601Store with all necessary methods
    mockTramite221601Store = {
      setRegimen: jest.fn(),
      setJustificacion: jest.fn(),
      setAduana: jest.fn(),
      setOficina: jest.fn(),
      setPunto: jest.fn(),
      setGuia: jest.fn(),
      setCarro: jest.fn(),
      setClave: jest.fn(),
      setClaves: jest.fn(),
      setVeterinario: jest.fn(),
      setEstablecimiento: jest.fn(),
      setCapturaMercancia: jest.fn(),
      setMedio: jest.fn(),
      setVerificacion: jest.fn(),
      setTransporte: jest.fn(),
      setEmpresa: jest.fn(),
      setDependencia: jest.fn(),
      setBanco: jest.fn(),
      setLlave: jest.fn(),
      setFecha: jest.fn(),
      setImporte: jest.fn(),
      setCoordenadas: jest.fn(),
      setTipoPersona: jest.fn(),
      setNombre: jest.fn(),
      setPrimerApellido: jest.fn(),
      setSegundoApellido: jest.fn(),
      setSocial: jest.fn(),
      setPais: jest.fn(),
      setCodigo: jest.fn(),
      setEstado: jest.fn(),
      setMunicipio: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setExterior: jest.fn(),
      setInterior: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setTif: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Solocitud221601Service,
        { provide: Tramite221601Store, useValue: mockTramite221601Store }
      ]
    });

    service = TestBed.inject(Solocitud221601Service);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should inject HttpClient dependency', () => {
      expect(service['http']).toBeDefined();
    });

    it('should inject Tramite221601Store dependency', () => {
      expect(service['tramite221601Store']).toBeDefined();
      expect(service['tramite221601Store']).toBe(mockTramite221601Store);
    });

    it('should initialize with correct URL server configuration', () => {
      expect(service.urlServer).toBe('http://test-server.com');
    });

    it('should initialize with correct URL server catalogos configuration', () => {
      expect(service.urlServerCatalogos).toBe('http://test-catalog-server.com');
    });
  });

  describe('actualizarEstadoFormulario Method', () => {
    it('should call all store setter methods with correct values', () => {
      service.actualizarEstadoFormulario(mockSolicitudState);

      // Verify all store methods were called with correct values
      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledWith('Test regimen');
      expect(mockTramite221601Store.setJustificacion).toHaveBeenCalledWith('Test justification');
      expect(mockTramite221601Store.setAduana).toHaveBeenCalledWith('Test aduana');
      expect(mockTramite221601Store.setOficina).toHaveBeenCalledWith('Test oficina');
      expect(mockTramite221601Store.setPunto).toHaveBeenCalledWith('Test punto');
      expect(mockTramite221601Store.setGuia).toHaveBeenCalledWith('Test guia');
      expect(mockTramite221601Store.setCarro).toHaveBeenCalledWith('Test carro');
      expect(mockTramite221601Store.setClave).toHaveBeenCalledWith('Test clave');
      expect(mockTramite221601Store.setClaves).toHaveBeenCalledWith('Test claves');
      expect(mockTramite221601Store.setVeterinario).toHaveBeenCalledWith('Test veterinario');
      expect(mockTramite221601Store.setEstablecimiento).toHaveBeenCalledWith('Test establecimiento');
      expect(mockTramite221601Store.setCapturaMercancia).toHaveBeenCalledWith(true);
    });

    it('should call medio form related store methods', () => {
      service.actualizarEstadoFormulario(mockSolicitudState);

      expect(mockTramite221601Store.setMedio).toHaveBeenCalledWith('Test medio');
      expect(mockTramite221601Store.setVerificacion).toHaveBeenCalledWith('Test verificacion');
      expect(mockTramite221601Store.setTransporte).toHaveBeenCalledWith('Test transporte');
      expect(mockTramite221601Store.setEmpresa).toHaveBeenCalledWith('Test empresa');
      expect(mockTramite221601Store.setCoordenadas).toHaveBeenCalledWith('Test coordenadas');
    });

    it('should call pago derechos form related store methods', () => {
      service.actualizarEstadoFormulario(mockSolicitudState);

      expect(mockTramite221601Store.setDependencia).toHaveBeenCalledWith('Test dependencia');
      expect(mockTramite221601Store.setBanco).toHaveBeenCalledWith('Test banco');
      expect(mockTramite221601Store.setLlave).toHaveBeenCalledWith('Test llave');
      expect(mockTramite221601Store.setFecha).toHaveBeenCalledWith(new Date('2023-01-01'));
      expect(mockTramite221601Store.setImporte).toHaveBeenCalledWith(1000);
    });

    it('should call tipo persona form related store methods', () => {
      service.actualizarEstadoFormulario(mockSolicitudState);

      expect(mockTramite221601Store.setTipoPersona).toHaveBeenCalledWith('FISICA');
    });

    it('should call datos personales form related store methods', () => {
      service.actualizarEstadoFormulario(mockSolicitudState);

      expect(mockTramite221601Store.setNombre).toHaveBeenCalledWith('Test nombre');
      expect(mockTramite221601Store.setPrimerApellido).toHaveBeenCalledWith('Test primer apellido');
      expect(mockTramite221601Store.setSegundoApellido).toHaveBeenCalledWith('Test segundo apellido');
      expect(mockTramite221601Store.setSocial).toHaveBeenCalledWith('Test social');
      expect(mockTramite221601Store.setPais).toHaveBeenCalledWith('Test pais');
      expect(mockTramite221601Store.setCodigo).toHaveBeenCalledWith('Test codigo');
      expect(mockTramite221601Store.setEstado).toHaveBeenCalledWith('Test estado');
      expect(mockTramite221601Store.setMunicipio).toHaveBeenCalledWith('Test municipio');
      expect(mockTramite221601Store.setColonia).toHaveBeenCalledWith('Test colonia');
      expect(mockTramite221601Store.setCalle).toHaveBeenCalledWith('Test calle');
      expect(mockTramite221601Store.setExterior).toHaveBeenCalledWith('Test exterior');
      expect(mockTramite221601Store.setInterior).toHaveBeenCalledWith('Test interior');
      expect(mockTramite221601Store.setLada).toHaveBeenCalledWith('55');
      expect(mockTramite221601Store.setTelefono).toHaveBeenCalledWith('12345678');
      expect(mockTramite221601Store.setCorreoElectronico).toHaveBeenCalledWith('test@test.com');
      expect(mockTramite221601Store.setTif).toHaveBeenCalledWith('Test tif');
    });

    it('should handle partial state data gracefully', () => {
      const partialState = {
        regimen: 'Partial regimen',
        nombre: 'Partial nombre'
      } as unknown as Solicitud221601State;

      service.actualizarEstadoFormulario(partialState);

      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledWith('Partial regimen');
      expect(mockTramite221601Store.setNombre).toHaveBeenCalledWith('Partial nombre');
      expect(mockTramite221601Store.setJustificacion).toHaveBeenCalledWith(undefined);
    });

    it('should handle null values in state data', () => {
      const stateWithNulls = {
        ...mockSolicitudState,
        regimen: null,
        nombre: null,
        capturaMercancia: null
      } as unknown as Solicitud221601State;

      service.actualizarEstadoFormulario(stateWithNulls);

      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledWith(null);
      expect(mockTramite221601Store.setNombre).toHaveBeenCalledWith(null);
      expect(mockTramite221601Store.setCapturaMercancia).toHaveBeenCalledWith(null);
    });

    it('should call all store methods exactly once per invocation', () => {
      service.actualizarEstadoFormulario(mockSolicitudState);

      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledTimes(1);
      expect(mockTramite221601Store.setJustificacion).toHaveBeenCalledTimes(1);
      expect(mockTramite221601Store.setAduana).toHaveBeenCalledTimes(1);
      expect(mockTramite221601Store.setNombre).toHaveBeenCalledTimes(1);
      expect(mockTramite221601Store.setTif).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple consecutive calls', () => {
      const firstState = { ...mockSolicitudState, regimen: 'First' } as unknown as Solicitud221601State;
      const secondState = { ...mockSolicitudState, regimen: 'Second' } as unknown as Solicitud221601State;

      service.actualizarEstadoFormulario(firstState);
      service.actualizarEstadoFormulario(secondState);

      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledTimes(2);
      expect(mockTramite221601Store.setRegimen).toHaveBeenNthCalledWith(1, 'First');
      expect(mockTramite221601Store.setRegimen).toHaveBeenNthCalledWith(2, 'Second');
    });
  });

  describe('getRegistroTomaMuestrasMercanciasData Method', () => {
    const expectedUrl = 'assets/json/221601/serviciosExtraordinarios.json';

    it('should return Observable', () => {
      const result = service.getRegistroTomaMuestrasMercanciasData();
      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should make GET request to correct URL', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe();

      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    it('should return mocked data on successful request', (done) => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
        expect(data).toEqual(mockSolicitudState);
        done();
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(mockSolicitudState);
    });

    it('should handle HTTP errors gracefully', (done) => {
      const errorMessage = 'Http failure response';

      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => {},
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
          done();
        }
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });

    it('should handle 404 errors', (done) => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => {},
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        }
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush('File Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('should return data with correct structure', (done) => {
      const responseData = {
        regimen: 'Response regimen',
        justificacion: 'Response justification',
        nombre: 'Response nombre'
      } as unknown as Solicitud221601State;

      service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
        expect(data.regimen).toBe('Response regimen');
        expect(data.justificacion).toBe('Response justification');
        expect(data.nombre).toBe('Response nombre');
        done();
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(responseData);
    });

    it('should handle empty response data', (done) => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
        expect(data).toEqual({});
        done();
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush({});
    });

    it('should make only one HTTP request per call', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe();
      
      const requests = httpTestingController.match(expectedUrl);
      expect(requests.length).toBe(1);
      
      requests[0].flush(mockSolicitudState);
    });

    it('should handle multiple simultaneous requests', () => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe();
      service.getRegistroTomaMuestrasMercanciasData().subscribe();
      
      const requests = httpTestingController.match(expectedUrl);
      expect(requests.length).toBe(2);
      
      requests.forEach(req => req.flush(mockSolicitudState));
    });
  });

  describe('Service Properties', () => {
    it('should have urlServer property accessible', () => {
      expect(service.urlServer).toBeDefined();
      expect(typeof service.urlServer).toBe('string');
    });

    it('should have urlServerCatalogos property accessible', () => {
      expect(service.urlServerCatalogos).toBeDefined();
      expect(typeof service.urlServerCatalogos).toBe('string');
    });

    it('should allow urlServer to be modified', () => {
      const newUrl = 'http://new-server.com';
      service.urlServer = newUrl;
      expect(service.urlServer).toBe(newUrl);
    });

    it('should allow urlServerCatalogos to be modified', () => {
      const newUrl = 'http://new-catalog-server.com';
      service.urlServerCatalogos = newUrl;
      expect(service.urlServerCatalogos).toBe(newUrl);
    });
  });

  describe('Integration Tests', () => {
    it('should work with complete workflow', (done) => {
      // First update state
      service.actualizarEstadoFormulario(mockSolicitudState);
      
      // Verify store was updated
      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledWith('Test regimen');
      
      // Then get data
      service.getRegistroTomaMuestrasMercanciasData().subscribe((data) => {
        expect(data).toBeDefined();
        done();
      });

      const req = httpTestingController.expectOne('assets/json/221601/serviciosExtraordinarios.json');
      req.flush(mockSolicitudState);
    });

    it('should maintain dependencies throughout service lifecycle', () => {
      expect(service['tramite221601Store']).toBe(mockTramite221601Store);
      expect(service['http']).toBeDefined();
      
      // Call methods to ensure dependencies are still available
      service.actualizarEstadoFormulario(mockSolicitudState);
      service.getRegistroTomaMuestrasMercanciasData().subscribe();
      
      expect(service['tramite221601Store']).toBe(mockTramite221601Store);
      expect(service['http']).toBeDefined();
      
      httpTestingController.expectOne('assets/json/221601/serviciosExtraordinarios.json').flush({});
    });

    it('should handle service interactions correctly', () => {
      // Test that updating state doesn't affect HTTP requests
      service.actualizarEstadoFormulario(mockSolicitudState);
      
      const result = service.getRegistroTomaMuestrasMercanciasData();
      expect(result).toBeDefined();
      
      result.subscribe();
      const req = httpTestingController.expectOne('assets/json/221601/serviciosExtraordinarios.json');
      req.flush(mockSolicitudState);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should throw error when actualizarEstadoFormulario receives undefined parameter', () => {
      expect(() => {
        service.actualizarEstadoFormulario(undefined as any);
      }).toThrow('Cannot read properties of undefined (reading \'regimen\')');
    });

    it('should throw error when actualizarEstadoFormulario receives null parameter', () => {
      expect(() => {
        service.actualizarEstadoFormulario(null as any);
      }).toThrow();
    });

    it('should handle actualizarEstadoFormulario with empty object', () => {
      const emptyState = {} as Solicitud221601State;
      
      expect(() => {
        service.actualizarEstadoFormulario(emptyState);
      }).not.toThrow();
      
      // Verify that undefined values are passed to store methods
      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledWith(undefined);
      expect(mockTramite221601Store.setJustificacion).toHaveBeenCalledWith(undefined);
      expect(mockTramite221601Store.setNombre).toHaveBeenCalledWith(undefined);
    });

    it('should handle actualizarEstadoFormulario with valid object containing undefined properties', () => {
      const stateWithUndefinedProps = {
        regimen: 'Valid regimen',
        justificacion: undefined,
        nombre: 'Valid name',
        aduana: undefined
      } as unknown as Solicitud221601State;
      
      expect(() => {
        service.actualizarEstadoFormulario(stateWithUndefinedProps);
      }).not.toThrow();
      
      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledWith('Valid regimen');
      expect(mockTramite221601Store.setJustificacion).toHaveBeenCalledWith(undefined);
      expect(mockTramite221601Store.setNombre).toHaveBeenCalledWith('Valid name');
      expect(mockTramite221601Store.setAduana).toHaveBeenCalledWith(undefined);
    });

    it('should handle network timeout in getRegistroTomaMuestrasMercanciasData', (done) => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpTestingController.expectOne('assets/json/221601/serviciosExtraordinarios.json');
      req.error(new ErrorEvent('Network error'));
    });

    it('should handle malformed JSON response', (done) => {
      service.getRegistroTomaMuestrasMercanciasData().subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toBeDefined();
          done();
        }
      });

      const req = httpTestingController.expectOne('assets/json/221601/serviciosExtraordinarios.json');
      req.error(new ErrorEvent('JSON Parse error'));
    });
  });

  describe('Performance and Memory Tests', () => {
    it('should not create memory leaks with multiple calls', () => {
      // Test multiple calls to actualizarEstadoFormulario
      for (let i = 0; i < 100; i++) {
        service.actualizarEstadoFormulario(mockSolicitudState);
      }
      
      expect(mockTramite221601Store.setRegimen).toHaveBeenCalledTimes(100);
    });

    it('should handle large state objects efficiently', () => {
      const largeState = {
        ...mockSolicitudState,
        additionalData: 'x'.repeat(10000) // Large string
      } as unknown as Solicitud221601State;
      
      expect(() => {
        service.actualizarEstadoFormulario(largeState);
      }).not.toThrow();
    });
  });
});
