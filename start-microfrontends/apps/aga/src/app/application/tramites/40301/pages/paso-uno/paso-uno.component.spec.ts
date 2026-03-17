import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { PasoUnoComponent } from './paso-uno.component';
import { CapturarService } from '../../services/capturar.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Tramite40301State } from '../../estados/tramite40301.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockCapturarService: jest.Mocked<CapturarService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  const mockTramiteState: Tramite40301State = {
    cveFolioCaat: 'TEST-FOLIO-001',
    rol: 'Admin',
    tipoAgente: 'Agente naviero',
    directorGeneralNombre: 'Juan Carlos',
    primerApellido: 'Pérez',
    segundoApellido: 'García'
  };

  const mockConsultaState: ConsultaioState = {
    readonly: false,
    update: true
  } as unknown as ConsultaioState;

  beforeEach(async () => {
    // Create mock services
    mockCapturarService = {
      getTramiteSavedData: jest.fn().mockReturnValue(of(mockTramiteState)),
      actualizarEstadoFormulario: jest.fn()
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: of(mockConsultaState)
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: CapturarService, useValue: mockCapturarService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Tests for guardarDatosFormulario function
   */
  describe('#guardarDatosFormulario', () => {
    beforeEach(() => {
      // Initialize the destroyNotifier$ subject
      component.destroyNotifier$ = new Subject<void>();
    });

    it('should load tramite data and update form state when response is valid', () => {
      // Act
      component.guardarDatosFormulario();

      // Assert
      expect(mockCapturarService.getTramiteSavedData).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockCapturarService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockTramiteState);
    });

    it('should not update form state when response is null', () => {
      // Arrange
      mockCapturarService.getTramiteSavedData.mockReturnValue(of(null as any));

      // Act
      component.guardarDatosFormulario();

      // Assert
      expect(mockCapturarService.getTramiteSavedData).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(false);
      expect(mockCapturarService.actualizarEstadoFormulario).not.toHaveBeenCalled();
    });

    it('should not update form state when response is undefined', () => {
      // Arrange
      mockCapturarService.getTramiteSavedData.mockReturnValue(of(undefined as any));

      // Act
      component.guardarDatosFormulario();

      // Assert
      expect(mockCapturarService.getTramiteSavedData).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(false);
      expect(mockCapturarService.actualizarEstadoFormulario).not.toHaveBeenCalled();
    });

    it('should handle service errors gracefully', () => {
      // Arrange
      const errorMessage = 'Service error occurred';
      mockCapturarService.getTramiteSavedData.mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act & Assert - Should not throw
      expect(() => component.guardarDatosFormulario()).not.toThrow();
      expect(mockCapturarService.getTramiteSavedData).toHaveBeenCalled();
      expect(mockCapturarService.actualizarEstadoFormulario).not.toHaveBeenCalled();
    });

    it('should handle empty tramite state object', () => {
      // Arrange
      const emptyTramiteState = {} as Tramite40301State;
      mockCapturarService.getTramiteSavedData.mockReturnValue(of(emptyTramiteState));

      // Act
      component.guardarDatosFormulario();

      // Assert
      expect(mockCapturarService.getTramiteSavedData).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockCapturarService.actualizarEstadoFormulario).toHaveBeenCalledWith(emptyTramiteState);
    });

    it('should complete subscription when component is destroyed', () => {
      // Arrange
      const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
      const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');

      // Act
      component.guardarDatosFormulario();
      component.ngOnDestroy();

      // Assert
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
      expect(mockCapturarService.getTramiteSavedData).toHaveBeenCalled();
    });

    it('should use takeUntil operator to manage subscription lifecycle', () => {
      // Arrange
      let subscriptionActive = true;
      mockCapturarService.getTramiteSavedData.mockReturnValue(
        new (require('rxjs').Observable)((subscriber: any) => {
          const timer = setTimeout(() => {
            if (subscriptionActive) {
              subscriber.next(mockTramiteState);
              subscriber.complete();
            }
          }, 100);

          return () => {
            subscriptionActive = false;
            clearTimeout(timer);
          };
        })
      );

      // Act
      component.guardarDatosFormulario();
      
      // Simulate component destruction
      component.destroyNotifier$.next();
      component.destroyNotifier$.complete();

      // Assert
      expect(subscriptionActive).toBe(false);
    });

    it('should handle partial tramite state data', () => {
      // Arrange
      const partialTramiteState: Partial<Tramite40301State> = {
        cveFolioCaat: 'PARTIAL-FOLIO',
        rol: 'User'
        // Missing other properties
      };
      mockCapturarService.getTramiteSavedData.mockReturnValue(of(partialTramiteState as Tramite40301State));

      // Act
      component.guardarDatosFormulario();

      // Assert
      expect(mockCapturarService.getTramiteSavedData).toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
      expect(mockCapturarService.actualizarEstadoFormulario).toHaveBeenCalledWith(partialTramiteState);
    });
  });

  /**
   * Integration test for ngOnInit and guardarDatosFormulario
   */
  describe('Integration: ngOnInit with guardarDatosFormulario', () => {
    it('should call guardarDatosFormulario when consultaDatos.update is true', () => {
      // Arrange
      const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
      mockConsultaioQuery.selectConsultaioState$ = of({ ...mockConsultaState, update: true });

      // Act
      component.ngOnInit();

      // Assert
      expect(guardarDatosFormularioSpy).toHaveBeenCalled();
      expect(component.consultaDatos.update).toBe(true);
    });

    it('should not call guardarDatosFormulario when consultaDatos.update is false', () => {
      // Arrange
      const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
      mockConsultaioQuery.selectConsultaioState$ = of({ ...mockConsultaState, update: false });

      // Act
      component.ngOnInit();

      // Assert
      expect(guardarDatosFormularioSpy).not.toHaveBeenCalled();
      expect(component.esDatosRespuesta).toBe(true);
    });
  });
});
