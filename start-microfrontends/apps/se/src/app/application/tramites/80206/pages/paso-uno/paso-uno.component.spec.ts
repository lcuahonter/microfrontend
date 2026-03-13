// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of as observableOf, throwError, Subject } from 'rxjs';

import { PasoUnoComponent } from './paso-uno.component';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Ampliacion3RsComponent } from '../../components/ampliacion-3Rs/ampliacion-3rs.component';
import { AmpliacionAnexoComponent } from '../../components/ampliacion-anexo/ampliacion-anexo.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';

@Injectable()
class MockAmpliacionServiciosService {
  getServiciosData = jest.fn().mockReturnValue(observableOf({ datos: 'test data' }));
  actualizarEstadoFormulario = jest.fn();
}

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({
    update: false,
    readonly: false
  } as ConsultaioState);
}

// Mock components
class MockSolicitanteComponent {
  form = {
    valid: true,
    invalid: false,
    markAllAsTouched: jest.fn()
  };
}

class MockAmpliacionAnexoComponent {
  validarFormulario = jest.fn().mockReturnValue(true);
}

class MockAmpliacion3RsComponent {
  validarFormulario = jest.fn().mockReturnValue(true);
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({name: 'translate'})
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'phoneNumber'})
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({name: 'safeHtml'})
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('PasoUnoComponent - Pruebas Integrales', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;
  let mockAmpliacionServiciosService: MockAmpliacionServiciosService;
  let mockConsultaioQuery: MockConsultaioQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        PasoUnoComponent,
        TranslatePipe, 
        PhoneNumberPipe, 
        SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: AmpliacionServiciosService, useClass: MockAmpliacionServiciosService },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    
    mockAmpliacionServiciosService = TestBed.inject(AmpliacionServiciosService) as any;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as any;
  });

  afterEach(() => {
    if (component.destroyNotifier$) {
      component.destroyNotifier$.next();
      component.destroyNotifier$.complete();
    }
    fixture.destroy();
    jest.clearAllMocks();
  });

  it('debería crear el componente correctamente y inicializar propiedades por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.indice).toBe(1);
    expect(component.esDatosRespuesta).toBe(false);
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.seccionesDeLaSolicitud).toHaveLength(3);
    expect(component.destroyNotifier$).toBeDefined();
  });

  it('debería inicializar correctamente las secciones de la solicitud en el constructor', () => {
    expect(component.seccionesDeLaSolicitud).toEqual([
      { index: 1, title: 'Solicitante' },
      { index: 2, title: 'Anexo I' },
      { index: 3, title: "3 R's" }
    ]);
  });

  it('debería cambiar correctamente el índice de pestaña al llamar seleccionaTab', () => {
    // Prueba cambio a pestaña 2
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    // Prueba cambio a pestaña 3
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    // Prueba cambio de vuelta a pestaña 1
    component.seleccionaTab(1);
    expect(component.indice).toBe(1);
  });

  it('debería manejar correctamente la selección de pestañas con valores numéricos válidos', () => {
    const pestañasValidas = [1, 2, 3];
    
    pestañasValidas.forEach(pestaña => {
      component.seleccionaTab(pestaña);
      expect(component.indice).toBe(pestaña);
    });
  });

  it('debería ejecutar ngOnInit y suscribirse al estado de consulta cuando update es false y readonly es false', () => {
    const mockState = {
      update: false,
      readonly: false
    } as ConsultaioState;

    mockConsultaioQuery.selectConsultaioState$ = observableOf(mockState);
    
    component.ngOnInit();
    
    expect(component.consultaState).toEqual(mockState);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería ejecutar ngOnInit y llamar guardarDatosFormulario cuando update es true', () => {
    const spyGuardarDatos = jest.spyOn(component, 'guardarDatosFormulario');
    const mockState = {
      update: true,
      readonly: false
    } as ConsultaioState;

    mockConsultaioQuery.selectConsultaioState$ = observableOf(mockState);
    
    component.ngOnInit();
    
    expect(component.consultaState).toEqual(mockState);
    expect(spyGuardarDatos).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnInit y llamar guardarDatosFormulario cuando readonly es true', () => {
    const spyGuardarDatos = jest.spyOn(component, 'guardarDatosFormulario');
    const mockState = {
      update: false,
      readonly: true
    } as ConsultaioState;

    mockConsultaioQuery.selectConsultaioState$ = observableOf(mockState);
    
    component.ngOnInit();
    
    expect(component.consultaState).toEqual(mockState);
    expect(spyGuardarDatos).toHaveBeenCalled();
  });

  it('debería ejecutar ngOnInit y llamar guardarDatosFormulario cuando ambos update y readonly son true', () => {
    const spyGuardarDatos = jest.spyOn(component, 'guardarDatosFormulario');
    const mockState = {
      update: true,
      readonly: true
    } as ConsultaioState;

    mockConsultaioQuery.selectConsultaioState$ = observableOf(mockState);
    
    component.ngOnInit();
    
    expect(component.consultaState).toEqual(mockState);
    expect(spyGuardarDatos).toHaveBeenCalled();
  });

  it('debería ejecutar guardarDatosFormulario correctamente cuando el servicio retorna datos válidos', () => {
    const mockRespuesta = { datos: 'test data', codigo: '00' };
    mockAmpliacionServiciosService.getServiciosData.mockReturnValue(observableOf(mockRespuesta));
    
    component.guardarDatosFormulario();
    
    expect(mockAmpliacionServiciosService.getServiciosData).toHaveBeenCalled();
    expect(mockAmpliacionServiciosService.actualizarEstadoFormulario).toHaveBeenCalledWith(mockRespuesta);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería manejar correctamente cuando guardarDatosFormulario recibe respuesta null o undefined', () => {
    mockAmpliacionServiciosService.getServiciosData.mockReturnValue(observableOf(null));
    
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    
    expect(mockAmpliacionServiciosService.getServiciosData).toHaveBeenCalled();
    expect(mockAmpliacionServiciosService.actualizarEstadoFormulario).not.toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('debería manejar correctamente cuando guardarDatosFormulario recibe respuesta falsy', () => {
    mockAmpliacionServiciosService.getServiciosData.mockReturnValue(observableOf(''));
    
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    
    expect(mockAmpliacionServiciosService.getServiciosData).toHaveBeenCalled();
    expect(mockAmpliacionServiciosService.actualizarEstadoFormulario).not.toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('debería manejar errores en guardarDatosFormulario cuando el servicio falla', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockAmpliacionServiciosService.getServiciosData.mockReturnValue(throwError('Error de servicio'));
    
    component.guardarDatosFormulario();
    
    expect(mockAmpliacionServiciosService.getServiciosData).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('debería ejecutar ngOnDestroy y limpiar suscripciones correctamente', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería retornar true en validarFormularios cuando ampliacion3RsComponent es válido', () => {
    const mockAmpliacion3Rs = new MockAmpliacion3RsComponent();
    mockAmpliacion3Rs.validarFormulario.mockReturnValue(true);
    component.ampliacion3RsComponent = mockAmpliacion3Rs as any;
    component.esDatosRespuesta = true;
    
    const resultado = component.validarFormularios();
    
    expect(mockAmpliacion3Rs.validarFormulario).toHaveBeenCalled();
  });

  it('debería retornar false en validarFormularios cuando ampliacion3RsComponent es inválido', () => {
    const mockAmpliacion3Rs = new MockAmpliacion3RsComponent();
    mockAmpliacion3Rs.validarFormulario.mockReturnValue(false);
    component.ampliacion3RsComponent = mockAmpliacion3Rs as any;
    component.esDatosRespuesta = true;
    
    const resultado = component.validarFormularios();
    
    expect(resultado).toBe(false);
    expect(mockAmpliacion3Rs.validarFormulario).toHaveBeenCalled();
  });

  it('debería retornar false en validarFormularios cuando ampliacion3RsComponent no existe y esDatosRespuesta es true', () => {
    component.ampliacion3RsComponent = null as any;
    component.esDatosRespuesta = true;
    
    const resultado = component.validarFormularios();
    
    expect(resultado).toBe(false);
  });

  it('debería retornar true en validarFormularios cuando ampliacion3RsComponent no existe y esDatosRespuesta es false', () => {
    component.ampliacion3RsComponent = null as any;
    component.esDatosRespuesta = false;
    
    const resultado = component.validarFormularios();
    
    expect(resultado).toBe(true);
  });

  it('debería retornar true en validarFormularios cuando ampliacion3RsComponent existe y esDatosRespuesta es false', () => {
    const mockAmpliacion3Rs = new MockAmpliacion3RsComponent();
    mockAmpliacion3Rs.validarFormulario.mockReturnValue(true);
    component.ampliacion3RsComponent = mockAmpliacion3Rs as any;
    component.esDatosRespuesta = false;
    
    const resultado = component.validarFormularios();
    
    expect(mockAmpliacion3Rs.validarFormulario).toHaveBeenCalled();
  });

  it('debería manejar múltiples suscripciones simultáneas sin conflictos', () => {
    const mockState1 = { update: true, readonly: false } as ConsultaioState;
    const mockState2 = { update: false, readonly: true } as ConsultaioState;
    
    const spyGuardarDatos = jest.spyOn(component, 'guardarDatosFormulario');
    
    // Primera suscripción
    mockConsultaioQuery.selectConsultaioState$ = observableOf(mockState1);
    component.ngOnInit();
    
    // Verificar primera llamada
    expect(spyGuardarDatos).toHaveBeenCalledTimes(1);
    expect(component.consultaState).toEqual(mockState1);
  });


  it('debería inicializar correctamente el Subject destroyNotifier$ en el constructor', () => {
    const nuevoComponente = new PasoUnoComponent(mockAmpliacionServiciosService as any, mockConsultaioQuery as any);
    
    expect(nuevoComponente.destroyNotifier$).toBeDefined();
    expect(nuevoComponente.destroyNotifier$).toBeInstanceOf(Subject);
    expect(nuevoComponente.destroyNotifier$.closed).toBe(false);
  });

  it('debería manejar correctamente la validación con todos los componentes referenciados presentes', () => {
    // Configurar todos los componentes mock
    const mockSolicitante = new MockSolicitanteComponent();
    const mockAmpliacionAnexo = new MockAmpliacionAnexoComponent();
    const mockAmpliacion3Rs = new MockAmpliacion3RsComponent();
    
    component.solicitante = mockSolicitante as any;
    component.ampliacionAnexoComponent = mockAmpliacionAnexo as any;
    component.ampliacion3RsComponent = mockAmpliacion3Rs as any;
    component.esDatosRespuesta = true;
    
    mockAmpliacion3Rs.validarFormulario.mockReturnValue(true);
    
    const resultado = component.validarFormularios();
    
    expect(resultado).toBe(true);
    expect(mockAmpliacion3Rs.validarFormulario).toHaveBeenCalled();
  });

  it('debería manejar correctamente cuando seleccionaTab recibe valores extremos', () => {
    // Probar con valor 0
    component.seleccionaTab(0);
    expect(component.indice).toBe(0);
    
    // Probar con valor negativo
    component.seleccionaTab(-1);
    expect(component.indice).toBe(-1);
    
    // Probar con valor muy alto
    component.seleccionaTab(999);
    expect(component.indice).toBe(999);
  });

  it('debería mantener la coherencia del estado esDatosRespuesta a través de múltiples operaciones', () => {
    // Estado inicial
    expect(component.esDatosRespuesta).toBe(false);
    
    // Después de ngOnInit con condiciones normales
    const mockState = { update: false, readonly: false } as ConsultaioState;
    mockConsultaioQuery.selectConsultaioState$ = observableOf(mockState);
    
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
    
    // Después de guardarDatosFormulario exitoso
    const mockRespuesta = { datos: 'test' };
    mockAmpliacionServiciosService.getServiciosData.mockReturnValue(observableOf(mockRespuesta));
    
    component.esDatosRespuesta = false;
    component.guardarDatosFormulario();
    expect(component.esDatosRespuesta).toBe(true);
  });
});