import { TestBed } from '@angular/core/testing';
import { of, throwError, Observable } from 'rxjs';
import { ZoosanitarioService } from './zoosanitario.service';
import { Tramite221601Query } from '../../../estados/queries/tramite221601.query';
import { Solicitud221601State } from '../../../estados/tramites/tramite221601.store';
import { ZoosanitarioPayload } from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';

describe('ZoosanitarioService', () => {
  let service: ZoosanitarioService;
  let mockTramite221601Query: jest.Mocked<Tramite221601Query>;
  let mockSolicitudState: Solicitud221601State;

  beforeEach(() => {
    // Create a complete mock state object with all required properties
    mockSolicitudState = {
      justificacion: 'Test justification',
      aduana: 'Test aduana',
      oficina: 'Test oficina',
      punto: 'Test punto',
      guia: 'Test guia',
      regimen: 'Test regimen',
      carro: 'Test carro',
      clave: 'Test clave',
      claves: 'Test claves',
      veterinario: 'Test veterinario',
      establecimiento: 'Test establecimiento',
      capturaMercancia: true,
      medio: 'Test medio',
      transporte: 'Test transporte',
      verificacion: 'Test verificacion',
      empresa: 'Test empresa',
      coordenadas: 'Test coordenadas',
      dependencia: 'Test dependencia',
      banco: 'Test banco',
      llave: 'Test llave',
      fecha: new Date('2023-01-01'),
      importe: 1000,
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

    // Create mock for Tramite221601Query
    mockTramite221601Query = {
      selectSolicitud$: of(mockSolicitudState)
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ZoosanitarioService,
        { provide: Tramite221601Query, useValue: mockTramite221601Query }
      ]
    });
    
    service = TestBed.inject(ZoosanitarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Service Initialization', () => {
    it('should inject Tramite221601Query dependency', () => {
      expect(service['tramite221601Query']).toBeDefined();
      expect(service['tramite221601Query']).toBe(mockTramite221601Query);
    });

    it('should initialize with null storedPayload', () => {
      expect(service.storedPayload).toBeNull();
    });

    // it('should have solicitudState property', () => {
    //   expect('solicitudState' in service).toBe(true);
    // });
  });

  describe('getPayload Method', () => {
    it('should return Observable', () => {
      const result = service.getPayload();
      expect(result).toBeDefined();
      expect(typeof result.subscribe).toBe('function');
    });

    it('should call tramite221601Query.selectSolicitud$', () => {
      // Since selectSolicitud$ is a property, not a method, we verify it gets accessed
      // by checking if the observable subscription works
      let subscriptionCalled = false;
      
      service.getPayload().subscribe(() => {
        subscriptionCalled = true;
      });
      
      expect(subscriptionCalled).toBe(true);
    });

    it('should transform Solicitud221601State to ZoosanitarioPayload', (done) => {
      service.getPayload().subscribe((payload: ZoosanitarioPayload | null) => {
        expect(payload).toBeDefined();
        expect(payload).not.toBeNull();
        
        if (payload) {
          // Test datosSolicitud transformation
          expect(payload.datosSolicitud).toBeDefined();
          expect(payload.datosSolicitud.justificacion).toBe('Test justification');
          expect(payload.datosSolicitud.aduana).toBe('Test aduana');
          expect(payload.datosSolicitud.oficina).toBe('Test oficina');
          expect(payload.datosSolicitud.punto).toBe('Test punto');
          expect(payload.datosSolicitud.guia).toBe('Test guia');
          expect(payload.datosSolicitud.regimen).toBe('Test regimen');
          expect(payload.datosSolicitud.carro).toBe('Test carro');
          expect(payload.datosSolicitud.clave).toBe('Test clave');
          expect(payload.datosSolicitud.claves).toBe('Test claves');
          expect(payload.datosSolicitud.veterinario).toBe('Test veterinario');
          expect(payload.datosSolicitud.establecimiento).toBe('Test establecimiento');
          expect(payload.datosSolicitud.capturaMercancia).toBe(true);
          
          // Test medioForm transformation
          expect(payload.medioForm).toBeDefined();
          expect(payload.medioForm.medio).toBe('Test medio');
          expect(payload.medioForm.transporte).toBe('Test transporte');
          expect(payload.medioForm.verificacion).toBe('Test verificacion');
          expect(payload.medioForm.empresa).toBe('Test empresa');
          expect(payload.medioForm.coordenadas).toBe('Test coordenadas');
          
          // Test pagoDerechosForm transformation
          expect(payload.pagoDerechosForm).toBeDefined();
          expect(payload.pagoDerechosForm.claves).toBe('Test claves');
          expect(payload.pagoDerechosForm.dependencia).toBe('Test dependencia');
          expect(payload.pagoDerechosForm.banco).toBe('Test banco');
          expect(payload.pagoDerechosForm.llave).toBe('Test llave');
          expect(payload.pagoDerechosForm.fecha).toEqual(new Date('2023-01-01'));
          expect(payload.pagoDerechosForm.importe).toBe(1000);
          
          // Test tipoPersonaForm transformation
          expect(payload.tipoPersonaForm).toBeDefined();
          expect(payload.tipoPersonaForm.tipoPersona).toBe('FISICA');
          
          // Test datosPersonales transformation
          expect(payload.datosPersonales).toBeDefined();
          expect(payload.datosPersonales.nombre).toBe('Test nombre');
          expect(payload.datosPersonales.primerApellido).toBe('Test primer apellido');
          expect(payload.datosPersonales.segundoApellido).toBe('Test segundo apellido');
          expect(payload.datosPersonales.social).toBe('Test social');
          expect(payload.datosPersonales.pais).toBe('Test pais');
          expect(payload.datosPersonales.codigo).toBe('Test codigo');
          expect(payload.datosPersonales.estado).toBe('Test estado');
          expect(payload.datosPersonales.municipio).toBe('Test municipio');
          expect(payload.datosPersonales.colonia).toBe('Test colonia');
          expect(payload.datosPersonales.calle).toBe('Test calle');
          expect(payload.datosPersonales.exterior).toBe('Test exterior');
          expect(payload.datosPersonales.interior).toBe('Test interior');
          expect(payload.datosPersonales.lada).toBe('55');
          expect(payload.datosPersonales.telefono).toBe('12345678');
          expect(payload.datosPersonales.correoElectronico).toBe('test@test.com');
          expect(payload.datosPersonales.tif).toBe('Test tif');
        }
        
        done();
      });
    });

    it('should store payload in storedPayload property', (done) => {
      expect(service.storedPayload).toBeNull();
      
      service.getPayload().subscribe((payload: ZoosanitarioPayload | null) => {
        expect(service.storedPayload).toBeDefined();
        expect(service.storedPayload).not.toBeNull();
        expect(service.storedPayload).toEqual(payload);
        done();
      });
    });

    it('should take only first emission', (done) => {
      // Test that the observable completes after first emission (indicating take(1) is used)
      let emissionCount = 0;
      
      service.getPayload().subscribe({
        next: () => {
          emissionCount++;
        },
        complete: () => {
          expect(emissionCount).toBe(1);
          done();
        }
      });
    });

    it('should handle empty state gracefully', (done) => {
      const emptyState = {} as unknown as Solicitud221601State;
      mockTramite221601Query.selectSolicitud$ = of(emptyState);
      
      service.getPayload().subscribe((payload: ZoosanitarioPayload | null) => {
        expect(payload).toBeDefined();
        expect(payload).not.toBeNull();
        
        if (payload) {
          expect(payload.datosSolicitud).toBeDefined();
          expect(payload.medioForm).toBeDefined();
          expect(payload.pagoDerechosForm).toBeDefined();
          expect(payload.tipoPersonaForm).toBeDefined();
          expect(payload.datosPersonales).toBeDefined();
        }
        
        done();
      });
    });
  });

  describe('Service Properties', () => {
    it('should have public storedPayload property', () => {
      expect(service.hasOwnProperty('storedPayload')).toBe(true);
      expect(service.storedPayload).toBeNull();
    });

    it('should have solicitudState property declared', () => {
      // Since solicitudState is declared with !, it exists but is undefined initially
      expect(() => service.solicitudState).not.toThrow();
      expect(service.solicitudState).toBeUndefined();
    });

    it('should allow storedPayload to be accessed and modified', () => {
      const testPayload = {
        datosSolicitud: { justificacion: 'test' },
        medioForm: {},
        pagoDerechosForm: {},
        tipoPersonaForm: {},
        datosPersonales: {}
      } as ZoosanitarioPayload;
      
      service.storedPayload = testPayload;
      expect(service.storedPayload).toEqual(testPayload);
      
      service.storedPayload = null;
      expect(service.storedPayload).toBeNull();
    });
  });

  describe('Integration Tests', () => {
    it('should work with complete workflow', (done) => {
      expect(service.storedPayload).toBeNull();
      
      service.getPayload().subscribe((payload: ZoosanitarioPayload | null) => {
        // Verify payload was received
        expect(payload).toBeDefined();
        expect(payload).not.toBeNull();
        
        // Verify payload was stored
        expect(service.storedPayload).toEqual(payload);
        
        // Verify all payload sections are properly structured
        if (payload) {
          expect(Object.keys(payload)).toEqual([
            'datosSolicitud',
            'medioForm',
            'pagoDerechosForm',
            'tipoPersonaForm',
            'datosPersonales'
          ]);
        }
        
        done();
      });
    });

    it('should handle multiple getPayload calls', (done) => {
      let callCount = 0;
      const expectedCalls = 2;
      
      const checkCall = (payload: ZoosanitarioPayload | null) => {
        callCount++;
        expect(payload).toBeDefined();
        expect(service.storedPayload).toEqual(payload);
        
        if (callCount === expectedCalls) {
          done();
        }
      };
      
      service.getPayload().subscribe(checkCall);
      service.getPayload().subscribe(checkCall);
    });

    it('should maintain dependency injection throughout service lifecycle', () => {
      expect(service['tramite221601Query']).toBe(mockTramite221601Query);
      
      // Call method to ensure dependency is still available
      service.getPayload().subscribe();
      
      expect(service['tramite221601Query']).toBe(mockTramite221601Query);
    });
  });

  describe('Error Handling', () => {
    it('should handle observable errors gracefully', () => {
      const errorMessage = 'Test error';
      mockTramite221601Query.selectSolicitud$ = throwError(() => new Error(errorMessage));
      
      expect(() => {
        service.getPayload().subscribe({
          next: () => {},
          error: (error) => {
            expect(error.message).toBe(errorMessage);
          }
        });
      }).not.toThrow();
    });

    it('should not modify storedPayload on error', (done) => {
      const initialPayload = service.storedPayload;
      mockTramite221601Query.selectSolicitud$ = throwError(() => new Error('Test error'));
      
      service.getPayload().subscribe({
        next: () => {},
        error: () => {
          expect(service.storedPayload).toBe(initialPayload);
          done();
        }
      });
    });
  });
});
