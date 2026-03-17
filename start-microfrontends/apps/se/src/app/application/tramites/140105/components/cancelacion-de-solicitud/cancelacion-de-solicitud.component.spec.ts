// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CancelacionDeSolicitudComponent } from './cancelacion-de-solicitud.component';
import { FormBuilder } from '@angular/forms';
import { ServicioDeMensajesService } from '../../services/servicio-de-mensajes.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DesistimientoQuery } from '../../estados/desistimiento-de-permiso.query';
import { ToastrService, provideToastr } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';

@Injectable()
class MockServicioDeMensajesService {
    establecerDatosDePermiso = function(test:boolean) : void {};
    datos$ = observableOf({});
    actualizarDatosForma = jest.fn();
    obtenerDatos = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    actualizarEstadoFormulario = jest.fn();
}

@Injectable()
class MockDesistimientoQuery {
    selectMotivoCancelacion$ = observableOf('');
    selectTramite$ = observableOf({
      rfc: 'TEST123',
      claveEntidadFederativa: '09',
      idTipoTramite: 140105
    });
}

@Injectable()
class MockConsultaioQuery {
    selectConsultaioState$ = observableOf({ readonly: false });
}

describe('CancelacionDeSolicitudComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,HttpClientTestingModule,TablaDinamicaComponent ],
      declarations: [
        CancelacionDeSolicitudComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
      ToastrService,provideToastr({
                      positionClass: 'toast-top-right',
                    }),
        FormBuilder,
        { provide: ServicioDeMensajesService, useClass: MockServicioDeMensajesService },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        { provide: DesistimientoQuery, useClass: MockDesistimientoQuery }
      ]
    }).overrideComponent(CancelacionDeSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CancelacionDeSolicitudComponent);
    component = fixture.debugElement.componentInstance;
    
    component.cuerpoTablaCancelacion = [];
    component.cuerpoTablaSeleccionado = [];
    component.esEliminarDos = false;
    component.esRowSelected = false;
    component.nuevaNotificacionUno = {} as any;
    component.destroyNotificationSubject$ = {
      next: jest.fn(),
      complete: jest.fn()
    };
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    
    // Mock datosDePermiso to avoid formData reference issues
    component.datosDePermiso = true;
    
    // Initialize destroyNotificationSubject$ properly
    component.destroyNotificationSubject$ = {
      next: jest.fn(),
      complete: jest.fn()
    };
    
    component.ngOnInit();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.servicioDeMensajesService = component.servicioDeMensajesService || {};
    component.servicioDeMensajesService.establecerDatosDePermiso = jest.fn();
    component.destroyNotificationSubject$ = component.destroyNotificationSubject$ || {};
    component.destroyNotificationSubject$.next = jest.fn();
    component.destroyNotificationSubject$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.servicioDeMensajesService.establecerDatosDePermiso).toHaveBeenCalled();
    // expect(component.destroyNotificationSubject$.next).toHaveBeenCalled();
    // expect(component.destroyNotificationSubject$.complete).toHaveBeenCalled();
  });

it('should run #busqueda() and call enviarMensaje with true', () => {
  component.servicioDeMensajesService = component.servicioDeMensajesService || {};
  component.servicioDeMensajesService.enviarMensaje = jest.fn();
  const event = {} as Event;
  component.busqueda(event);
  expect(component.servicioDeMensajesService.enviarMensaje).toHaveBeenCalledWith(true);
});

it('should run #eliminarRegistro() and clear cuerpoTablaCancelacion and call actualizarDatosForma', () => {
  component.cuerpoTablaCancelacion = [{ folioTramite: '123' }] as any;
  component.cuerpoTablaSeleccionado = [{ folioTramite: '123' }] as any;
  component.servicioDeMensajesService = component.servicioDeMensajesService || {};
  component.servicioDeMensajesService.actualizarDatosForma = jest.fn();

  const event = {} as Event;
  component.eliminarRegistro(event);

  expect(component.esEliminarDos).toBe(true);
  expect(component.nuevaNotificacionUno.mensaje).toBe('¿Esta seguro que desea eliminar el registro marcado?');

  component.cerrarEliminarDos(true);

  expect(component.cuerpoTablaCancelacion).toEqual([]);
  expect(component.servicioDeMensajesService.actualizarDatosForma).toHaveBeenCalledWith([]);
});

it('should run #eliminarRegistro() and show alert when no rows selected', () => {
  component.cuerpoTablaCancelacion = [{ folioTramite: '123' }] as any;
  component.cuerpoTablaSeleccionado = [];
  
  const event = {} as Event;
  component.eliminarRegistro(event);
  
  expect(component.esRowSelected).toBe(true);
  expect(component.nuevaNotificacionUno.mensaje).toBe('Seleccione un registro a eliminar.');
  
  expect(component.cuerpoTablaCancelacion).toEqual([{ folioTramite: '123' }]);
});
  
});