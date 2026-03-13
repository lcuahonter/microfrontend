import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';

import { ConsultaDatosService } from './consulta-datos.servicio';
import { Tramite240118Store } from '../estados/tramite240118Store.store';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { Tramite240118State } from '../estados/tramite240118Store.store';

describe('ConsultaDatosService', () => {
  let service: ConsultaDatosService;
  let httpTestingController: HttpTestingController;
  let mockTramiteStore: jest.Mocked<Tramite240118Store>;
  let mockSeccionStore: jest.Mocked<SeccionLibStore>;

  const mockTramite240118State: Partial<Tramite240118State> = {
    tabSeleccionado: 1,
    datosDelTramite: {
      numeroSolicitud: '123456789',
      fechaSolicitud: '2023-12-01'
    } as any,
    pagoDerechos: {
      claveReferencia: 'REF123456',
      cadenaDependencia: 'CADENA123'
    } as any,
    destinatarioFinalTablaDatos: [
      {
        nombreRazonSocial: 'Empresa Test S.A. de C.V.',
        rfc: 'ETE123456789',
        curp: 'CURP123456789012345',
        telefono: '5551234567',
        correoElectronico: 'test@empresa.com',
        calle: 'Av. Principal',
        numeroExterior: '123',
        numeroInterior: 'A',
        pais: 'México',
        colonia: 'Centro',
        municipioAlcaldia: 'Miguel Hidalgo',
        localidad: 'Ciudad de México',
        entidadFederativa: 'CDMX',
        estadoLocalidad: 'CDMX',
        codigoPostal: '11000'
      }
    ] as any,
    proveedorTablaDatos: [
      {
        nombreRazonSocial: 'Proveedor Test S.A.',
        rfc: 'PTE987654321',
        curp: 'CURP987654321098765',
        telefono: '5559876543',
        correoElectronico: 'proveedor@test.com',
        calle: 'Calle Secundaria',
        numeroExterior: '456',
        numeroInterior: 'B',
        pais: 'México',
        colonia: 'Roma Norte',
        municipioAlcaldia: 'Cuauhtémoc',
        localidad: 'Ciudad de México',
        entidadFederativa: 'CDMX',
        estadoLocalidad: 'CDMX',
        codigoPostal: '06700'
      }
    ] as any,
    merccancialTablaDatos: [
      {
        descripcion: 'Producto de prueba',
        cantidad: 50,
        valorMercancia: '25000.00'
      }
    ] as any
  };

  beforeEach(async () => {
    mockTramiteStore = {
      updateDatosDelTramiteFormState: jest.fn(),
      updatePagoDerechosFormState: jest.fn(),
      updateDestinatarioFinalTablaDatos: jest.fn(),
      updateProveedorTablaDatos: jest.fn(),
      updateMercanciaTablaDatos: jest.fn(),
    } as any;

    mockSeccionStore = {
      updateSeccion: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConsultaDatosService,
        { provide: Tramite240118Store, useValue: mockTramiteStore },
        { provide: SeccionLibStore, useValue: mockSeccionStore }
      ]
    }).compileComponents();

    service = TestBed.inject(ConsultaDatosService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    jest.clearAllMocks();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
      expect(service).toBeInstanceOf(ConsultaDatosService);
    });

    it('should inject dependencies correctly', () => {
      expect(service['http']).toBeDefined();
      expect(service['tramiteStore']).toBeDefined();
      expect(service['seccionStore']).toBeDefined();
    });
  });

  describe('updateDatosDel', () => {
    it('should call tramiteStore.updateDatosDelTramiteFormState with provided data', () => {
      const testData = mockTramite240118State.datosDelTramite;
      service.updateDatosDel(testData as any);
      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(testData);
    });

    it('should handle null data gracefully', () => {
      service.updateDatosDel(null as any);
      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(null);
    });
  });

  describe('updatePagoDerechos', () => {
    it('should call tramiteStore.updatePagoDerechosFormState with provided data', () => {
      const testData = mockTramite240118State.pagoDerechos;
      service.updatePagoDerechos(testData as any);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(testData);
    });

    it('should handle undefined data gracefully', () => {
      service.updatePagoDerechos(undefined as any);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(undefined);
    });
  });

  describe('updateDestinatario', () => {
    it('should call tramiteStore.updateDestinatarioFinalTablaDatos with provided data', () => {
      const testData = mockTramite240118State.destinatarioFinalTablaDatos;
      service.updateDestinatario(testData as any);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(testData);
    });

    it('should handle empty array', () => {
      const emptyArray: any[] = [];
      service.updateDestinatario(emptyArray);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(emptyArray);
    });
  });

  describe('updateProveedor', () => {
    it('should call tramiteStore.updateProveedorTablaDatos with provided data', () => {
      const testData = mockTramite240118State.proveedorTablaDatos;
      service.updateProveedor(testData as any);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(testData);
    });

    it('should handle multiple providers', () => {
      const multipleProviders = [
        mockTramite240118State.proveedorTablaDatos![0],
        { ...mockTramite240118State.proveedorTablaDatos![0], nombreRazonSocial: 'Segundo Proveedor' }
      ];
      service.updateProveedor(multipleProviders as any);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(multipleProviders);
    });
  });

  describe('updateMercancia', () => {
    it('should call tramiteStore.updateMercanciaTablaDatos with provided data', () => {
      const testData = mockTramite240118State.merccancialTablaDatos;
      service.updateMercancia(testData as any);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledWith(testData);
    });

    it('should handle single merchandise item', () => {
      const singleItem = [mockTramite240118State.merccancialTablaDatos![0]];
      service.updateMercancia(singleItem as any);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledWith(singleItem);
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should call all update methods with corresponding data from state parameter', () => {
      const testState = mockTramite240118State as any;
      service.actualizarEstadoFormulario(testState);

      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(testState.datosDelTramite);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(testState.pagoDerechos);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(testState.destinatarioFinalTablaDatos);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(testState.proveedorTablaDatos);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledWith(testState.merccancialTablaDatos);

      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledTimes(1);
    });

    it('should handle partial state updates', () => {
      const partialState = {
        datosDelTramite: mockTramite240118State.datosDelTramite,
        pagoDerechos: null,
        destinatarioFinalTablaDatos: [],
        proveedorTablaDatos: undefined,
        merccancialTablaDatos: mockTramite240118State.merccancialTablaDatos
      } as any;

      service.actualizarEstadoFormulario(partialState);

      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(partialState.datosDelTramite);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(null);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith([]);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(undefined);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledWith(partialState.merccancialTablaDatos);
    });
  });

  describe('getDatosDeLaSolicitudData', () => {
    const expectedUrl = 'assets/json/240118/consulta-datos.json';
    it('should make GET request to correct URL and return Observable<Tramite240118State>', (done) => {
      service.getDatosDeLaSolicitudData().subscribe(response => {
        expect(response).toEqual(mockTramite240118State);
        done();
      });

      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(expectedUrl);
      
      req.flush(mockTramite240118State);
    });

    it('should handle HTTP 404 error', (done) => {
      // Arrange
      const errorResponse = { status: 404, statusText: 'Not Found' };
      const errorMessage = 'Http failure response for assets/json/240118/consulta-datos.json: 404 Not Found';

      service.getDatosDeLaSolicitudData().subscribe({
        next: () => {
          done.fail('Expected error, but got success response');
        },
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        }
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(null, errorResponse);
    });

    it('should handle HTTP 500 server error', (done) => {
      const errorResponse = { status: 500, statusText: 'Internal Server Error' };

      service.getDatosDeLaSolicitudData().subscribe({
        next: () => {
          done.fail('Expected error, but got success response');
        },
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
          done();
        }
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush('Server Error', errorResponse);
    });

    it('should return Observable that can be subscribed multiple times', () => {
      let firstResponse: any;
      let secondResponse: any;
      const observable = service.getDatosDeLaSolicitudData();

      observable.subscribe(response => firstResponse = response);
      observable.subscribe(response => secondResponse = response);

      const requests = httpTestingController.match(expectedUrl);
      expect(requests.length).toBe(2);

      requests[0].flush(mockTramite240118State);
      requests[1].flush(mockTramite240118State);

      expect(firstResponse).toEqual(mockTramite240118State);
      expect(secondResponse).toEqual(mockTramite240118State);
    });

    it('should handle empty response', (done) => {
      const emptyResponse = {};

      service.getDatosDeLaSolicitudData().subscribe(response => {
        expect(response).toEqual(emptyResponse);
        done();
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(emptyResponse);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete workflow: update all sections then fetch data', (done) => {
      const expectedUrl = 'assets/json/240118/consulta-datos.json';

      service.updateDatosDel(mockTramite240118State.datosDelTramite as any);
      service.updatePagoDerechos(mockTramite240118State.pagoDerechos as any);
      service.updateDestinatario(mockTramite240118State.destinatarioFinalTablaDatos as any);
      service.updateProveedor(mockTramite240118State.proveedorTablaDatos as any);
      service.updateMercancia(mockTramite240118State.merccancialTablaDatos as any);

      service.getDatosDeLaSolicitudData().subscribe(fetchedData => {
        expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
        expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalled();
        expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
        expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalled();
        expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalled();

        expect(fetchedData).toEqual(mockTramite240118State);
        done();
      });

      const req = httpTestingController.expectOne(expectedUrl);
      req.flush(mockTramite240118State);
    });

    it('should maintain state consistency when updating and fetching data', (done) => {
      const updatedState = {
        ...mockTramite240118State,
        datosDelTramite: { ...mockTramite240118State.datosDelTramite, numeroSolicitud: 'UPDATED123' }
      };

      service.actualizarEstadoFormulario(updatedState as any);

      service.getDatosDeLaSolicitudData().subscribe(response => {
        expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(updatedState.datosDelTramite);
        expect(response).toEqual(updatedState);
        done();
      });

      const req = httpTestingController.expectOne('assets/json/240118/consulta-datos.json');
      req.flush(updatedState);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null state in actualizarEstadoFormulario', () => {
      const nullState = {
        datosDelTramite: null,
        pagoDerechos: null,
        destinatarioFinalTablaDatos: null,
        proveedorTablaDatos: null,
        merccancialTablaDatos: null
      } as any;

      service.actualizarEstadoFormulario(nullState);

      expect(mockTramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalledWith(null);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(null);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(null);
      expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(null);
      expect(mockTramiteStore.updateMercanciaTablaDatos).toHaveBeenCalledWith(null);
    });

    it('should handle large arrays in update methods', () => {
      const largeArray = new Array(1000).fill(mockTramite240118State.destinatarioFinalTablaDatos![0]);
      service.updateDestinatario(largeArray);

      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(largeArray);
      expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent HTTP requests', () => {
      let firstResponse: any;
      let secondResponse: any;

      service.getDatosDeLaSolicitudData().subscribe(response => firstResponse = response);
      service.getDatosDeLaSolicitudData().subscribe(response => secondResponse = response);

      const requests = httpTestingController.match('assets/json/240118/consulta-datos.json');
      expect(requests.length).toBe(2);

      requests[0].flush({ ...mockTramite240118State, tabSeleccionado: 1 });
      requests[1].flush({ ...mockTramite240118State, tabSeleccionado: 2 });

      expect(firstResponse.tabSeleccionado).toBe(1);
      expect(secondResponse.tabSeleccionado).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should not throw error when store methods throw', () => {
      mockTramiteStore.updateDatosDelTramiteFormState.mockImplementation(() => {
        throw new Error('Store error');
      });
      expect(() => {
        service.updateDatosDel(mockTramite240118State.datosDelTramite as any);
      }).toThrow('Store error');
    });

    it('should handle network timeout errors', (done) => {
      service.getDatosDeLaSolicitudData().subscribe({
        next: () => done.fail('Expected error'),
        error: (error) => {
          expect(error.name).toBe('HttpErrorResponse');
          done();
        }
      });

      const req = httpTestingController.expectOne('assets/json/240118/consulta-datos.json');
      req.error(new ProgressEvent('timeout'), { status: 0, statusText: 'Timeout' });
    });
  });
});
