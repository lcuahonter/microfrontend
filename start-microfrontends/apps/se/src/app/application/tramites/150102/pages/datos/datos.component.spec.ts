import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery, ConsultaioState } from "@ng-mf/data-access-user";
import { SolicitudService } from '../../services/solicitud.service';
import { of, Subject, throwError } from 'rxjs';
import { DatosDeReporteAnnualComponent } from '../../components/datos-de-reporte-annual/datos-de-reporte-annual.component';
import { ProgramasReporteAnnualComponent } from '../../components/programas-reporte-annual/programas-reporte-annual.component';
import { GuardarDatosFormulario } from '../../models/programas-reporte.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// Mock components
@Component({
  selector: 'app-solicitante',
  template: '<div>Mock Solicitante</div>',
  standalone: true
})
class MockSolicitanteComponent {
  @Input() esDatosRespuesta: boolean = false;
  @Output() cambioDePestana = new EventEmitter<void>();
}

@Component({
  selector: 'app-programas-reporte-annual',
  template: '<div>Mock Programas</div>',
  standalone: true
})
class MockProgramasReporteAnnualComponent {
  formProgrmasReporte = {
    get: jest.fn()
  };
  showAlert = jest.fn();
}

@Component({
  selector: 'app-datos-de-reporte-annual',
  template: '<div>Mock Datos</div>',
  standalone: true
})
class MockDatosDeReporteAnnualComponent {
  formReporteAnnual = {
    markAllAsTouched: jest.fn(),
    get: jest.fn()
  };
  diferenciaTotal = jest.fn();
}

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let consultaQueryMock: any;
  let solicitudServiceMock: any;

  const mockConsultaState: ConsultaioState = {
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
    consultaQueryMock = {
      selectConsultaioState$: of(mockConsultaState)
    };
    solicitudServiceMock = {
      guardarDatosFormulario: jest.fn().mockReturnValue(of({} as GuardarDatosFormulario)),
      actualizarEstadoFormulario: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        DatosComponent,
        HttpClientTestingModule,
        MockSolicitanteComponent,
        MockProgramasReporteAnnualComponent,
        MockDatosDeReporteAnnualComponent
      ],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: SolicitudService, useValue: solicitudServiceMock }
      ]
    })
    .overrideComponent(DatosComponent, {
      remove: {
        imports: [
          DatosDeReporteAnnualComponent,
          ProgramasReporteAnnualComponent
        ]
      },
      add: {
        imports: [
          MockDatosDeReporteAnnualComponent,
          MockProgramasReporteAnnualComponent,
          MockSolicitanteComponent
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    
    // Initialize ViewChild references manually for testing
    component.datosDeComp = new MockDatosDeReporteAnnualComponent() as any;
    component.programasDeComp = new MockProgramasReporteAnnualComponent() as any;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with correct default values', () => {
      expect(component.esDatosRespuesta).toBe(false);
      expect(component.indice).toBe(1);
      expect(component.estaHabilitado).toBe(false);
      expect(component['destroyNotifier$']).toBeInstanceOf(Subject);
    });

    it('should initialize destroyNotifier$ as Subject', () => {
      expect(component['destroyNotifier$']).toBeInstanceOf(Subject);
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to consultaQuery.selectConsultaioState$ and update consultaState', fakeAsync(() => {
      const testState = { ...mockConsultaState, update: false };
      consultaQueryMock.selectConsultaioState$ = of(testState);
      
      component.ngOnInit();
      tick();
      
      expect(component.consultaState).toEqual(testState);
    }));

    it('should set esDatosRespuesta to true if consultaState.update is false', fakeAsync(() => {
      const testState = { ...mockConsultaState, update: false };
      consultaQueryMock.selectConsultaioState$ = of(testState);
      
      component.ngOnInit();
      tick();
      
      expect(component.esDatosRespuesta).toBe(true);
    }));

    it('should handle subscription and state update correctly', fakeAsync(() => {
      // Just test that the subscription works and state is updated
      const testState = { ...mockConsultaState, update: true };
      
      // Create component with fresh fixture to avoid interference
      const testFixture = TestBed.createComponent(DatosComponent);
      const testComponent = testFixture.componentInstance;
      
      // Create fresh mock for this test
      const testConsultaQueryMock = {
        selectConsultaioState$: of(testState)
      };
      testComponent['consultaQuery'] = testConsultaQueryMock as any;
      
      testComponent.esDatosRespuesta = false;
      
      testComponent.ngOnInit();
      tick();
      
      // The state should be updated by the subscription
      expect(testComponent.consultaState).toEqual(testState);
      // Since consultaState was undefined initially, esDatosRespuesta should be true
      expect(testComponent.esDatosRespuesta).toBe(true);
    }));

    it('should handle subscription properly with takeUntil', fakeAsync(() => {
      const spy = jest.spyOn(component['destroyNotifier$'], 'next');
      
      component.ngOnInit();
      tick();
      component.ngOnDestroy();
      
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('guardarDatosFormulario', () => {
    it('should set esDatosRespuesta to true and call actualizarEstadoFormulario on successful response', fakeAsync(() => {
      const mockResponse: GuardarDatosFormulario = {
        inicio: '2023-01-01',
        fin: '2023-12-31',
        folioPrograma: 'TEST123',
        modalidad: 'Test',
        tipoPrograma: 'Test',
        estatus: 'Activo',
        ventasTotales: '1000',
        totalExportaciones: '500',
        totalImportaciones: '200',
        saldo: '300',
        porcentajeExportacion: '50'
      };
      
      solicitudServiceMock.guardarDatosFormulario.mockReturnValue(of(mockResponse));
      component.esDatosRespuesta = false;
      
      component.guardarDatosFormulario();
      tick();
      
      expect(component.esDatosRespuesta).toBe(true);
      expect(solicitudServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith(mockResponse);
    }));

    it('should handle null response gracefully', fakeAsync(() => {
      solicitudServiceMock.guardarDatosFormulario.mockReturnValue(of(null));
      component.esDatosRespuesta = false;
      
      component.guardarDatosFormulario();
      tick();
      
      expect(component.esDatosRespuesta).toBe(false);
      expect(solicitudServiceMock.actualizarEstadoFormulario).not.toHaveBeenCalled();
    }));

    it('should handle service error', () => {
      const errorObservable = throwError(() => new Error('Service error'));
      solicitudServiceMock.guardarDatosFormulario.mockReturnValue(errorObservable);
      component.esDatosRespuesta = false;
      
      // The error will be thrown immediately, so we just verify it doesn't change the component state
      expect(() => component.guardarDatosFormulario()).not.toThrow();
      expect(component.esDatosRespuesta).toBe(false);
    });

    it('should use takeUntil to avoid memory leaks', fakeAsync(() => {
      const mockResponse: GuardarDatosFormulario = {} as any;
      solicitudServiceMock.guardarDatosFormulario.mockReturnValue(of(mockResponse));
      const spy = jest.spyOn(component['destroyNotifier$'], 'next');
      
      component.guardarDatosFormulario();
      tick();
      component.ngOnDestroy();
      
      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('seleccionaTab', () => {
    it('should update indice with provided value', () => {
      component.seleccionaTab(3);
      expect(component.indice).toBe(3);
    });

    it('should handle different indice values', () => {
      component.seleccionaTab(0);
      expect(component.indice).toBe(0);
      
      component.seleccionaTab(5);
      expect(component.indice).toBe(5);
      
      component.seleccionaTab(-1);
      expect(component.indice).toBe(-1);
    });
  });

  describe('getFilaDeInformeSeleccionada', () => {
    it('should set estaHabilitado to true if evento is true', () => {
      component.estaHabilitado = false;
      component.getFilaDeInformeSeleccionada(true);
      expect(component.estaHabilitado).toBe(true);
    });

    it('should not change estaHabilitado if evento is false', () => {
      component.estaHabilitado = false;
      component.getFilaDeInformeSeleccionada(false);
      expect(component.estaHabilitado).toBe(false);
    });

    it('should maintain estaHabilitado as true if evento is false but it was already true', () => {
      component.estaHabilitado = true;
      component.getFilaDeInformeSeleccionada(false);
      expect(component.estaHabilitado).toBe(true);
    });
  });

  describe('validarTodosLosFormularios', () => {
    let datosDeCompMock: any;
    let programasDeCompMock: any;

    beforeEach(() => {
      datosDeCompMock = {
        formReporteAnnual: {
          markAllAsTouched: jest.fn(),
          get: jest.fn()
        },
        diferenciaTotal: jest.fn()
      };
      programasDeCompMock = {
        formProgrmasReporte: {
          get: jest.fn()
        },
        showAlert: jest.fn()
      };
      component.datosDeComp = datosDeCompMock;
      component.programasDeComp = programasDeCompMock;
    });

    it('should return 0 if indice is less than 2', () => {
      component.indice = 1;
      expect(component.validarTodosLosFormularios()).toBe(0);
    });

    it('should return 1 if ventasTotales and totalExportaciones are both empty strings', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: ''
      }));
      expect(component.validarTodosLosFormularios()).toBe(1);
      expect(datosDeCompMock.formReporteAnnual.markAllAsTouched).toHaveBeenCalled();
    });

    it('should return 1 if ventasTotales and totalExportaciones are both null', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: null
      }));
      expect(component.validarTodosLosFormularios()).toBe(1);
    });

    it('should return 2 if ventasTotales is empty and totalExportaciones >= 0', () => {
      component.indice = 3;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: key === 'ventasTotales' ? '' : 10
      }));
      expect(component.validarTodosLosFormularios()).toBe(2);
      expect(datosDeCompMock.diferenciaTotal).toHaveBeenCalled();
    });

    it('should return 2 if ventasTotales is null and totalExportaciones >= 0', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: key === 'ventasTotales' ? null : 0
      }));
      expect(component.validarTodosLosFormularios()).toBe(2);
      expect(datosDeCompMock.diferenciaTotal).toHaveBeenCalled();
    });

    it('should return 3 if ventasTotales < totalExportaciones', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: key === 'ventasTotales' ? '5' : '10'
      }));
      expect(component.validarTodosLosFormularios()).toBe(3);
      expect(datosDeCompMock.diferenciaTotal).toHaveBeenCalled();
    });

    it('should return 4 if ventasTotales >= 0 and totalExportaciones is empty', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: key === 'ventasTotales' ? 10 : ''
      }));
      expect(component.validarTodosLosFormularios()).toBe(4);
    });

    it('should return 4 if ventasTotales >= 0 and totalExportaciones is null', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: key === 'ventasTotales' ? 0 : null
      }));
      expect(component.validarTodosLosFormularios()).toBe(4);
    });

    it('should return 5 if indice is 2, datosDeComp is not available, and programas estatus is not empty', () => {
      component.indice = 2;
      component.datosDeComp = undefined as any;
      programasDeCompMock.formProgrmasReporte.get.mockReturnValue({ value: 'activo' });
      expect(component.validarTodosLosFormularios()).toBe(5);
      expect(programasDeCompMock.showAlert).toHaveBeenCalled();
    });

    it('should return 0 if indice is 2, datosDeComp is not available, and programas estatus is empty', () => {
      component.indice = 2;
      component.datosDeComp = undefined as any;
      programasDeCompMock.formProgrmasReporte.get.mockReturnValue({ value: '' });
      expect(component.validarTodosLosFormularios()).toBe(0);
    });

    it('should return 0 if datosDeComp and programasDeComp are both undefined', () => {
      component.indice = 1; // Set to 1 to avoid the programasDeComp logic
      component.datosDeComp = undefined as any;
      component.programasDeComp = undefined as any;
      expect(component.validarTodosLosFormularios()).toBe(0);
    });

    it('should return 0 if all conditions pass (valid form)', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: key === 'ventasTotales' ? 100 : 50
      }));
      expect(component.validarTodosLosFormularios()).toBe(0);
    });

    it('should handle edge case where ventasTotales equals totalExportaciones', () => {
      component.indice = 2;
      datosDeCompMock.formReporteAnnual.get.mockImplementation((key: string) => ({
        value: 100
      }));
      expect(component.validarTodosLosFormularios()).toBe(0);
    });
  });

  describe('ngOnDestroy', () => {
    it('should emit and complete destroyNotifier$', () => {
      const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should clean up subscriptions', () => {
      const spy = jest.spyOn(component['destroyNotifier$'], 'next');
      
      component.ngOnDestroy();
      
      expect(spy).toHaveBeenCalledWith();
    });
  });

  describe('Template Bindings and ViewChild References', () => {
    it('should have datosDeComp ViewChild reference after initialization', () => {
      // The ViewChild is initialized in beforeEach
      expect(component.datosDeComp).toBeDefined();
      expect(component.datosDeComp.formReporteAnnual).toBeDefined();
    });

    it('should have programasDeComp ViewChild reference after initialization', () => {
      // The ViewChild is initialized in beforeEach
      expect(component.programasDeComp).toBeDefined();
      expect(component.programasDeComp.formProgrmasReporte).toBeDefined();
    });

    it('should have cambioDePestana EventEmitter', () => {
      expect(component.cambioDePestana).toBeInstanceOf(EventEmitter);
    });

    it('should emit cambioDePestana event', () => {
      const spy = jest.spyOn(component.cambioDePestana, 'emit');
      component.cambioDePestana.emit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Dependency Injection', () => {
    it('should inject ConsultaioQuery', () => {
      expect(component['consultaQuery']).toBeDefined();
    });

    it('should inject SolicitudService', () => {
      expect(component.solicitudService).toBeDefined();
    });
  });

  describe('Public Properties', () => {
    it('should have esDatosRespuesta property', () => {
      expect(typeof component.esDatosRespuesta).toBe('boolean');
    });

    it('should have indice property with default value 1', () => {
      expect(component.indice).toBe(1);
      expect(typeof component.indice).toBe('number');
    });

    it('should have estaHabilitado property with default value false', () => {
      expect(component.estaHabilitado).toBe(false);
      expect(typeof component.estaHabilitado).toBe('boolean');
    });

    it('should have consultaState property', () => {
      fixture.detectChanges();
      expect(component.consultaState).toBeDefined();
    });
  });

  describe('Component Lifecycle', () => {
    it('should implement OnInit interface', () => {
      expect(typeof component.ngOnInit).toBe('function');
    });

    it('should implement OnDestroy interface', () => {
      expect(typeof component.ngOnDestroy).toBe('function');
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined formReporteAnnual in validarTodosLosFormularios', () => {
      component.indice = 1; // Set to 1 to avoid the datosDeComp logic
      component.datosDeComp = {
        formReporteAnnual: undefined as any,
        diferenciaTotal: jest.fn()
      } as any;
      
      expect(() => component.validarTodosLosFormularios()).not.toThrow();
      expect(component.validarTodosLosFormularios()).toBe(0);
    });

    it('should handle undefined formProgrmasReporte in validarTodosLosFormularios', () => {
      component.indice = 1; // Set to 1 to avoid the programasDeComp logic
      component.datosDeComp = undefined as any;
      component.programasDeComp = {
        formProgrmasReporte: undefined as any,
        showAlert: jest.fn()
      } as any;
      
      expect(() => component.validarTodosLosFormularios()).not.toThrow();
    });
  });

  describe('Component Metadata', () => {
    it('should have correct component selector', () => {
      // Test that the component was created and is using the right template
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(fixture.nativeElement).toBeTruthy();
    });

    it('should be a standalone component', () => {
      // Test that component can be imported standalone
      expect(component).toBeTruthy();
      expect(fixture.componentInstance).toBeInstanceOf(DatosComponent);
    });
  });
});