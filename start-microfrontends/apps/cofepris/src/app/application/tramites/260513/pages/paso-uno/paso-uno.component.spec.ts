import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Mock child components
class MockSolicitanteComponent {
  obtenerTipoPersona = jest.fn();
}
class MockDatosSolicitudComponent {
  validarClickDeBoton = jest.fn().mockReturnValue(true);
}
class MockTercerosRelacionadosFabricanteComponent {
  validarContenedor = jest.fn().mockReturnValue(true);
}
class MockPagoDerechosComponent {
  validarContenedor = jest.fn().mockReturnValue(true);
}

// Mock services and stores
class MockDatosDomicilioLegalService {}
class MockPagoBancoService {}
class MockConsultaioQuery {
  selectConsultaioState$ = of({ readonly: false, procedureId: '260513', update: false, id_solicitud: 1 });
}
class MockRegistroSolicitudService {
  parcheOpcionesPrellenadas = jest.fn().mockReturnValue(of({ datos: {} }));
}
class MockAvisocalidadStore {}
class MockPagoDerechosStore {}
class MockDatosDomicilioLegalStore {}
class MockTramite260513Query {
  getTabSeleccionado$ = of(1);
}
class MockTramite260513Store {
  updateTabSeleccionado = jest.fn();
  update = jest.fn();
}

// Mock static adapter
jest.mock('../../adapters/guardar-mapping.adapter', () => ({
  GuardarAdapter_260513: { patchresponseToStore: jest.fn() },
}));

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      providers: [
        { provide: 'DatosDomicilioLegalService', useClass: MockDatosDomicilioLegalService },
        { provide: 'PagoBancoService', useClass: MockPagoBancoService },
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery },
        { provide: 'RegistroSolicitudService', useClass: MockRegistroSolicitudService },
        { provide: 'AvisocalidadStore', useClass: MockAvisocalidadStore },
        { provide: 'PagoDerechosStore', useClass: MockPagoDerechosStore },
        { provide: 'DatosDomicilioLegalStore', useClass: MockDatosDomicilioLegalStore },
        { provide: 'Tramite260513Query', useClass: MockTramite260513Query },
        { provide: 'Tramite260513Store', useClass: MockTramite260513Store },
        { provide: HttpClient, useValue: {} },
        { provide: '_HttpClient', useValue: {} }, // Add this line to mock _HttpClient
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    // Inject mock children
    component.solicitante = new MockSolicitanteComponent() as any;
    component.datosSolicitudRef = new MockDatosSolicitudComponent() as any;
    component.tercerosRelacionadosFabricanteRef = new MockTercerosRelacionadosFabricanteComponent() as any;
    component.pagoDerechosRef = new MockPagoDerechosComponent() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngAfterViewInit and obtenerTipoPersona', () => {
    const spy = jest.spyOn(component.solicitante, 'obtenerTipoPersona');
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call seleccionaTab and updateTabSeleccionado', () => {
    const store = (component as any).tramite260513Store;
    component.seleccionaTab(2);
    expect(store.updateTabSeleccionado).toHaveBeenCalledWith(2);
  });

  it('should call guardarDatosFormulario and patchresponseToStore', () => {
    component.consultaState = { id_solicitud: 1 } as any;
    component.registroSolicitudService = new MockRegistroSolicitudService() as any;
    component.avisocalidadStore = {} as any;
    component.datosDomicilioLegalStore = {} as any;
    component.pagoDerechosStore = {} as any;
    component.guardarDatosFormulario();
    const { GuardarAdapter_260513 } = require('../../adapters/guardar-mapping.adapter');
    expect(GuardarAdapter_260513.patchresponseToStore).toHaveBeenCalled();
  });

  it('should call actualizarEstadoFormulario and update store', () => {
    const store = (component as any).tramite260513Store;
    component.actualizarEstadoFormulario({ test: 'value' } as any);
    expect(store.update).toHaveBeenCalled();
  });

  it('should validate validOnButtonClick', () => {
    expect(component.validOnButtonClick()).toBe(true);
  });

  it('should validate validarTodosLosPasos', () => {
    expect(component.validarTodosLosPasos()).toBe(true);
  });

  it('should handle ngOnChanges and call seleccionaTab', () => {
    const spy = jest.spyOn(component, 'seleccionaTab');
    component.ngOnChanges({ confirmarSinPagoDeDerechos: { currentValue: 2, previousValue: 1, firstChange: false, isFirstChange: () => false } as any });
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should clean up on destroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});
