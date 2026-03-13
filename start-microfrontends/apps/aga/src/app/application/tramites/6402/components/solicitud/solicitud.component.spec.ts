// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder } from '@angular/forms';
import { Tramite6402Store } from '../../estados/tramite6402.store';
import { Tramite6402Query } from '../../estados/tramite6402.query';
import { AutorizacionImportacionService } from '../../services/autorizacion-importacion.service';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';

jest.mock('bootstrap', () => ({
  Modal: jest.fn()
}));

// Servicios simulados para las pruebas
@Injectable()
class MockTramite6402Store {}

@Injectable()
class MockTramite6402Query {}

@Injectable()
class MockAutorizacionImportacionService {}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

// Pipes simulados para las pruebas
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

describe('SolicitudComponent', () => {
  let fixture;
  let component : SolicitudComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SolicitudComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite6402Store, useClass: MockTramite6402Store },
        { provide: Tramite6402Query, useClass: MockTramite6402Query },
        { provide: AutorizacionImportacionService, useClass: MockAutorizacionImportacionService },
        ValidacionesFormularioService,
        ConsultaioQuery
      ]
    }).overrideComponent(SolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #datosPedimento', async () => {
    component.solicitudFormulario = component.solicitudFormulario || {};
    component.solicitudFormulario.get = jest.fn();
    const datosPedimento = component.datosPedimento;
    expect(component.solicitudFormulario.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #datosMedioTransporte', async () => {
    component.solicitudFormulario = component.solicitudFormulario || {};
    component.solicitudFormulario.get = jest.fn();
    const datosMedioTransporte = component.datosMedioTransporte;
    expect(component.solicitudFormulario.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #datosDestinoMercancia', async () => {
    component.solicitudFormulario = component.solicitudFormulario || {};
    component.solicitudFormulario.get = jest.fn();
    const datosDestinoMercancia = component.datosDestinoMercancia;
    expect(component.solicitudFormulario.get).toHaveBeenCalled();
  });

  it('should run GetterDeclaration #datosAduana', async () => {
    component.solicitudFormulario = component.solicitudFormulario || {};
    component.solicitudFormulario.get = jest.fn();
    const datosAduana = component.datosAduana;
    expect(component.solicitudFormulario.get).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.selectSolicitud$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.cargarFederativa = jest.fn();
    component.cargarAduanas = jest.fn();
    component.cargarAduaneras = jest.fn();
    component.cargarRecintoFiscalizado = jest.fn();
    component.cargarTipoDeDocumento = jest.fn();
    component.cargarMedioDeTransporte = jest.fn();
    component.cargarPaisDeProcedencia = jest.fn();
    component.cargarSiNo = jest.fn();
    component.cargarTipoDeDestino = jest.fn();
    component.inicializarMercanciaFormulario = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.cargarFederativa).toHaveBeenCalled();
    expect(component.cargarAduanas).toHaveBeenCalled();
    expect(component.cargarAduaneras).toHaveBeenCalled();
    expect(component.cargarRecintoFiscalizado).toHaveBeenCalled();
    expect(component.cargarTipoDeDocumento).toHaveBeenCalled();
    expect(component.cargarMedioDeTransporte).toHaveBeenCalled();
    expect(component.cargarPaisDeProcedencia).toHaveBeenCalled();
    expect(component.cargarSiNo).toHaveBeenCalled();
    expect(component.cargarTipoDeDestino).toHaveBeenCalled();
    expect(component.inicializarMercanciaFormulario).toHaveBeenCalled();
  });

  it('should run #cambioImportacionTemporal()', () => {
    const mockFechaControl = {
      setValue: jest.fn(),
      markAsUntouched: jest.fn(),
    };

    const mockDatosPedimentoGroup = new FormGroup({
      fechaImportacionTemporal: new FormControl()
    });
    jest.spyOn(mockDatosPedimentoGroup, 'get').mockReturnValue(mockFechaControl as any);

    component.solicitudFormulario = new FormGroup({
      datosPedimento: mockDatosPedimentoGroup
    });

    component.store = {
      setFechaImportacionTemporal: jest.fn()
    } as any;

    component.cambioImportacionTemporal('nuevoValor');

    expect(mockDatosPedimentoGroup.get).toHaveBeenCalledWith('fechaImportacionTemporal');
    expect(mockFechaControl.setValue).toHaveBeenCalledWith('nuevoValor');
    expect(mockFechaControl.markAsUntouched).toHaveBeenCalled();
    expect(component.store.setFechaImportacionTemporal).toHaveBeenCalledWith('nuevoValor');
  });

  it('should run #cambioVencimiento()', () => {
    const mockFechaControl = {
      setValue: jest.fn(),
      markAsUntouched: jest.fn(),
    };

    const mockDatosPedimentoGroup = new FormGroup({
      fechaVencimiento: new FormControl()
    });
    jest.spyOn(mockDatosPedimentoGroup, 'get').mockReturnValue(mockFechaControl as any);

    component.solicitudFormulario = new FormGroup({
      datosPedimento: mockDatosPedimentoGroup
    });

    component.store = {
      setFechaVencimiento: jest.fn()
    } as any;

    component.cambioVencimiento('2025-06-26');

    expect(mockDatosPedimentoGroup.get).toHaveBeenCalledWith('fechaVencimiento');
    expect(mockFechaControl.setValue).toHaveBeenCalledWith('2025-06-26');
    expect(mockFechaControl.markAsUntouched).toHaveBeenCalled();
    expect(component.store.setFechaVencimiento).toHaveBeenCalledWith('2025-06-26');
  });

  it('should run #cambioFechaCartaPorte()', () => {
    const mockFechaControl = {
      setValue: jest.fn(),
      markAsUntouched: jest.fn(),
    };

    const mockDatosPedimentoGroup = new FormGroup({
      fechaCartaPorte: new FormControl()
    });
    jest.spyOn(mockDatosPedimentoGroup, 'get').mockReturnValue(mockFechaControl as any);

    component.solicitudFormulario = new FormGroup({
      datosPedimento: mockDatosPedimentoGroup
    });

    component.store = {
      setFechaCartaPorte: jest.fn()
    } as any;

    component.cambioFechaCartaPorte('nuevoValor');

    expect(mockDatosPedimentoGroup.get).toHaveBeenCalledWith('fechaCartaPorte');
    expect(mockFechaControl.setValue).toHaveBeenCalledWith('nuevoValor');
    expect(mockFechaControl.markAsUntouched).toHaveBeenCalled();
    expect(component.store.setFechaCartaPorte).toHaveBeenCalledWith('nuevoValor');
  });

  it('should run #cambioFechaDestino()', () => {
    const mockFechaControl = {
      setValue: jest.fn(),
      markAsUntouched: jest.fn()
    };

    // Crea un mock apropiado para datosDestinoMercancia que retorna el control
    const mockDatosDestinoMercanciaGroup = {
      get: jest.fn().mockReturnValue(mockFechaControl)
    };

    // Simula el método getter apropiadamente
    Object.defineProperty(component, 'datosDestinoMercancia', {
      get: () => mockDatosDestinoMercanciaGroup,
      configurable: true
    });

    // Simula getElementById y manipulación del DOM
    const mockElement = {
      querySelector: jest.fn().mockReturnValue({
        classList: {
          remove: jest.fn() // Agrega el método remove al elemento simulado
        },
      })
    };
    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any);

    component.store = {
      setFechaCartaPorte: jest.fn()
    } as any;

    component.cambioFechaDestino('nuevoValor');

    expect(mockDatosDestinoMercanciaGroup.get).toHaveBeenCalledWith('fechaDescruccionDestino');
    expect(mockFechaControl.setValue).toHaveBeenCalledWith('nuevoValor');
    expect(mockFechaControl.markAsUntouched).toHaveBeenCalled();
    expect(component.store.setFechaCartaPorte).toHaveBeenCalledWith('nuevoValor');
  });

  it('should run #setValoresStore()', () => {
    const mockMetodo = jest.fn();

    component.store = {
      metodoNombre: mockMetodo
    } as any;

    const mockForm = new FormGroup({
      campoEjemplo: new FormControl('valorEjemplo')
    });

    component.setValoresStore(mockForm, 'campoEjemplo', 'metodoNombre');

    expect(mockMetodo).toHaveBeenCalledWith('valorEjemplo');
  });

  it('should run #cargarAduaneras()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerAduaneras = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarAduaneras();
    expect(component.autorizacionImportacionService.obtenerAduaneras).toHaveBeenCalled();
  });

  it('should run #cargarAduanas()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerAduanas = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarAduanas();
    expect(component.autorizacionImportacionService.obtenerAduanas).toHaveBeenCalled();
  });

  it('should run #cargarRecintoFiscalizado()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerRecintoFiscalizado = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarRecintoFiscalizado();
    expect(component.autorizacionImportacionService.obtenerRecintoFiscalizado).toHaveBeenCalled();
  });

  it('should run #cargarTipoDeDocumento()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerTipoDeDocumento = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarTipoDeDocumento();
    expect(component.autorizacionImportacionService.obtenerTipoDeDocumento).toHaveBeenCalled();
  });

  it('should run #cargarMedioDeTransporte()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerMedioDeTransporte = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarMedioDeTransporte();
    expect(component.autorizacionImportacionService.obtenerMedioDeTransporte).toHaveBeenCalled();
  });

  it('should run #cargarPaisDeProcedencia()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerPaisDeProcedencia = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarPaisDeProcedencia();
    expect(component.autorizacionImportacionService.obtenerPaisDeProcedencia).toHaveBeenCalled();
  });

  it('should run #cargarSiNo()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerSiNo = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarSiNo();
    expect(component.autorizacionImportacionService.obtenerSiNo).toHaveBeenCalled();
  });

  it('should run #cargarTipoDeDestino()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerTipoDeDestino = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarTipoDeDestino();
    expect(component.autorizacionImportacionService.obtenerTipoDeDestino).toHaveBeenCalled();
  });

  it('should run #cargarFederativa()', async () => {
    component.autorizacionImportacionService = component.autorizacionImportacionService || {};
    component.autorizacionImportacionService.obtenerFederativa = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.cargarFederativa();
    expect(component.autorizacionImportacionService.obtenerFederativa).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.solicitudFormulario = 'solicitudFormulario';
    component.inicializarEstadoFormulario = jest.fn();
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should enable form when soloLectura is false', () => {
    component.soloLectura = false;
    component.solicitudFormulario = {
      disable: jest.fn(),
      enable: jest.fn()
    } as any;

    component.inicializarEstadoFormulario();

    expect(component.solicitudFormulario.disable).not.toHaveBeenCalled();
    expect(component.solicitudFormulario.enable).toHaveBeenCalled();
  });

  it('should run #inicializarMercanciaFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.mercanciaFormulario = 'mercanciaFormulario';
    component.inicializarMercanciaFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
    expect(component.validacionesService.isValid).toHaveBeenCalled();
  });

  it('should run #filaSeleccionada()', async () => {

    component.filaSeleccionada({});

  });

  it('should run #eliminarMercancia()', () => {
    const includesMock = jest.fn().mockReturnValue(true); // Simula que encuentra un elemento
    component.filaSeleccionadaLista = ['elemento1']; // Lista no vacía para que includesMock sea llamado
    component.filaSeleccionadaLista.includes = includesMock;

    component.tablaDeDatos = {
      datos: [{ id: 1 }, { id: 2 }, { id: 3 }]
    };

    component.eliminarMercancia();

    expect(includesMock).toHaveBeenCalled();
  });

  it('should run #abiertoMercancia()', () => {
    const mockShow = jest.fn();
    (Modal as jest.Mock).mockImplementation(() => ({
      show: mockShow
    }));

    component.modalMercancia = {
      nativeElement: document.createElement('div') // o un div simulado
    };

    // Inicializar simulacro de mercanciaFormulario
    component.mercanciaFormulario = {
      reset: jest.fn(),
      markAsUntouched: jest.fn(),
      markAsPristine: jest.fn()
    } as any;

    component.abiertoMercancia();

    expect(Modal).toHaveBeenCalledWith(component.modalMercancia.nativeElement);
    expect(component.mercanciaFormulario.reset).toHaveBeenCalled();
    expect(component.mercanciaFormulario.markAsUntouched).toHaveBeenCalled();
    expect(component.mercanciaFormulario.markAsPristine).toHaveBeenCalled();
    expect(mockShow).toHaveBeenCalled();
  });

  it('should run #cargarMercanciaTabla()', async () => {
    // Simula un mercanciaFormulario válido
    component.mercanciaFormulario = {
      valid: true,
      get: jest.fn().mockReturnValue({ value: 'test value', invalid: false }),
      value: {
        marcaMercancia: 'Test Brand',
        modeloMercancia: 'Test Model',
        numSerieMercancia: '12345',
        tipoMercancia: 'Test Type',
        modalDescMercancia: 'Test Description',
        espeMercancia: 'Test Species'
      },
      reset: jest.fn(),
      markAsUntouched: jest.fn(),
      markAsPristine: jest.fn()
    } as any;

    component.tablaDeDatos = {
      datos: []
    };

    component.cargarMercanciaTabla();

    expect(component.tablaDeDatos.datos).toHaveLength(1);
    expect(component.mercanciaFormulario.reset).toHaveBeenCalled();
    expect(component.mercanciaFormulario.markAsUntouched).toHaveBeenCalled();
    expect(component.mercanciaFormulario.markAsPristine).toHaveBeenCalled();
  });

  it('should run #agregarMercancia()', async () => {
    // Simula un mercanciaFormulario válido
    component.mercanciaFormulario = {
      invalid: false,
      valid: true,
      controls: {}
    } as any;

    component.cargarMercanciaTabla = jest.fn();
    component.closeMercancia = {
      nativeElement: {
        click: jest.fn()
      }
    } as any;

    component.agregarMercancia();

    expect(component.cargarMercanciaTabla).toHaveBeenCalled();
    expect(component.closeMercancia.nativeElement.click).toHaveBeenCalled();
  });

  it('should run #abrirModal()', async () => {

    component.abrirModal();

  });

  it('should run #cambiarTipoDocumento()', async () => {
    // Crear controles simulados separados para diferentes campos
    const mockResetControl = {
      reset: jest.fn(),
    };

    const mockCveTipoDocumento = {
      value: 'Pedimento'
    };

    const mockCheckProrroga = {
      setValue: jest.fn(),
      disable: jest.fn(),
      enable: jest.fn()
    };

    const mockFolioOficialProrroga = {
      disable: jest.fn()
    };

    // Simula el FormGroup datosPedimento
    const mockDatosPedimento = new FormGroup({
      cveTipoDocumento: new FormControl('Pedimento'),
      checkProrroga: new FormControl(true),
      folioOficialProrroga: new FormControl('test'),
      descMercancia: new FormControl('test'),
      marca: new FormControl('test'),
      modelo: new FormControl('test'),
      numeroSerie: new FormControl('test'),
      tipo: new FormControl('test')
    });

    // Todos los campos que deben ser reiniciados según la implementación
    const fieldsToReset = ['descMercancia', 'marca', 'modelo', 'numeroSerie', 'tipo', 'folioOficialProrroga', 'fechaImportacionTemporal', 'fechaVencimiento', 'folioFormatoOficial', 'folioImportacionTemporal', 'patente', 'pedimento', 'aduana'];

    // Espía el método get para retornar los mocks apropiados
    jest.spyOn(mockDatosPedimento, 'get').mockImplementation((controlName: string) => {
      if (fieldsToReset.includes(controlName)) {
        return mockResetControl as any;
      }
      if (controlName === 'cveTipoDocumento') {
        return mockCveTipoDocumento as any;
      }
      if (controlName === 'checkProrroga') {
        return mockCheckProrroga as any;
      }
      return null;
    });

    // Simula el solicitudFormulario
    component.solicitudFormulario = new FormGroup({
      datosPedimento: mockDatosPedimento
    });

    component.cambiarTipoDocumento();

    // Verifica que get fue llamado para cveTipoDocumento
    expect(mockDatosPedimento.get).toHaveBeenCalledWith('cveTipoDocumento');
    
    // Verifica que reset fue llamado para cada campo (13 veces en total)
    expect(mockResetControl.reset).toHaveBeenCalledTimes(13);
    
    // Verifica que checkProrroga fue habilitado (ya que cveTipoDocumento no es 'Folio VUCEM')
    expect(mockCheckProrroga.enable).toHaveBeenCalled();
  });

  it('should run #cambiarCheckProrroga()', () => {
    const mockEnable = jest.fn();
    const mockDisable = jest.fn();
    const mockSetValue = jest.fn();

    const mockCheckProrrogaControl = new FormControl(true);
    const mockFolioControl = {
      enable: mockEnable,
      disable: mockDisable,
      setValue: mockSetValue,
      value: ''
    };

    const mockDatosPedimento = new FormGroup({
      checkProrroga: mockCheckProrrogaControl
    });

    jest.spyOn(mockDatosPedimento, 'get').mockImplementation((campo: string) => {
      if (campo === 'checkProrroga') {
        return mockCheckProrrogaControl;
      }
      if (campo === 'folioOficialProrroga') {
        return mockFolioControl as any;
      }
      return null;
    });

    component.solicitudFormulario = new FormGroup({
      datosPedimento: mockDatosPedimento
    });

    component.cambiarCheckProrroga();

    expect(mockDatosPedimento.get).toHaveBeenCalledWith('checkProrroga');
    expect(mockDatosPedimento.get).toHaveBeenCalledWith('folioOficialProrroga');

    if (mockCheckProrrogaControl.value === true) {
      expect(mockEnable).toHaveBeenCalled();
    } else {
      expect(mockSetValue).toHaveBeenCalledWith('');
      expect(mockDisable).toHaveBeenCalled();
    }
  });

 it('should disable and clear checkProrroga when cveTipoDocumento is "Folio VUCEM"', () => {
    const mockCheckProrroga = {
      enable: jest.fn(),
      disable: jest.fn(),
      setValue: jest.fn()
    };

    const mockDatosPedimento = new FormGroup({
      cveTipoDocumento: new FormControl('Folio VUCEM'),
      checkProrroga: new FormControl('')
    });

    jest.spyOn(mockDatosPedimento, 'get').mockImplementation((controlName: string) => {
      if (controlName === 'cveTipoDocumento') return { value: 'Folio VUCEM' };
      if (controlName === 'checkProrroga') return mockCheckProrroga as any;
      return null;
    });

    component.solicitudFormulario = new FormGroup({
      datosPedimento: mockDatosPedimento
    });

    component.cambiarMedioDeTransporte();

    expect(mockCheckProrroga.setValue).toHaveBeenCalledWith('');
    expect(mockCheckProrroga.disable).toHaveBeenCalled();
    expect(mockCheckProrroga.enable).not.toHaveBeenCalled();
  });

  it('should enable checkProrroga when cveTipoDocumento is not "Folio VUCEM"', () => {
    const mockCheckProrroga = {
      enable: jest.fn(),
      disable: jest.fn(),
      setValue: jest.fn()
    };

    const mockDatosPedimento = new FormGroup({
      cveTipoDocumento: new FormControl('Some other value'),
      checkProrroga: new FormControl('')
    });

    jest.spyOn(mockDatosPedimento, 'get').mockImplementation((controlName: string) => {
      if (controlName === 'cveTipoDocumento') return { value: 'Some other value' };
      if (controlName === 'checkProrroga') return mockCheckProrroga as any;
      return null;
    });

    component.solicitudFormulario = new FormGroup({
      datosPedimento: mockDatosPedimento
    });

    component.cambiarMedioDeTransporte();

    expect(mockCheckProrroga.enable).toHaveBeenCalled();
    expect(mockCheckProrroga.setValue).not.toHaveBeenCalled();
    expect(mockCheckProrroga.disable).not.toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

});