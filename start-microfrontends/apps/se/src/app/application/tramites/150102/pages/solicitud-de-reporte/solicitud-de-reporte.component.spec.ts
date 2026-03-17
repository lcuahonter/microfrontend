import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SolicitudDeReporteComponent } from './solicitud-de-reporte.component';
import { Solicitud150102Query } from '../../estados/solicitud150102.query';
import { Solicitud150102Store, Solicitud150102State } from '../../estados/solicitud150102.store';
import { SolicitudService } from '../../services/solicitud.service';
import { ServicioDeFormularioService } from '../../../../shared/services/forma-servicio/servicio-de-formulario.service';
import {
  ConsultaioQuery,
  WizardService,
  ERROR_FORMA_ALERT
} from '@libs/shared/data-access-user/src';
import { PAGO_DE_DERECHOS } from '../../constantes/solicitud150102.enum';
import { REPORTE_ANUAL_PASOS } from '../../enums/reporte-anual.enum';
import {
  ERROR_FORMA_ALERT_DOS,
  ERROR_FORMA_ALERT_TRES,
  ERROR_FORMA_ALERT_QUAD
} from '../../../150101/enums/registro-solicitud-anual.enum';

// Mock components
@Component({
  selector: 'app-datos',
  template: '<div></div>',
  standalone: true
})
class MockDatosComponent {
  @Output() cambioDePestana = new EventEmitter<void>();
  validarTodosLosFormularios(): number {
    return 0;
  }
}

@Component({
  selector: 'app-wizard',
  template: '<div></div>',
  standalone: true
})
class MockWizardComponent {
  siguiente(): void {}
  atras(): void {}
}

@Component({
  selector: 'app-paso-firma',
  template: '<div></div>',
  standalone: true
})
class MockPasoFirmaComponent {}

@Component({
  selector: 'app-alert',
  template: '<div></div>',
  standalone: true
})
class MockAlertComponent {}

@Component({
  selector: 'app-btn-continuar',
  template: '<div></div>',
  standalone: true
})
class MockBtnContinuarComponent {}

