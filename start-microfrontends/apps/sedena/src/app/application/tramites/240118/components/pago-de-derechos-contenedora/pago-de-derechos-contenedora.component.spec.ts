import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, Subject } from 'rxjs';

import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { Tramite240118Query } from '../../estados/tramite240118Query.query';
import { Tramite240118Store } from '../../estados/tramite240118Store.store';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

describe('PagoDeDerechosContenedoraComponent', () => {
  let component: PagoDeDerechosContenedoraComponent;
  let fixture: ComponentFixture<PagoDeDerechosContenedoraComponent>;
  let mockTramiteQuery: jest.Mocked<Tramite240118Query>;
  let mockTramiteStore: jest.Mocked<Tramite240118Store>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let mockDatosSolicitudService: jest.Mocked<DatosSolicitudService>;

  const mockPagoDerechosState: PagoDerechosFormState = {
    claveReferencia: 'REF123456789',
    cadenaDependencia: 'CADENA123',
    banco: 'Banco Test',
    llavePago: 'LLAVE123',
    fechaPago: '05/06/2025',
    importePago: '1500.50'
  };

  const mockConsultaioState: ConsultaioState = {
    procedureId: '240118',
    parameter: 'test-param',
    department: 'SEDENA',
    folioTramite: 'FOL123456',
    tipoDeTramite: 'Solicitud de permiso',
    estadoDeTramite: 'En proceso',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null,
    action_id: 'ACT001',
    current_user: 'test-user',
    id_solicitud: 'SOL123',
    nombre_pagina: 'pago-derechos'
  };

  beforeEach(async () => {
    mockTramiteQuery = {
      getPagoDerechos$: of(mockPagoDerechosState)
    } as any;

    mockTramiteStore = {
      updatePagoDerechosFormState: jest.fn()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaioState)
    } as any;

    mockDatosSolicitudService = {
      obtenerBancoCatalogo: jest.fn().mockReturnValue(of([])),
      obtenerBancos: jest.fn().mockReturnValue(of([])),
    } as any;

    await TestBed.configureTestingModule({
      imports: [CommonModule, PagoDeDerechosContenedoraComponent],
      providers: [
        { provide: Tramite240118Query, useValue: mockTramiteQuery },
        { provide: Tramite240118Store, useValue: mockTramiteStore },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: DatosSolicitudService, useValue: mockDatosSolicitudService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (fixture) {
      fixture.destroy();
    }
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component).toBeInstanceOf(PagoDeDerechosContenedoraComponent);
    });

    it('should initialize with default values', () => {
      expect(component.esFormularioSoloLectura).toBe(false);
      expect(component.campoObligatorio).toBe(false);
    });

    it('should inject dependencies correctly', () => {
      expect(component['tramiteQuery']).toBeDefined();
      expect(component['tramiteStore']).toBeDefined();
      expect(component['consultaioQuery']).toBeDefined();
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to pago derechos state and update component state', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.pagoDerechoFormState).toEqual(mockPagoDerechosState);
    });

    it('should subscribe to consultaio state and update readonly flag', () => {
      const readonlyState = { ...mockConsultaioState, readonly: true };
      
      component['consultaioQuery'].selectConsultaioState$ = of(readonlyState);
      component.ngOnInit();
    
      fixture.detectChanges();
      
      expect(component.esFormularioSoloLectura).toBe(true);
    });

    it('should handle empty pago derechos state', () => {
      mockTramiteQuery.getPagoDerechos$ = of({} as PagoDerechosFormState);

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.pagoDerechoFormState).toEqual({});
    });

    it('should handle consultaio state changes', () => {
      const stateSubject = new Subject<ConsultaioState>();
      
      component['consultaioQuery'].selectConsultaioState$ = stateSubject.asObservable();
      component.ngOnInit();
      fixture.detectChanges();

      stateSubject.next({ ...mockConsultaioState, readonly: false });
      fixture.detectChanges();
      expect(component.esFormularioSoloLectura).toBe(false);

      stateSubject.next({ ...mockConsultaioState, readonly: true });
      fixture.detectChanges();
      expect(component.esFormularioSoloLectura).toBe(true);
    });
  });

  describe('updatePagoDerechos', () => {
    it('should call tramiteStore.updatePagoDerechosFormState with provided data', () => {
      const testData: PagoDerechosFormState = {
        ...mockPagoDerechosState,
        importePago: '2000.75'
      };

      component.updatePagoDerechos(testData);

      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(testData);
    });

    it('should handle null data', () => {
      component.updatePagoDerechos(null as any);

      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledTimes(1);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(null);
    });

    it('should handle partial data updates', () => {
      const partialData = {
        claveReferencia: 'NEW_REF',
        importePago: '500.00'
      } as Partial<PagoDerechosFormState>;

      component.updatePagoDerechos(partialData as PagoDerechosFormState);

      // Assert
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(partialData);
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroyNotifier$ subject', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(completeSpy).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe from observables to prevent memory leaks', () => {
      component.ngOnInit();
      const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      component.ngOnDestroy();
      expect(destroyNotifierSpy).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should accept esFormularioSoloLectura input', () => {
      expect(component.esFormularioSoloLectura).toBe(false);

      component.esFormularioSoloLectura = true;

      expect(component.esFormularioSoloLectura).toBe(true);
    });

    it('should have campoObligatorio set to false by default', () => {
      expect(component.campoObligatorio).toBe(false);
    });
  });

  describe('Component Integration', () => {
    it('should handle complete workflow: init -> update -> destroy', () => {
      const updatedData: PagoDerechosFormState = {
        ...mockPagoDerechosState,
        claveReferencia: 'UPDATED_REF'
      };

      component.ngOnInit();
      fixture.detectChanges();

      component.updatePagoDerechos(updatedData);

      component.ngOnDestroy();

      expect(component.pagoDerechoFormState).toEqual(mockPagoDerechosState);
      expect(mockTramiteStore.updatePagoDerechosFormState).toHaveBeenCalledWith(updatedData);
    });

    it('should maintain state consistency between query updates', () => {
      const stateSubject = new Subject<PagoDerechosFormState>();
      mockTramiteQuery.getPagoDerechos$ = stateSubject.asObservable();

      component.ngOnInit();

      stateSubject.next(mockPagoDerechosState);
      expect(component.pagoDerechoFormState).toEqual(mockPagoDerechosState);

      const updatedState = { ...mockPagoDerechosState, importePago: '3000.00' };
      stateSubject.next(updatedState);
      expect(component.pagoDerechoFormState).toEqual(updatedState);
    });
  });

  describe('Error Handling', () => {
    it('should handle store update errors gracefully', () => {
      mockTramiteStore.updatePagoDerechosFormState.mockImplementation(() => {
        throw new Error('Store error');
      });

      expect(() => {
        component.updatePagoDerechos(mockPagoDerechosState);
      }).toThrow('Store error');
    });

    it('should handle observable errors in ngOnInit', () => {
      mockTramiteQuery.getPagoDerechos$ = new Observable(subscriber => {
        subscriber.error(new Error('Observable error'));
      });

      expect(() => {
        component.ngOnInit();
      }).not.toThrow();
    });
  });

  describe('Observable Subscriptions', () => {
    it('should unsubscribe when destroyNotifier$ emits', () => {

      const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

      component.ngOnInit();
      fixture.detectChanges();
      component.ngOnDestroy();

      expect(destroyNotifierSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should handle multiple rapid state updates', () => {
      const stateSubject = new Subject<PagoDerechosFormState>();
      mockTramiteQuery.getPagoDerechos$ = stateSubject.asObservable();

      component.ngOnInit();

      for (let i = 0; i < 5; i++) {
        stateSubject.next({ ...mockPagoDerechosState, importePago: `${i * 100}.00` });
      }

      expect(component.pagoDerechoFormState.importePago).toBe('400.00');
    });
  });
});