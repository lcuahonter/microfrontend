// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosComplimentariaComponent } from './datos-complimentaria.component';
import { SolicitudService } from '../../service/solicitud.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
class MockSolicitudService {
  obtenerBuscarSocioAccionista = jest.fn().mockReturnValue(observableOf({}));
  obtenerBuscarNotarios = jest.fn().mockReturnValue(observableOf({}));
  obtenerOperacionImmex = jest.fn().mockReturnValue(observableOf({}));
  obtenerPlanta = jest.fn().mockReturnValue(observableOf([]));
  obtenerServicios = jest.fn().mockReturnValue(observableOf([]));
  obtenerDatosCertificacionSat = jest.fn().mockReturnValue(observableOf({}));
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

@Injectable()
class MockToastrService {
  error = jest.fn();
  success = jest.fn();
  info = jest.fn();
  warning = jest.fn();
}

describe('DatosComplimentariaComponent', () => {
  let fixture;
  let component;
  let toastrService: jest.Mocked<ToastrService>;

  beforeEach(() => {
    toastrService = {
      error: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    TestBed.configureTestingModule({
      imports: [DatosComplimentariaComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SolicitudService, useClass: MockSolicitudService },
        ToastrService
      ]
    }).overrideComponent(DatosComplimentariaComponent, {

      set: { providers: [{ provide: SolicitudService, useClass: MockSolicitudService },
{ provide: ToastrService, useClass: MockToastrService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(DatosComplimentariaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #obtenerComplimentaria() and set datos + store', async () => {
    const mockResponse = { datos: [{ nombre: 'juan' }] };
    component.solicitudService.obtenerBuscarSocioAccionista = jest.fn().mockReturnValue(observableOf(mockResponse));
    const storeSpy = jest.spyOn(component.tramite80302Store, 'setDatosComplimentaria');

    component.obtenerComplimentaria();

    expect(component.solicitudService.obtenerBuscarSocioAccionista).toHaveBeenCalled();
    expect(component.datosComplimentaria.length).toBeGreaterThan(0);
    expect(storeSpy).toHaveBeenCalledWith(component.datosComplimentaria);
  });


  it('should run #obtenerFederetarios() and set datos + store', async () => {
    const mockResponse = { datos: [{ nombre: 'notario' }] };
  component.solicitudService.obtenerBuscarNotarios = jest.fn().mockReturnValue(observableOf(mockResponse));
    const storeSpy = jest.spyOn(component.tramite80302Store, 'setDatosFederatarios');

    component.obtenerFederetarios();

    expect(component.solicitudService.obtenerBuscarNotarios).toHaveBeenCalled();
    expect(component.datosFederetarios.length).toBeGreaterThan(0);
    expect(storeSpy).toHaveBeenCalledWith(component.datosFederetarios);
  });

it('should run #obtenerOperacions() and set datos + store', async () => {
  const mockResponse = { datos: [{ operacion: 'op' }] };
  component.solicitudService.obtenerOperacionImmex = jest.fn().mockReturnValue(observableOf(mockResponse));
  const storeSpy = jest.spyOn(component.tramite80302Store, 'setDatosOperacions');

  component.obtenerOperacions();

  expect(component.solicitudService.obtenerOperacionImmex).toHaveBeenCalled();
  expect(component.datosOperacions.length).toBeGreaterThan(0);
  expect(storeSpy).toHaveBeenCalledWith(component.datosOperacions);
});

it('should set datosPlanta on obtenerPlanta() success', async () => {
  const plantas = [{ id: 1 }];
  component.solicitudService.obtenerPlanta = jest.fn().mockReturnValue(observableOf(plantas));

  component.obtenerPlanta();

  expect(component.solicitudService.obtenerPlanta).toHaveBeenCalled();
  expect(component.datosPlanta).toEqual(plantas);
});

it('should set datosServicios on obtenerServicios() success', async () => {
  const servicios = [{ id: 2 }];
  component.solicitudService.obtenerServicios = jest.fn().mockReturnValue(observableOf(servicios));

  component.obtenerServicios();

  expect(component.solicitudService.obtenerServicios).toHaveBeenCalled();
  expect(component.datosServicios).toEqual(servicios);
});

it('should show toastr error on obtenerComplimentaria() failure', async () => {
  const errorResponse = throwError(() => new Error('Error en obtenerComplimentaria'));

  component.solicitudService.obtenerBuscarSocioAccionista = jest.fn().mockReturnValue(errorResponse);
  component.toastr.error = jest.fn();

  component.obtenerComplimentaria();

  expect(component.solicitudService.obtenerBuscarSocioAccionista).toHaveBeenCalled();
  expect(component.toastr.error).toHaveBeenCalled();
});

it('should show toastr error on obtenerFederetarios() failure', async () => {
  const errorResponse = throwError(() => new Error('Error en obtenerFederetarios'));

  component.solicitudService.obtenerBuscarNotarios = jest.fn().mockReturnValue(errorResponse);
  component.toastr.error = jest.fn();

  component.obtenerFederetarios();

  expect(component.solicitudService.obtenerBuscarNotarios).toHaveBeenCalled();
  expect(component.toastr.error).toHaveBeenCalled();
});

it('should show toastr error on obtenerOperacions() failure', async () => {
  const errorResponse = throwError(() => new Error('Error en obtenerOperacions'));

  component.solicitudService.obtenerOperacionImmex = jest.fn().mockReturnValue(errorResponse);
  component.toastr.error = jest.fn();

  component.obtenerOperacions();

  expect(component.solicitudService.obtenerOperacionImmex).toHaveBeenCalled();
  expect(component.toastr.error).toHaveBeenCalled();
});

});