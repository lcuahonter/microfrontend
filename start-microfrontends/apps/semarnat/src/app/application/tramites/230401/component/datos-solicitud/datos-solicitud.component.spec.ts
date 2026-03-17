// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { PantallasActionService } from '../../services/pantallas-action.service';
import { ValidacionesFormularioService, ConsultaioQuery, SeccionLibQuery } from '@ng-mf/data-access-user';
import { Tramite230401Store } from '../../estados/tramite230401.store';
import { FormBuilder } from '@angular/forms';
import { Solicitud230401Query } from '../../estados/queries/solicitud230401.query';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockPantallasActionService {
  inicializaPasoUnoDatosCatalogos = function() {};
}

@Injectable()
class MockTramite230401Store {}

@Injectable()
class MockSolicitud230401Query {}

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

describe('DatosSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      declarations: [
        DatosSolicitudComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: PantallasActionService, useClass: MockPantallasActionService },
        ValidacionesFormularioService,
        { provide: Tramite230401Store, useClass: MockTramite230401Store },
        FormBuilder,
        { provide: Solicitud230401Query, useClass: MockSolicitud230401Query },
        ConsultaioQuery,
        SeccionLibQuery,
        SeccionLibStore
      ]
    }).overrideComponent(DatosSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosSolicitudComponent);
    component = fixture.debugElement.componentInstance;

    // Mock FormSolicitud initialization
    component.FormSolicitud = {
      patchValue: jest.fn(),
      get: jest.fn().mockReturnValue({ value: {} }),
      statusChanges: observableOf({}),
      valid: true,
    };
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.solicitud230401Query = component.solicitud230401Query || {};
    component.solicitud230401Query.selectSolicitud$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({create: false, procedureId: "230401", readonly: false});
    component.inicializarEstadoFormulario = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.ngOnInit();
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.controls = ['autorizacion', 'tipoSolicitud']
    component.FormSolicitud.valid = 'valid';
    component.FormSolicitud.statusChanges = observableOf({valid: true});
    component.seccionStore = {
      establecerFormaValida: jest.fn()
    };
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario() esFormularioSoloLectura is true', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.disable = jest.fn();
    component.FormSolicitud.enable = jest.fn();
    component.creatFormSolicitud = jest.fn();
    component.esFormularioSoloLectura = true;

    component.inicializarEstadoFormulario();
    expect(component.FormSolicitud.disable).toHaveBeenCalled();
  });
    it('should run #inicializarEstadoFormulario() esFormularioSoloLectura is false', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.disable = jest.fn();
    component.FormSolicitud.enable = jest.fn();
    component.creatFormSolicitud = jest.fn();
    component.esFormularioSoloLectura = false;

    component.inicializarEstadoFormulario();
    expect(component.FormSolicitud.enable).toHaveBeenCalled();
  });
  
  it('should run FormSolicitud is false', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.disable = jest.fn();
    component.FormSolicitud.enable = jest.fn();
    component.creatFormSolicitud = jest.fn();
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.FormSolicitud.enable).toHaveBeenCalled();
  });

  it('should run #esFormValido()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.controls = ['a', 'b']
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      invalid: {},
      enabled: {}
    });
    component.esFormValido();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({}, {});
    expect(component.validacionesService.isValid).toHaveBeenCalled();
  });

  it('should run #agregar()', async () => {
    component.paisDeProcedenciaSeleccionadas = component.paisDeProcedenciaSeleccionadas || {};
    component.paisDeProcedenciaSeleccionadas.push = jest.fn();
    component.paisDeProcedenciaDatos = component.paisDeProcedenciaDatos || {};
    component.paisDeProcedenciaDatos.FECHAVALOR = 'FECHAVALOR';
    component.paisDeProcedenciaDatos.splice = jest.fn();
    component.paisDeProcedenciaFecha = {};
    component.paisDeProcedenciaFecha.value = {
      0: "F",
      1: "E",
      2: "C",
      3: "H",
      4: "A",
      5: "V",
      6: "A",
      7: "L",
      8: "O",
      9: "R",
      map: jest.fn()
    };
    component.agregar({});
    expect(component.paisDeProcedenciaSeleccionadas.push).toHaveBeenCalled();
    expect(component.paisDeProcedenciaDatos.splice).toHaveBeenCalled();
  });

  it('should run #quitar()', async () => {
    component.paisDeProcedenciaSeleccionadas = component.paisDeProcedenciaSeleccionadas || {};
    component.paisDeProcedenciaSeleccionadas.FECHAVALOR = 'FECHAVALOR';
    component.paisDeProcedenciaSeleccionadas.splice = jest.fn();
    component.paisDeProcedenciaDatos = component.paisDeProcedenciaDatos || {};
    component.paisDeProcedenciaDatos.push = jest.fn();
    component.paisDeProcedenciaFechaSeleccionada = component.paisDeProcedenciaFechaSeleccionada || {};
    component.paisDeProcedenciaFechaSeleccionada.value = {
      0: "F",
      1: "E",
      2: "C",
      3: "H",
      4: "A",
      5: "V",
      6: "A",
      7: "L",
      8: "O",
      9: "R",
      map: jest.fn()
    };
    component.quitar();
    expect(component.paisDeProcedenciaSeleccionadas.splice).toHaveBeenCalled();
    expect(component.paisDeProcedenciaDatos.push).toHaveBeenCalled();
  });

  it('should run #agregarDos()', async () => {
    component.paisDelProductoSeleccionadas = component.paisDelProductoSeleccionadas || {};
    component.paisDelProductoSeleccionadas.push = jest.fn();
    component.paisDelProductoDatos = component.paisDelProductoDatos || {};
    component.paisDelProductoDatos.FECHAVALOR = 'FECHAVALOR';
    component.paisDelProductoDatos.splice = jest.fn();
    component.paisDelProductoFecha = component.paisDelProductoFecha || {};
    component.paisDelProductoFecha.value = {
      0: "F",
      1: "E",
      2: "C",
      3: "H",
      4: "A",
      5: "V",
      6: "A",
      7: "L",
      8: "O",
      9: "R",
      map: jest.fn()
    };
    component.agregarDos({});
    expect(component.paisDelProductoSeleccionadas.push).toHaveBeenCalled();
    expect(component.paisDelProductoDatos.splice).toHaveBeenCalled();
  });

  it('should run #quitarDos()', async () => {
    component.paisDelProductoSeleccionadas = component.paisDelProductoSeleccionadas || {};
    component.paisDelProductoSeleccionadas.FECHAVALOR = 'FECHAVALOR';
    component.paisDelProductoSeleccionadas.splice = jest.fn();
    component.paisDelProductoDatos = component.paisDelProductoDatos || {};
    component.paisDelProductoDatos.push = jest.fn();
    component.paisDeProcedenciaFechaSeleccionada = component.paisDeProcedenciaFechaSeleccionada || {};
    component.paisDeProcedenciaFechaSeleccionada.value = {
      0: "F",
      1: "E",
      2: "C",
      3: "H",
      4: "A",
      5: "V",
      6: "A",
      7: "L",
      8: "O",
      9: "R",
      map: jest.fn()
    };
    component.quitarDos();
    expect(component.paisDelProductoSeleccionadas.splice).toHaveBeenCalled();
    expect(component.paisDelProductoDatos.push).toHaveBeenCalled();
  });

  it('should run #agregarTres()', async () => {
    component.aduanasDeEntradaSeleccionadas = component.aduanasDeEntradaSeleccionadas || {};
    component.aduanasDeEntradaSeleccionadas.push = jest.fn();
    component.aduanasDeEntradaDatos = component.aduanasDeEntradaDatos || {};
    component.aduanasDeEntradaDatos.FECHAVALOR = 'FECHAVALOR';
    component.aduanasDeEntradaDatos.splice = jest.fn();
    component.aduanasDeEntradaFecha = component.aduanasDeEntradaFecha || {};
    component.aduanasDeEntradaFecha.value = {
      0: "F",
      1: "E",
      2: "C",
      3: "H",
      4: "A",
      5: "V",
      6: "A",
      7: "L",
      8: "O",
      9: "R",
      map: jest.fn()
    };
    component.agregarTres({});
    expect(component.aduanasDeEntradaSeleccionadas.push).toHaveBeenCalled();
    expect(component.aduanasDeEntradaDatos.splice).toHaveBeenCalled();
  });

  it('should run #quitarTres()', async () => {
    component.aduanasDeEntradaSeleccionadas = component.aduanasDeEntradaSeleccionadas || {};
    component.aduanasDeEntradaSeleccionadas.FECHAVALOR = 'FECHAVALOR';
    component.aduanasDeEntradaSeleccionadas.splice = jest.fn();
    component.aduanasDeEntradaDatos = component.aduanasDeEntradaDatos || {};
    component.aduanasDeEntradaDatos.push = jest.fn();
    component.aduanasDeEntradaFechaSeleccionada = component.aduanasDeEntradaFechaSeleccionada || {};
    component.aduanasDeEntradaFechaSeleccionada.value = {
      0: "F",
      1: "E",
      2: "C",
      3: "H",
      4: "A",
      5: "V",
      6: "A",
      7: "L",
      8: "O",
      9: "R",
      map: jest.fn()
    };
    component.quitarTres();
    expect(component.aduanasDeEntradaSeleccionadas.splice).toHaveBeenCalled();
    expect(component.aduanasDeEntradaDatos.push).toHaveBeenCalled();
  });

 
  it('should run #setValoresStore() with campo as "cantidad" and null value', async () => {
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setCantidad = jest.fn();

    const mockForm = {
      get: jest.fn().mockReturnValue({
        value: null
      })
    };

    component.setValoresStore(mockForm as unknown as FormGroup, 'cantidad');
    expect(mockForm.get).toHaveBeenCalledWith('cantidad');
    expect(component.tramite230401Store.setCantidad).not.toHaveBeenCalled();
  });

  it('should run #setValoresStore() with campo as "cantidad" and undefined value', async () => {
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setCantidad = jest.fn();

    const mockForm = {
      get: jest.fn().mockReturnValue({
        value: undefined
      })
    };

    component.setValoresStore(mockForm as unknown as FormGroup, 'cantidad');
    expect(mockForm.get).toHaveBeenCalledWith('cantidad');
    expect(component.tramite230401Store.setCantidad).not.toHaveBeenCalled();
  });

  it('should run #setValoresStore() with campo other than "cantidad"', async () => {
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setCantidad = jest.fn();

    const mockForm = {
      get: jest.fn().mockReturnValue({
        value: '123'
      })
    };

    component.setValoresStore(mockForm as unknown as FormGroup, 'tipo');
    expect(mockForm.get).toHaveBeenCalledWith('tipo');
    expect(component.tramite230401Store.setCantidad).not.toHaveBeenCalled();
  });

  it('should run #tipoSolicitudSeleccion()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setTipoSolicitud = jest.fn();
    component.tipoSolicitudSeleccion();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.tramite230401Store.setTipoSolicitud).toHaveBeenCalled();
  });

  it('should run #noDePermisocoferpriseSeleccion()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setNoDePermisocoferprise = jest.fn();
    component.noDePermisocoferpriseSeleccion();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.patchValue = jest.fn();
  });

  it('should run #fraccionArancelariaSeleccion()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.FormSolicitud.patchValue = jest.fn();
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setDescripcionDeLaFraccion = jest.fn();
    component.tramite230401Store.setFraccionArancelaria = jest.fn();
    component.fraccionArancelariaSeleccion();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.FormSolicitud.patchValue).toHaveBeenCalled();
    expect(component.tramite230401Store.setDescripcionDeLaFraccion).toHaveBeenCalled();
    expect(component.tramite230401Store.setFraccionArancelaria).toHaveBeenCalled();
  });

  it('should run #seleccioneAutorizacion()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setAutorizacion = jest.fn();
    component.seleccioneAutorizacion();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.tramite230401Store.setAutorizacion).toHaveBeenCalled();
  });

  it('should run #numeroCasSeleccione()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.FormSolicitud.patchValue = jest.fn();
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setDescripcionNoArancelaria = jest.fn();
    component.tramite230401Store.setNombreQuimico = jest.fn();
    component.tramite230401Store.setNumeroCas = jest.fn();
    component.numeroCasSeleccione();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.FormSolicitud.patchValue).toHaveBeenCalled();
    expect(component.tramite230401Store.setDescripcionNoArancelaria).toHaveBeenCalled();
    expect(component.tramite230401Store.setNombreQuimico).toHaveBeenCalled();
    expect(component.tramite230401Store.setNumeroCas).toHaveBeenCalled();
  });

  it('should run #clasificacionSeleccione()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setClasificacion = jest.fn();
    component.clasificacionSeleccione();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.tramite230401Store.setClasificacion).toHaveBeenCalled();
  });

  it('should run #estadoFisicoSeleccione()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setEstadoFisico = jest.fn();
    component.estadoFisicoSeleccione();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.tramite230401Store.setEstadoFisico).toHaveBeenCalled();
  });

  it('should run #datosObjectoSeleccione()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setDatosObjecto = jest.fn();
    component.datosObjectoSeleccione();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.tramite230401Store.setDatosObjecto).toHaveBeenCalled();
  });

  it('should run #unidadDeMedidaSeleccione()', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setUnidadDeMedida = jest.fn();
    component.unidadDeMedidaSeleccione();
    expect(component.FormSolicitud.get).toHaveBeenCalled();
    expect(component.tramite230401Store.setUnidadDeMedida).toHaveBeenCalled();
  });

  it('should run #creatFormSolicitud()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.solicitudState = component.solicitudState || {};
    component.solicitudState.tipoSolicitud = 'tipoSolicitud';
    component.solicitudState.autorizada = 'autorizada';
    component.solicitudState.noDePermisocoferprise = 'noDePermisocoferprise';
    component.solicitudState.nombreComercial = 'nombreComercial';
    component.solicitudState.cantidadAutorizada = 'cantidadAutorizada';
    component.solicitudState.fraccionArancelaria = 'fraccionArancelaria';
    component.solicitudState.descripcionDeLaFraccion = 'descripcionDeLaFraccion';
    component.solicitudState.descripcionNoArancelaria = 'descripcionNoArancelaria';
    component.solicitudState.nombreQuimico = 'nombreQuimico';
    component.solicitudState.numeroCas = 'numeroCas';
    component.solicitudState.nombreDeLaMercancia = 'nombreDeLaMercancia';
    component.solicitudState.unNumero = 'unNumero';
    component.solicitudState.datosNombreComercial = 'datosNombreComercial';
    component.solicitudState.datosNumeroComun = 'datosNumeroComun';
    component.solicitudState.datosPorcentaje = 'datosPorcentaje';
    component.solicitudState.datosComponentes = 'datosComponentes';
    component.solicitudState.clasificacion = 'clasificacion';
    component.solicitudState.estadoFisico = 'estadoFisico';
    component.solicitudState.datosObjecto = 'datosObjecto';
    component.solicitudState.especifique = 'especifique';
    component.solicitudState.especifiqueDos = 'especifiqueDos';
    component.solicitudState.cantidad = 'cantidad';
    component.solicitudState.cantidadLetra = 'cantidadLetra';
    component.solicitudState.unidadDeMedida = 'unidadDeMedida';
    component.creatFormSolicitud();
    expect(component.fb.group).toHaveBeenCalled();
  });

