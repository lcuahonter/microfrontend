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
}

@Injectable()
class MockDesistimientoQuery {}

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
        ConsultaioQuery,
        { provide: DesistimientoQuery, useClass: MockDesistimientoQuery }
      ]
    }).overrideComponent(CancelacionDeSolicitudComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CancelacionDeSolicitudComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    component.servicioDeMensajesService = component.servicioDeMensajesService || {};
    component.servicioDeMensajesService.datos$ = observableOf({});
    component.servicioDeMensajesService.actualizarDatosForma = jest.fn();
    component.servicioDeMensajesService.obtenerDatos = jest.fn().mockReturnValue(observableOf({
      datos: {}
    }));
    component.desistimientoQuery = component.desistimientoQuery || {};
    component.desistimientoQuery.selectMotivoCancelacion$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();
    // expect(component.fb.group).toHaveBeenCalled();
    // expect(component.servicioDeMensajesService.actualizarDatosForma).toHaveBeenCalled();
    // expect(component.servicioDeMensajesService.obtenerDatos).toHaveBeenCalled();
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
  component.servicioDeMensajesService = component.servicioDeMensajesService || {};
  component.servicioDeMensajesService.actualizarDatosForma = jest.fn();
  const event = {} as Event;
  component.eliminarRegistro(event);
  expect(component.cuerpoTablaCancelacion).toEqual([]);
  expect(component.servicioDeMensajesService.actualizarDatosForma).toHaveBeenCalledWith([]);
});
  
});