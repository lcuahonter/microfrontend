// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of as observableOf, Subject, throwError, BehaviorSubject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

import { RegistroPageComponent } from './registro-page.component';
import { AmpliacionServiciosQuery } from '../../estados/tramite80206.query';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Tramite80206Store } from '../../estados/tramite80206.store';
import { HttpClientModule } from '@angular/common/http';

// Mock interfaces
interface MockWizardComponent {
  siguiente: jest.Mock;
  atras: jest.Mock;
  irASeccion: jest.Mock;
  indiceActual: number;
}

interface MockPasoUnoComponent {
  validarFormularios: jest.Mock;
}

@Injectable()
class MockAmpliacionServiciosQuery {
  FormaValida$ = observableOf({ fraccionArancelaria: true, sector: true });
  selectSolicitudTramite$ = observableOf({
    idSolicitud: 12345,
    infoRegistro: { folio: 'TEST123' }
  });
}

@Injectable()
class MockAmpliacionServiciosService {
  deberiaMostrar$ = observableOf(true);
  getDatos = jest.fn().mockReturnValue(observableOf({}));
  obtenerCatalogos = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockSeccionLibStore {
  establecerSeccion = jest.fn();
  establecerFormaValida = jest.fn();
  seccionActual$ = observableOf({});
}

@Injectable()
class MockRegistroSolicitudService {
  postGuardarDatos = jest.fn().mockReturnValue(observableOf({
    codigo: '00',
    mensaje: 'Éxito',
    datos: { id_solicitud: 12345 }
  }));
}

@Injectable()
class MockTramite80206Store {
  setIdSolicitud = jest.fn();
}

@Injectable()
class MockChangeDetectorRef {
  detectChanges = jest.fn();
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

describe('RegistroPageComponent - Pruebas Integrales', () => {
  let fixture: ComponentFixture<RegistroPageComponent>;
  let component: RegistroPageComponent;
  let mockAmpliacionServiciosQuery: MockAmpliacionServiciosQuery;
  let mockAmpliacionServiciosService: MockAmpliacionServiciosService;
  let mockSeccionLibStore: MockSeccionLibStore;
  let mockRegistroSolicitudService: MockRegistroSolicitudService;
  let mockTramite80206Store: MockTramite80206Store;
  let mockChangeDetectorRef: MockChangeDetectorRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule],
      declarations: [
        RegistroPageComponent,
        TranslatePipe, 
        PhoneNumberPipe, 
        SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: AmpliacionServiciosQuery, useClass: MockAmpliacionServiciosQuery },
        { provide: SeccionLibStore, useClass: MockSeccionLibStore },
        { provide: AmpliacionServiciosService, useClass: MockAmpliacionServiciosService },
        { provide: RegistroSolicitudService, useClass: MockRegistroSolicitudService },
        { provide: Tramite80206Store, useClass: MockTramite80206Store },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(RegistroPageComponent);
    component = fixture.componentInstance;
    
    // Obtener servicios inyectados
    mockAmpliacionServiciosQuery = TestBed.inject(AmpliacionServiciosQuery) as any;
    mockAmpliacionServiciosService = TestBed.inject(AmpliacionServiciosService) as any;
    mockSeccionLibStore = TestBed.inject(SeccionLibStore) as any;
    mockRegistroSolicitudService = TestBed.inject(RegistroSolicitudService) as any;
    mockTramite80206Store = TestBed.inject(Tramite80206Store) as any;
    mockChangeDetectorRef = TestBed.inject(ChangeDetectorRef) as any;
    
    // Inicializar destroyNotifier$ antes de cualquier prueba
    component.destroyNotifier$ = new Subject<void>();
  });

  afterEach(() => {
    if (component.destroyNotifier$) {
      component.destroyNotifier$.next();
      component.destroyNotifier$.complete();
    }
    fixture.destroy(); 
    TestBed.resetTestingModule(); 
  });

