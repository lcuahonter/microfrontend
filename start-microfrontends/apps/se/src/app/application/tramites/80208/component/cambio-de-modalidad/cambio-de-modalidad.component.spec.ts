// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CambioDeModalidadComponent } from './cambio-de-modalidad.component';
import { FormBuilder } from '@angular/forms';
import { CambioModalidadService } from '../../service/cambio-modalidad.service';
import { CambioModalidadQuery } from '../../estados/tramite80208.query';
import { CambioModalidadStore } from '../../estados/tramite80208.store';
import { SeccionLibQuery, SeccionLibStore, ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockCambioModalidadService {}

@Injectable()
class MockCambioModalidadQuery {}

@Injectable()
class MockCambioModalidadStore {}

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

describe('CambioDeModalidadComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,CambioDeModalidadComponent, HttpClientTestingModule ],
      declarations: [
        
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: CambioModalidadService, useClass: MockCambioModalidadService },
        { provide: CambioModalidadQuery, useClass: MockCambioModalidadQuery },
        { provide: CambioModalidadStore, useClass: MockCambioModalidadStore },
        SeccionLibQuery,
        SeccionLibStore,
        ConsultaioQuery
      ]
    }).overrideComponent(CambioDeModalidadComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CambioDeModalidadComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarForm = jest.fn();
    component.getCargarDatos = jest.fn();
    component.getCambioDeModalidad = jest.fn();
    component.getServiciosImmx = jest.fn();
    component.cambioModalidadQuery = component.cambioModalidadQuery || {};
    component.cambioModalidadQuery.selectCambioModalidad$ = observableOf({});
    component.cambioDeModalidadForm = component.cambioDeModalidadForm || {};
    component.cambioDeModalidadForm.patchValue = jest.fn();
    component.serviciosImmxForm = component.serviciosImmxForm || {};
    component.serviciosImmxForm.patchValue = jest.fn();
    component.ngOnInit();
    });

  it('should run #inicializarForm()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.seleccionaLaModalidad = 'seleccionaLaModalidad';
    component.tramiteState.folio = 'folio';
    component.tramiteState.ano = 'ano';
    component.tramiteState.seleccionaModalidad = 'seleccionaModalidad';
    component.tramiteState.cambioModalidad = 'cambioModalidad';
    component.tramiteState.serviciosImmx = 'serviciosImmx';
    component.inicializarForm();
   });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarForm = jest.fn();
    component.inicializarEstadoFormulario();
    });

  it('should run #enCambioDeCampo()', async () => {
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.actualizarEstado = jest.fn();
    component.enCambioDeCampo({}, {});
     });

  it('should run #agregarServiciosAmpliacion()', async () => {
    component.serviciosImmxForm = component.serviciosImmxForm || {};
    component.serviciosImmxForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.serviciosImmx = component.serviciosImmx || {};
    component.serviciosImmx.find = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.actualizarEstado = jest.fn();
    component.agregarServiciosAmpliacion();
    });

  it('should run #eliminarServiciosGrid()', async () => {
    component.ServiciosDatos = component.ServiciosDatos || {};
    component.ServiciosDatos.findIndex = jest.fn().mockReturnValue([
      {
        "descripcionDelServicio": {}
      }
    ]);
    component.domiciliosSeleccionados = component.domiciliosSeleccionados || {};
    component.domiciliosSeleccionados = '0';
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.actualizarEstado = jest.fn();
    component.eliminarServiciosGrid();
    });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarForm = jest.fn();
    component.cambioDeModalidadForm = component.cambioDeModalidadForm || {};
    component.cambioDeModalidadForm.disable = jest.fn();
    component.cambioDeModalidadForm.enable = jest.fn();
    component.guardarDatosFormulario();
     });

  it('should run #getCargarDatos()', async () => {
    component.modalidadService = component.modalidadService || {};
    component.modalidadService.getDatosSimulados = jest.fn().mockReturnValue(observableOf({}));
    component.cambioDeModalidadForm = component.cambioDeModalidadForm || {};
    component.cambioDeModalidadForm.patchValue = jest.fn();
    component.getCargarDatos();
    });

  it('should run #getServiciosImmx()', async () => {
    component.modalidadService = component.modalidadService || {};
    component.modalidadService.getServiciosImmx = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.getServiciosImmx();
    });

  it('should run #getCambioDeModalidad()', async () => {
    component.modalidadService = component.modalidadService || {};
    component.modalidadService.getCambioDeModalidad = jest.fn().mockReturnValue(observableOf({
      cambioModalidad: {
        data: {}
      }
    }));
    component.cambioDeModalidadForm = component.cambioDeModalidadForm || {};
    component.cambioDeModalidadForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.toggleServiciosImmx = jest.fn();
    component.getCambioDeModalidad();
   });

  it('should run #toggleServiciosImmx()', async () => {
    component.cambioDeModalidad = component.cambioDeModalidad || {};
    component.cambioDeModalidad.find = jest.fn().mockReturnValue([
      {
        "id": {}
      }
    ]);
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.actualizarEstado = jest.fn();
    component.toggleServiciosImmx({});
    });

  it('should run #seleccionarDesplegable()', async () => {
    component.toggleServiciosImmx = jest.fn();
    component.cambioDeModalidadForm = component.cambioDeModalidadForm || {};
    component.cambioDeModalidadForm.value = {
      cambioDeModalidad: {
        toString: function() {}
      }
    };
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.actualizarEstado = jest.fn();
    component.seleccionarDesplegable();
     });


  it('should run #seleccionarDomicilios()', async () => {
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.setDomiciliosSeleccionados = jest.fn();
    component.seleccionarDomicilios({});
  });

  it('should run #eliminarEmpresasNacionales()', async () => {
    component.datos = component.datos || {};
    component.datos.findIndex = jest.fn().mockReturnValue([
      {
        "registroContribuyentes": {}
      }
    ]);
    component.empresasSeleccionados = component.empresasSeleccionados || {};
    component.empresasSeleccionados = {
      registroContribuyentes: {}
    };
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.actualizarEstado = jest.fn();
    component.eliminarEmpresasNacionales();
      });

  it('should run #actualizaGridEmpresasNacionales()', async () => {
    component.rfcEmpresa = component.rfcEmpresa || {};
    component.rfcEmpresa.trim = jest.fn();
    component.numeroPrograma = component.numeroPrograma || {};
    component.numeroPrograma.trim = jest.fn();
    component.tiempoPrograma = component.tiempoPrograma || {};
    component.tiempoPrograma.trim = jest.fn();
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.actualizarEstado = jest.fn();
    component.actualizaGridEmpresasNacionales();
    });

  it('should run #seleccionarEmpresas()', async () => {
    component.cambioModalidadStore = component.cambioModalidadStore || {};
    component.cambioModalidadStore.setEmpresasSeleccionados = jest.fn();
    component.seleccionarEmpresas({});
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    });

  it('should run #doAgregarDos() when no service is selected', async () => {
    // Setup
    component.domiciliosSeleccionados = [];
    component.autorizadosSeleccionados = [];
    component.nuevaNotificacion = {};
    component.rowNotSeleccionada = false;

    // Act
    component.doAgregarDos();

    // Assert
    expect(component.rowNotSeleccionada).toBe(true);
    expect(component.nuevaNotificacion).toEqual({
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'modal',
      titulo: '',
      mensaje: 'Debe seleccionar un Servicio.',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    });
  });

  it('should run #doAgregarDos() when service is selected', async () => {
    // Setup
    component.domiciliosSeleccionados = [{ idServicio: '123' }];
    component.autorizadosSeleccionados = [];
    component.actualizaGridEmpresasNacionales = jest.fn();

    // Act
    component.doAgregarDos();

    // Assert
    expect(component.actualizaGridEmpresasNacionales).toHaveBeenCalled();
  });

  it('should run #doAgregarDos() when authorized service is selected', async () => {
    // Setup
    component.domiciliosSeleccionados = [];
    component.autorizadosSeleccionados = [{ idServicio: '456' }];
    component.actualizaGridEmpresasNacionales = jest.fn();

    // Act
    component.doAgregarDos();

    // Assert
    expect(component.actualizaGridEmpresasNacionales).toHaveBeenCalled();
  });

  it('should run #doAgregarDos() when both services are selected', async () => {
    // Setup
    component.domiciliosSeleccionados = [{ idServicio: '123' }];
    component.autorizadosSeleccionados = [{ idServicio: '456' }];
    component.actualizaGridEmpresasNacionales = jest.fn();

    // Act
    component.doAgregarDos();

    // Assert
    expect(component.actualizaGridEmpresasNacionales).toHaveBeenCalled();
  });

});