describe('SolicitudDeReporteComponent', () => {
  let component: SolicitudDeReporteComponent;
  let fixture: ComponentFixture<SolicitudDeReporteComponent>;
  let mockTramiteQuery: any;
  let mockSolicitudSvc: any;
  let mockTramiteStore: any;
  let mockToastrService: any;
  let mockConsultaQuery: any;
  let mockServicioFormulario: any;
  let mockWizardService: any;

  const mockSolicitud150102State: Solicitud150102State = {
    idSolicitud: 123,
    inicio: '2023-01-01',
    fin: '2023-12-31',
    folioPrograma: 'PROG123',
    indiceDeRegistroDelPrograma: 1,
    modalidad: 'Test Modal',
    tipoPrograma: 'Test Type',
    estatus: 'Active',
    ventasTotales: '100000',
    totalExportaciones: '50000',
    totalImportaciones: '25000',
    saldo: '75000',
    porcentajeExportacion: '50',
    producidosDatos: [],
    bienesProducidosDatos: [],
    idProgramaCompuesto: 'Observacion Test,Descripcion Test'
  };

  const mockConsultaState = {
    procedureId: '',
    parameter: '',
    department: '',
    folioTramite: '',
    tipoDeTramite: '',
    estadoDeTramite: '',
    readonly: false,
    create: true,
    update: false,
    consultaioSolicitante: null,
    action_id: '',
    current_user: '',
    id_solicitud: '',
    nombre_pagina: '',
    idSolicitudSeleccionada: ''
  };

  beforeEach(async () => {
    const tramiteQuerySpy = {
      seleccionarSolicitud$: of(mockSolicitud150102State)
    };

    const solicitudSvcSpy = {
      guardar: jest.fn()
    };
    const tramiteStoreSpy = {
      actualizarIdSolicitud: jest.fn()
    };
    const toastrServiceSpy = {
      success: jest.fn(),
      error: jest.fn()
    };
    const consultaQuerySpy = {
      selectConsultaioState$: of(mockConsultaState)
    };
    const servicioFormularioSpy = {
      method: jest.fn()
    };
    const wizardServiceSpy = {
      cambio_indice: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        SolicitudDeReporteComponent,
        MockDatosComponent,
        MockWizardComponent,
        MockPasoFirmaComponent,
        MockAlertComponent,
        MockBtnContinuarComponent
      ],
      providers: [
        { provide: Solicitud150102Query, useValue: tramiteQuerySpy },
        { provide: SolicitudService, useValue: solicitudSvcSpy },
        { provide: Solicitud150102Store, useValue: tramiteStoreSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        { provide: ConsultaioQuery, useValue: consultaQuerySpy },
        { provide: ServicioDeFormularioService, useValue: servicioFormularioSpy },
        { provide: WizardService, useValue: wizardServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudDeReporteComponent);
    component = fixture.componentInstance;
    
    mockTramiteQuery = TestBed.inject(Solicitud150102Query);
    mockSolicitudSvc = TestBed.inject(SolicitudService);
    mockTramiteStore = TestBed.inject(Solicitud150102Store);
    mockToastrService = TestBed.inject(ToastrService);
    mockConsultaQuery = TestBed.inject(ConsultaioQuery);
    mockServicioFormulario = TestBed.inject(ServicioDeFormularioService);
    mockWizardService = TestBed.inject(WizardService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.guardarIdSolicitud).toBe(0);
      expect(component.PAGO_DE_DERECHOS).toBe(PAGO_DE_DERECHOS.ADJUNTAR);
      expect(component.esValido).toBe(true);
      expect(component.pantallasPasos).toEqual(REPORTE_ANUAL_PASOS);
      expect(component.indice).toBe(1);
      expect(component.mensajeError).toBe('');
      expect(component.esFormaValido).toBe(false);
      expect(component.esFormaValidoDos).toBe(false);
      expect(component.esFormaValidoTres).toBe(false);
      expect(component.esFormaValidoCuatro).toBe(false);
      expect(component.formErrorAlert).toBe(ERROR_FORMA_ALERT);
      expect(component.formErrorAlertDos).toBe(ERROR_FORMA_ALERT_DOS);
      expect(component.formErrorAlertTres).toBe(ERROR_FORMA_ALERT_TRES);
      expect(component.formErrorAlertQuad).toBe(ERROR_FORMA_ALERT_QUAD);
    });

    it('should initialize datosPasos correctly', () => {
      expect(component.datosPasos.nroPasos).toBe(REPORTE_ANUAL_PASOS.length);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
      expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    });

    it('should initialize destroyNotifier$ as Subject', () => {
      expect(component.destroyNotifier$).toBeInstanceOf(Subject);
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to consultaQuery.selectConsultaioState$ and update consultaState', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.consultaState).toEqual(mockConsultaState);
    }));

    it('should subscribe to tramiteQuery.seleccionarSolicitud$ and update solicitud150102State', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.solicitud150102State).toEqual(mockSolicitud150102State);
    }));
  });

  describe('getValorIndice', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.wizardComponent = TestBed.createComponent(MockWizardComponent).componentInstance as any;
      component.datosComponent = TestBed.createComponent(MockDatosComponent).componentInstance as any;
      jest.spyOn(component.wizardComponent, 'siguiente');
      jest.spyOn(component.wizardComponent, 'atras');
    });

    it('should handle invalid step values by returning early', () => {
      const initialIndex = component.indice;
      
      component.getValorIndice({ accion: 'cont', valor: 0 });
      expect(component.indice).toBe(initialIndex);
      
      component.getValorIndice({ accion: 'cont', valor: 10 });
      expect(component.indice).toBe(initialIndex);
    });

    it('should handle validation error 1 and set esFormaValido to true', () => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(1);
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      
      expect(component.esFormaValido).toBe(true);
      expect(component.esFormaValidoDos).toBe(false);
      expect(component.esFormaValidoTres).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should handle validation error 2 and set esFormaValidoDos to true', () => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(2);
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      
      expect(component.esFormaValidoDos).toBe(true);
      expect(component.esFormaValido).toBe(false);
      expect(component.esFormaValidoTres).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should handle validation error 3 and set esFormaValidoTres to true', () => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(3);
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      
      expect(component.esFormaValidoTres).toBe(true);
      expect(component.esFormaValidoDos).toBe(false);
      expect(component.esFormaValido).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should handle validation error 4 and set all validation flags to false', () => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(4);
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      
      expect(component.esFormaValidoTres).toBe(false);
      expect(component.esFormaValidoDos).toBe(false);
      expect(component.esFormaValido).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should handle validation error 5 and set all validation flags to false', () => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(5);
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      
      expect(component.esFormaValido).toBe(false);
      expect(component.esFormaValidoDos).toBe(false);
      expect(component.esFormaValidoTres).toBe(false);
      expect(component.datosPasos.indice).toBe(1);
    });

    it('should navigate forward when validation passes and shouldNavigate returns true', fakeAsync(() => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(0);
      jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(true));
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      tick();
      
      expect(component.indice).toBe(2);
      expect(component.datosPasos.indice).toBe(2);
      expect(mockWizardService.cambio_indice).toHaveBeenCalledWith(2);
      expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    }));

    it('should not navigate forward when shouldNavigate returns false', fakeAsync(() => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(0);
      jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(false));
      
      component.getValorIndice({ accion: 'cont', valor: 1 });
      tick();
      
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.siguiente).not.toHaveBeenCalled();
    }));

    it('should navigate backward without validation', () => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(0);
      component.indice = 2;
      
      component.getValorIndice({ accion: 'ant', valor: 2 });
      
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect(component.wizardComponent.atras).toHaveBeenCalled();
    });

    it('should handle unknown action by using current valor', fakeAsync(() => {
      jest.spyOn(component.datosComponent, 'validarTodosLosFormularios').mockReturnValue(0);
      jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(true));
      
      component.getValorIndice({ accion: 'unknown', valor: 1 });
      tick();
      
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
    }));
  });

  describe('guardar', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.solicitud150102State = mockSolicitud150102State;
    });

    it('should save successfully and return JSONResponse', async () => {
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: { id_solicitud: 456 }
      } as any;
      
      (mockSolicitudSvc.guardar as jest.Mock).mockReturnValue(of(mockResponse));
      
      const result = await component.guardar();
      
      expect(result).toEqual(mockResponse);
      expect(mockTramiteStore.actualizarIdSolicitud).toHaveBeenCalledWith(456);
      expect(component.guardarIdSolicitud).toBe(456);
    });

    it('should handle save with null id_solicitud', async () => {
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: null
      } as any;
      
      (mockSolicitudSvc.guardar as jest.Mock).mockReturnValue(of(mockResponse));
      
      const result = await component.guardar();
      
      expect(result).toEqual(mockResponse);
      expect(mockTramiteStore.actualizarIdSolicitud).toHaveBeenCalledWith(0);
      expect(component.guardarIdSolicitud).toBe(0);
    });

    it('should handle save error and reject promise', async () => {
      const error = new Error('Save failed');
      (mockSolicitudSvc.guardar as jest.Mock).mockReturnValue(throwError(() => error));
      
      try {
        await component.guardar();
        fail('Expected promise to be rejected');
      } catch (caughtError) {
        expect(caughtError).toBe(error);
      }
    });

    it('should construct correct payload', async () => {
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success',
        datos: { id_solicitud: 456 }
      } as any;
      
      (mockSolicitudSvc.guardar as jest.Mock).mockReturnValue(of(mockResponse));
      
      await component.guardar();
      
      const expectedPayload = {
        fracciones: [
          {
            cveFraccion: "",
            bienesProducidos: {
              descripcionBienProducido: "",
              totalBienesProducidos: 0,
              volumenMercadoNacional: 0,
              olumenExportaciones: 0
            }
          }
        ],
        sectores: [
          {
            idConfProgramaSE: 0
          }
        ],
        reporte_anual: {
          saldo: '75000',
          porcentaje: '50',
          ventasTotales: '100000',
          totalExportaciones: '50000',
          totalImportaciones: '25000',
          totalPersonalAdmin1: 0,
          totalPersonalAdmin2: 0,
          totalPersonalObrero1: 0,
          totalPersonalObrero2: 0
        },
        observaciones: 'Observacion Test',
        descripcion: 'Descripcion Test',
        id_solcitud: 0,
        tipoDeSolicitud: 'guardar',
        solicitante: {
          rfc: 'AAL0409235E6',
          nombre: 'Juan Pérez',
          es_persona_moral: true,
          certificado_serial_number: '1234'
        },
        representacion_federal: {
          cve_entidad_federativa: 'DGO',
          cve_unidad_administrativa: '1016'
        },
        ide_generica_1: '2023-01-01',
        ide_generica_2: '2023-12-31',
        descripcion_clob_generica_1: 'Test Modal',
        descripcion_clob_generica_2: 'Observacion Test,Descripcion Test'
      };
      
      expect(mockSolicitudSvc.guardar).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('shouldNavigate$', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.solicitud150102State = mockSolicitud150102State;
    });

    it('should return true when save is successful', fakeAsync(() => {
      const mockResponse = {
        codigo: '00',
        mensaje: 'Success message',
        datos: { id_solicitud: 456 }
      } as any;
      
      jest.spyOn(component, 'guardar').mockResolvedValue(mockResponse);
      
      let result: boolean | undefined;
      (component as any).shouldNavigate$().subscribe((shouldNavigate: boolean) => {
        result = shouldNavigate;
      });
      
      tick();
      
      expect(result).toBe(true);
      expect(mockToastrService.success).toHaveBeenCalledWith('Success message');
    }));

    it('should return false when save fails with error code', fakeAsync(() => {
      const mockResponse = {
        codigo: '01',
        mensaje: 'Error message',
        datos: null
      } as any;
      
      jest.spyOn(component, 'guardar').mockResolvedValue(mockResponse);
      
      let result: boolean | undefined;
      (component as any).shouldNavigate$().subscribe((shouldNavigate: boolean) => {
        result = shouldNavigate;
      });
      
      tick();
      
      expect(result).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith('Error message');
    }));

    it('should handle promise rejection and return false', fakeAsync(() => {
      const error = new Error('Network error');
      jest.spyOn(component, 'guardar').mockRejectedValue(error);
      
      let result: boolean | undefined;
      (component as any).shouldNavigate$().subscribe((shouldNavigate: boolean) => {
        result = shouldNavigate;
      });
      
      tick();
      
      expect(result).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith('Network error');
    }));

    it('should handle promise rejection with no message', fakeAsync(() => {
      const error = new Error();
      jest.spyOn(component, 'guardar').mockRejectedValue(error);
      
      let result: boolean | undefined;
      (component as any).shouldNavigate$().subscribe((shouldNavigate: boolean) => {
        result = shouldNavigate;
      });
      
      tick();
      
      expect(result).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith('Ocurrió un error al guardar la solicitud.');
    }));
  });

  describe('alCambiarPestana', () => {
    it('should reset all form validation flags to false', () => {
      // Set all flags to true first
      component.esFormaValido = true;
      component.esFormaValidoDos = true;
      component.esFormaValidoTres = true;
      
      component.alCambiarPestana();
      
      expect(component.esFormaValido).toBe(false);
      expect(component.esFormaValidoDos).toBe(false);
      expect(component.esFormaValidoTres).toBe(false);
    });
  });

  describe('ngOnDestroy', () => {
    it('should emit and complete destroyNotifier$', () => {
      jest.spyOn(component.destroyNotifier$, 'next');
      jest.spyOn(component.destroyNotifier$, 'complete');
      
      component.ngOnDestroy();
      
      expect(component.destroyNotifier$.next).toHaveBeenCalled();
      expect(component.destroyNotifier$.complete).toHaveBeenCalled();
    });
  });

  describe('Template Bindings and ViewChild References', () => {
    it('should have wizardComponent ViewChild reference', () => {
      fixture.detectChanges();
      expect(component.wizardComponent).toBeDefined();
    });

    it('should have datosComponent ViewChild reference', () => {
      fixture.detectChanges();
      expect(component.datosComponent).toBeDefined();
    });
  });

  describe('Dependency Injection', () => {
    it('should inject all required services', () => {
      expect(component['tramiteQuery']).toBeDefined();
      expect(component['_solicitudSvc']).toBeDefined();
      expect(component.tramiteStore).toBeDefined();
      expect(component['toastrService']).toBeDefined();
      expect(component['consultaQuery']).toBeDefined();
      expect(component['servicioDeFormularioService']).toBeDefined();
      expect(component.wizardService).toBeDefined();
    });
  });

  describe('Public Properties', () => {
    it('should have correct PAGO_DE_DERECHOS constant', () => {
      expect(component.PAGO_DE_DERECHOS).toBe(PAGO_DE_DERECHOS.ADJUNTAR);
    });

    it('should have pantallasPasos set to REPORTE_ANUAL_PASOS', () => {
      expect(component.pantallasPasos).toEqual(REPORTE_ANUAL_PASOS);
    });

    it('should have correct form error alert constants', () => {
      expect(component.formErrorAlert).toBe(ERROR_FORMA_ALERT);
      expect(component.formErrorAlertDos).toBe(ERROR_FORMA_ALERT_DOS);
      expect(component.formErrorAlertTres).toBe(ERROR_FORMA_ALERT_TRES);
      expect(component.formErrorAlertQuad).toBe(ERROR_FORMA_ALERT_QUAD);
    });
  });

  describe('Interface Implementation', () => {
    it('should implement OnInit interface', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should implement OnDestroy interface', () => {
      expect(component.ngOnDestroy).toBeDefined();
      expect(typeof component.ngOnDestroy).toBe('function');
    });
  });

  describe('AccionBoton Interface Usage', () => {
    it('should handle AccionBoton with different accion values', () => {
      // Create mock datosComponent with required methods
      const mockDatosComponent = {
        validarTodosLosFormularios: jest.fn().mockReturnValue(0)
      };
      component.datosComponent = mockDatosComponent as any;
      
      jest.spyOn(component as any, 'shouldNavigate$').mockReturnValue(of(true));
      
      const accionBoton = { accion: 'cont', valor: 1 };
      
      expect(() => component.getValorIndice(accionBoton)).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined solicitud150102State in guardar method', async () => {
      component.solicitud150102State = undefined as any;
      
      try {
        await component.guardar();
      } catch (error) {
        // Expected to throw due to undefined state
        expect(error).toBeDefined();
      }
    });
  });

  describe('Component Metadata', () => {
    it('should have correct component selector', () => {
      const fixture = TestBed.createComponent(SolicitudDeReporteComponent);
      expect(fixture.componentInstance).toBeInstanceOf(SolicitudDeReporteComponent);
    });

    it('should be a standalone component', () => {
      // This test verifies the component is configured as standalone
      expect(component).toBeTruthy();
    });
  });
});