it('should run #eliminarListaDeNumeros()', async () => {
    component.sustanciasSensiblesSeleccionadas =  [
      { numeroCAS: '123' }
    ];
    component.sustanciasSensiblesSeleccionadas.some = jest.fn().mockReturnValue([
      {
        "numeroCAS": {}
      }
    ]);
    component.sustanciasSensiblesTablaDatos =  [
      { numeroCAS: '123', nombre: 'toRemove' },
      { numeroCAS: '456', nombre: 'toKeep' }
    ];
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.update = jest.fn().mockReturnValue([
      null
    ]);
    component.eliminarListaDeNumeros();
    expect(component.tramite230401Store.update).toHaveBeenCalled();
  });

  it('should run #modificarListaDeNumeros()', async () => {
    component.sustanciasSensiblesSeleccionadas = component.sustanciasSensiblesSeleccionadas || {};
    component.sustanciasSensiblesSeleccionadas[0] = {
      numeroCAS: {},
      cas: {},
      descripcionNoArancelaria: {},
      nombreQuimico: {}
    };
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.patchValue = jest.fn();
    component.modificarListaDeNumeros();
    expect(component.FormSolicitud.patchValue).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #ngOnInit() and subscribe to solicitudState changes', async () => {
    const mockSolicitudState = { tipoSolicitud: 1 };
    component.solicitud230401Query = component.solicitud230401Query || {};
    component.solicitud230401Query.selectSolicitud$ = observableOf(mockSolicitudState);
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.solicitudState).toEqual(mockSolicitudState);
  });

  it('should run #ngOnInit() and subscribe to seccionState changes', async () => {
    const mockSeccionState = { esFormularioSoloLectura: true, rereadonly:true, create: false, procedureId: "230401" };
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf(mockSeccionState);
    component.seccionQuery.selectSeccionState$.pipe = jest.fn().mockReturnValue(observableOf(mockSeccionState));
    component.seccionQuery.selectSeccionState$ = observableOf(mockSeccionState);
    component.seccionQuery.selectSeccionState$.pipe = jest.fn().mockReturnValue(observableOf(mockSeccionState));
    component.solicitud230401Query.selectSolicitud$ = observableOf({ tipoSolicitud: 1 });
    component.solicitud230401Query.selectSolicitud$.pipe = jest.fn().mockReturnValue(observableOf({ tipoSolicitud: 1 }));
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.statusChanges = observableOf({ valid: true });
    component.FormSolicitud.get = jest.fn().mockReturnValue({ value: {} });
    component.seccionQuery.selectSeccionState$.pipe = jest.fn().mockReturnValue(observableOf(mockSeccionState));
    component.ngOnInit();
    expect(component.esFormularioSoloLectura).toBe(false);
  });

  it('should run #agregar() and handle empty paisDeProcedenciaFecha', async () => {
    component.paisDeProcedenciaSeleccionadas = [];
    component.seleccionarOrigenDelPais = [];
    component.paisDeProcedenciaDatos = ['FECHAVALOR'];
    const mockMap = jest.fn(() => []);
    component.paisDeProcedenciaFecha = { value: {map: mockMap} };
    component.agregar('t');
    expect(component.paisDeProcedenciaSeleccionadas.length).toBe(0);
    expect(component.paisDeProcedenciaDatos.length).toBe(0);
  });

  it('should run #quitar() and handle empty paisDeProcedenciaFechaSeleccionada', async () => {
    component.paisDeProcedenciaSeleccionadas = ['FECHAVALOR'];
    component.paisDeProcedenciaDatos = [];
    const mockMap = jest.fn(() => []);
    component.paisDeProcedenciaFechaSeleccionada = { value: {map: mockMap} };
    component.quitar('');
    expect(component.paisDeProcedenciaSeleccionadas.length).toBe(0);
    expect(component.paisDeProcedenciaDatos.length).toBe(1);
  });

  it('should run #agregarDos() and handle empty paisDelProductoFecha', async () => {
    component.paisDelProductoSeleccionadas = [];
    component.listaPaisDelProducto = [];
    component.paisDelProductoDatos = ['FECHAVALOR'];
    const mockMap = jest.fn(() => []);
    component.paisDelProductoFecha = { value: {map: mockMap} };
    component.agregarDos('');
    expect(component.paisDelProductoSeleccionadas.length).toBe(1);
    expect(component.paisDelProductoDatos.length).toBe(0);
  });

  it('should run #quitarDos() and handle empty paisDelProductoFechaSeleccionada', async () => {
    component.paisDelProductoSeleccionadas = ['FECHAVALOR'];
    component.paisDelProductoDatos = [];
    const mockMap = jest.fn(() => []);
    component.paisDelProductoFechaSeleccionada = { value: {map: mockMap} };
    component.quitarDos('t');
    expect(component.paisDelProductoSeleccionadas.length).toBe(0);
    expect(component.paisDelProductoDatos.length).toBe(1);
  });

  it('should run #agregarTres() and handle empty aduanasDeEntradaFecha', async () => {
    component.aduanasDeEntradaSeleccionadas = [];
    component.aduanasDeEntradaDatos = ['FECHAVALOR'];
        const mockMap = jest.fn(() => []);
    component.aduanasDeEntradaFecha = { value: {map: mockMap} };
    component.agregarTres('');
    expect(component.aduanasDeEntradaSeleccionadas.length).toBe(1);
    expect(component.aduanasDeEntradaDatos.length).toBe(0);
  });

  it('should run #quitarTres() and handle empty aduanasDeEntradaFechaSeleccionada', async () => {
    component.aduanasDeEntradaSeleccionadas = ['FECHAVALOR'];
    component.aduanasDeEntradaDatos = [];
        const mockMap = jest.fn(() => []);

    component.aduanasDeEntradaFechaSeleccionada = { value: {map: mockMap} };
    component.quitarTres('');
    expect(component.aduanasDeEntradaSeleccionadas.length).toBe(0);
    expect(component.aduanasDeEntradaDatos.length).toBe(1);
  });

  it('should run #modificarListaDeNumeros() and update FormSolicitud', async () => {
    component.sustanciasSensiblesSeleccionadas = [
      { numeroCAS: '123', cas: 'CAS123', descripcionNoArancelaria: 'desc', nombreQuimico: 'chemical' }
    ];
    component.FormSolicitud = { patchValue: jest.fn() };
    component.modificarListaDeNumeros();
  });

  it('should run #ngOnDestroy() and complete destroyNotifier$', async () => {
    component.destroyNotifier$ = { next: jest.fn(), complete: jest.fn() };
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #inicializarEstadoFormulario() and create FormSolicitud if not exists', async () => {
    component.FormSolicitud = null;
    component.creatFormSolicitud = jest.fn();
    component.inicializarEstadoFormulario();
    expect(component.creatFormSolicitud).toHaveBeenCalled();
  });

  it('should run #esFormValido() and return false for invalid controls', async () => {
    component.FormSolicitud = {
      controls: ['control1', 'control2'],
      get: jest.fn().mockReturnValue({ invalid: true, enabled: true })
    };
    const result = component.esFormValido();
    expect(result).toBe(false);
  });

  it('should run #esFormValido() and return true for valid controls', async () => {
    component.FormSolicitud = {
      controls: ['control1', 'control2'],
      get: jest.fn().mockReturnValue({ invalid: false, enabled: true })
    };
    const result = component.esFormValido();
    expect(result).toBe(true);
  });

  it('should run #agregarListaDeNumeros() and handle duplicate CAS numbers', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: { numeroCAS: '123' }
    });
    component.sustanciasSensiblesTablaDatos = [
      { numeroCAS: '123', nombre: 'existing' }
    ];
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setSustanciasSensiblesTablaDatos = jest.fn();
    component.agregarListaDeNumeros();
    expect(component.tramite230401Store.setSustanciasSensiblesTablaDatos).toHaveBeenCalled();
  });

  it('should run #eliminarListaDeNumeros() and handle non-existing CAS numbers', async () => {
    component.sustanciasSensiblesSeleccionadas = [];
    component.sustanciasSensiblesTablaDatos = [
      { numeroCAS: '999', nombre: 'toKeep' }
    ];
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.update = jest.fn();
    component.eliminarListaDeNumeros();
    expect(component.tramite230401Store.update).not.toHaveBeenCalled();
  });

  it('should run #modificarListaDeNumeros() and handle empty selection', async () => {
    component.sustanciasSensiblesSeleccionadas = [];
    component.FormSolicitud = { patchValue: jest.fn() };
    component.modificarListaDeNumeros();
    expect(component.FormSolicitud.patchValue).not.toHaveBeenCalled();
  });

  it('should run #setValoresStore() and handle invalid campo', async () => {
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setCantidad = jest.fn();

    const mockForm = {
      get: jest.fn().mockReturnValue({
        value: '123'
      })
    };

    component.setValoresStore(mockForm as unknown as FormGroup, 'invalidCampo');
    expect(mockForm.get).toHaveBeenCalledWith('invalidCampo');
    expect(component.tramite230401Store.setCantidad).not.toHaveBeenCalled();
  });

  it('should run #tipoSolicitudSeleccion() and handle null value', async () => {
    component.FormSolicitud = {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: null
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setTipoSolicitud = jest.fn();
    component.tipoSolicitudSeleccion();
    expect(component.tramite230401Store.setTipoSolicitud).not.toHaveBeenCalled();
  });

  it('should run #seleccioneAutorizacion() and handle null value', async () => {
    component.FormSolicitud =  {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: null
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setAutorizacion = jest.fn();
    component.seleccioneAutorizacion();
    expect(component.tramite230401Store.setAutorizacion).toHaveBeenCalled();
  });

  it('should run #numeroCasSeleccione() and handle empty CAS number', async () => {
    component.FormSolicitud = component.FormSolicitud || {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: { numeroCas: '' }
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setNumeroCas = jest.fn();
    component.tramite230401Store.setDescripcionNoArancelaria = jest.fn();
    component.tramite230401Store.setNombreQuimico = jest.fn();
    component.numeroCasSeleccione();
    expect(component.tramite230401Store.setNumeroCas).toHaveBeenCalled();
  });

  it('should run #clasificacionSeleccione() and handle null value', async () => {
    component.FormSolicitud =  {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: null
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setClasificacion = jest.fn();
    component.clasificacionSeleccione();
    expect(component.tramite230401Store.setClasificacion).toHaveBeenCalled();
  });

  it('should run #estadoFisicoSeleccione() and handle null value', async () => {
    component.FormSolicitud =  {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: null
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setEstadoFisico = jest.fn();
    component.estadoFisicoSeleccione();
    expect(component.tramite230401Store.setEstadoFisico).toHaveBeenCalled();
  });

  it('should run #datosObjectoSeleccione() and handle null value', async () => {
    component.FormSolicitud = {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: null
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setDatosObjecto = jest.fn();
    component.datosObjectoSeleccione();
    expect(component.tramite230401Store.setDatosObjecto).toHaveBeenCalled();
  });

  it('should run #unidadDeMedidaSeleccione() and handle null value', async () => {
    component.FormSolicitud =  {};
    component.FormSolicitud.get = jest.fn().mockReturnValue({
      value: null
    });
    component.tramite230401Store = component.tramite230401Store || {};
    component.tramite230401Store.setUnidadDeMedida = jest.fn();
    component.unidadDeMedidaSeleccione();
    expect(component.tramite230401Store.setUnidadDeMedida).toHaveBeenCalled();
  });
});