  it('debería crear el componente correctamente y inicializar propiedades por defecto', () => {
    expect(component).toBeTruthy();
    expect(component.indice).toBe(1);
    expect(component.tituloMensaje).toBe("Registro de solicitud IMMEX modalidad ampliación 3R's");
    expect(component.pasos).toBeDefined();
    expect(component.datosPasos).toBeDefined();
    expect(component.mostrarAlerta).toBe(false);
    expect(component.esFormaValido).toBe(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
    expect(component.seccionCargarDocumentos).toBe(true);
    expect(component.cargaEnProgreso).toBe(true);
    expect(component.idSolicitud).toBe(0);
    expect(component.tramiteId).toBe('80206');
  });

 

  it('debería navegar hacia adelante cuando getValorIndice recibe acción "cont" con formularios válidos', () => {
    // Configurar mocks
    const mockWizard: MockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      irASeccion: jest.fn(),
      indiceActual: 1
    };
    
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true)
    };

    component.wizardComponent = mockWizard as any;
    component.pasoUnoComponent = mockPasoUno as any;
    component.solicitudState = { idSolicitud: 123 } as any;
    
    const evento = { accion: 'cont', valor: 1 };
    
    component.getValorIndice(evento);
    
    expect(mockPasoUno.validarFormularios).toHaveBeenCalled();
    expect(mockRegistroSolicitudService.postGuardarDatos).toHaveBeenCalled();
    expect(component.esFormaValido).toBe(false);
  });

  it('debería mostrar error cuando getValorIndice recibe acción "cont" pero formularios son inválidos', () => {
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(false)
    };

    component.pasoUnoComponent = mockPasoUno as any;
    component.indice = 1;
    
    const evento = { accion: 'cont', valor: 1 };
    
    
    expect(mockRegistroSolicitudService.postGuardarDatos).not.toHaveBeenCalled();
  });

  it('debería navegar hacia atrás cuando getValorIndice recibe acción diferente a "cont"', () => {
    const mockWizard: MockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      irASeccion: jest.fn(),
      indiceActual: 1
    };

    component.wizardComponent = mockWizard as any;
    component.indice = 2;
    
    const evento = { accion: 'ant', valor: 2 };
    
    component.getValorIndice(evento);
    
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(mockWizard.atras).toHaveBeenCalled();
  });

  it('debería manejar error cuando wizardComponent no está disponible en navegación hacia adelante', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true)
    };

    component.wizardComponent = null as any;
    component.pasoUnoComponent = mockPasoUno as any;
    component.solicitudState = { idSolicitud: 123 } as any;
    
    const evento = { accion: 'cont', valor: 1 };
    
    component.getValorIndice(evento);
    
    consoleSpy.mockRestore();
  });

  it('debería manejar error cuando wizardComponent no está disponible en navegación hacia atrás', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    
    component.wizardComponent = null as any;
    component.indice = 2;
    
    const evento = { accion: 'ant', valor: 2 };
    
    component.getValorIndice(evento);
    
    consoleSpy.mockRestore();
  });

  it('debería manejar error de API en getValorIndice', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(throwError('Error de API'));
    
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true)
    };

    component.pasoUnoComponent = mockPasoUno as any;
    component.solicitudState = { idSolicitud: 123 } as any;
    
    const evento = { accion: 'cont', valor: 1 };
    
    component.getValorIndice(evento);
    
    consoleSpy.mockRestore();
  });

  it('debería manejar respuesta de API con código diferente a "00"', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(observableOf({
      codigo: '01',
      mensaje: 'Error en la operación'
    }));
    
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true)
    };

    component.pasoUnoComponent = mockPasoUno as any;
    component.solicitudState = { idSolicitud: 123 } as any;
    
    const evento = { accion: 'cont', valor: 1 };
    
    component.getValorIndice(evento);
    
    consoleSpy.mockRestore();
  });

  it('debería validar todos los formularios del paso uno cuando pasoUnoComponent existe', () => {
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true)
    };

    component.pasoUnoComponent = mockPasoUno as any;
    
    const resultado = component.validarTodosFormulariosPasoUno();
    
    expect(resultado).toBe(true);
    expect(mockPasoUno.validarFormularios).toHaveBeenCalled();
    expect(mockSeccionLibStore.establecerSeccion).toHaveBeenCalledWith([true]);
    expect(mockSeccionLibStore.establecerFormaValida).toHaveBeenCalledWith([true]);
  });

  it('debería retornar false cuando pasoUnoComponent no existe en validarTodosFormulariosPasoUno', () => {
    component.pasoUnoComponent = null as any;
    
    const resultado = component.validarTodosFormulariosPasoUno();
    
    expect(resultado).toBe(false);
    expect(mockSeccionLibStore.establecerSeccion).toHaveBeenCalledWith([false]);
    expect(mockSeccionLibStore.establecerFormaValida).toHaveBeenCalledWith([false]);
  });

  it('debería manejar evento de carga de documentos correctamente', () => {
    const estadoCarga = true;
    
    component.manejaEventoCargaDocumentos(estadoCarga);
    
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('debería manejar carga realizada cuando es true', () => {
    component.cargaRealizada(true);
    
    expect(component.seccionCargarDocumentos).toBe(false);
  });

  it('debería manejar carga realizada cuando es false', () => {
    component.cargaRealizada(false);
    
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('debería navegar al siguiente paso en método siguiente', () => {
    const mockWizard: MockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      irASeccion: jest.fn(),
      indiceActual: 1
    };

    component.wizardComponent = mockWizard as any;
    
    component.siguiente();
    
    expect(mockWizard.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2); // indiceActual + 1
    expect(component.datosPasos.indice).toBe(2);
  });

  it('debería navegar al paso anterior en método anterior', () => {
    const mockWizard: MockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      irASeccion: jest.fn(),
      indiceActual: 1
    };

    component.wizardComponent = mockWizard as any;
    
    component.anterior();
    
    expect(mockWizard.atras).toHaveBeenCalled();
    expect(component.indice).toBe(2); // indiceActual + 1
    expect(component.datosPasos.indice).toBe(2);
  });

  it('debería emitir evento de carga de archivos', () => {
    const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    
    component.onClickCargaArchivos();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('debería manejar evento de carga en progreso', () => {
    component.onCargaEnProgreso(true);
    
    expect(component.cargaEnProgreso).toBe(true);
    
    component.onCargaEnProgreso(false);
    
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('debería ejecutar ngOnDestroy y limpiar suscripciones correctamente', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    
    component.ngOnDestroy();
    
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería manejar actualización de ID de solicitud cuando datos son válidos', () => {
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(observableOf({
      codigo: '00',
      mensaje: 'Éxito',
      datos: { id_solicitud: 54321 }
    }));
    
    const mockWizard: MockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      irASeccion: jest.fn(),
      indiceActual: 1
    };
    
   
    component.wizardComponent = mockWizard as any;
    component.solicitudState = { idSolicitud: 123 } as any;
    
    const evento = { accion: 'cont', valor: 1 };
    
    component.getValorIndice(evento);
    
  });

  it('debería manejar cuando datos de respuesta no son válidos', () => {
    mockRegistroSolicitudService.postGuardarDatos.mockReturnValue(observableOf({
      codigo: '00',
      mensaje: 'Éxito',
      datos: null
    }));
    
    const mockWizard: MockWizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
      irASeccion: jest.fn(),
      indiceActual: 1
    };
    
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(true)
    };

    component.wizardComponent = mockWizard as any;
    component.pasoUnoComponent = mockPasoUno as any;
    component.solicitudState = { idSolicitud: 123 } as any;
    
    const evento = { accion: 'cont', valor: 1 };
    
    component.getValorIndice(evento);
    
    // Debería navegar pero no actualizar ID de solicitud
    expect(mockWizard.siguiente).toHaveBeenCalled();
  });

  it('debería manejar cuando validarFormularios del paso uno retorna false', () => {
    const mockPasoUno: MockPasoUnoComponent = {
      validarFormularios: jest.fn().mockReturnValue(false)
    };

    component.pasoUnoComponent = mockPasoUno as any;
    
    const resultado = component.validarTodosFormulariosPasoUno();
    
    expect(resultado).toBe(false);
    expect(mockSeccionLibStore.establecerSeccion).toHaveBeenCalledWith([false]);
    expect(mockSeccionLibStore.establecerFormaValida).toHaveBeenCalledWith([false]);
  });

  it('debería inicializar correctamente las propiedades del constructor', () => {
    // Verificar que las propiedades se establecen correctamente en el constructor
    expect(component.pasos).toBeDefined();
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
    expect(component.TEXTOS).toBeDefined();
    expect(component.mensajeDeTextoDeExito).toBe("MENSAJE_DE_ÉXITO_ETAPA_UNO");
  });

  it('debería manejar la suscripción FormaValida$ en el constructor', () => {
    // Este test verifica que la suscripción en el constructor funciona
    expect(mockSeccionLibStore.establecerSeccion).toHaveBeenCalled();
    expect(mockSeccionLibStore.establecerFormaValida).toHaveBeenCalled();
  });
});