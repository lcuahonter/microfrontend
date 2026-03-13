//@ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosComplimentariaComponent } from './datos-complimentaria.component';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
class MockImmerModificacionService {
  obtenerComplimentaria = jest.fn().mockReturnValue(observableOf({}));
  obtenerFederetarios = jest.fn().mockReturnValue(observableOf({}));
  obtenerOperacion = jest.fn().mockReturnValue(observableOf({}));
  obtenerPlanta = jest.fn().mockReturnValue(observableOf({}));
  obtenerServicios = jest.fn().mockReturnValue(observableOf({}));
  obtenerSolicitudId = jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '1' } }));
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
  success = jest.fn();
  error = jest.fn();
  info = jest.fn();
  warning = jest.fn();
}

describe('DatosComplimentariaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatosComplimentariaComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImmerModificacionService, useClass: MockImmerModificacionService },
        ToastrService
      ]
    }).overrideComponent(DatosComplimentariaComponent, {

      set: { providers: [{ provide: ImmerModificacionService, useClass: MockImmerModificacionService },
{ provide: ToastrService, useClass: MockToastrService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(DatosComplimentariaComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should have all table configuration arrays defined', () => {
    expect(component.configuracionTabla).toBeDefined();
    expect(component.configuracionFederetios).toBeDefined();
    expect(component.configuracionOperacion).toBeDefined();
    expect(component.configuracionPlanta).toBeDefined();
    expect(component.configuracionEmpresas).toBeDefined();
    expect(component.configuracionManufacturera).toBeDefined();
    expect(component.configuracionServicios).toBeDefined();
    expect(Array.isArray(component.configuracionTabla)).toBe(true);
    expect(Array.isArray(component.configuracionFederetios)).toBe(true);
    expect(Array.isArray(component.configuracionOperacion)).toBe(true);
    expect(Array.isArray(component.configuracionPlanta)).toBe(true);
    expect(Array.isArray(component.configuracionEmpresas)).toBe(true);
    expect(Array.isArray(component.configuracionManufacturera)).toBe(true);
    expect(Array.isArray(component.configuracionServicios)).toBe(true);
  });

  it('should populate datosComplimentaria and call store in obtenerComplimentaria', () => {
    const complimentariaData = [{ test: 'complimentaria' }];
    component.buscarIdSolicitud = [1];
    component.solicitudService = {
      obtenerBuscarSocioAccionista: jest.fn().mockReturnValue(observableOf({ datos: complimentariaData })),
    } as any;
    (component as any).tramite80306Store = { setDatosComplimentaria: jest.fn() };
    component.toastr = { error: jest.fn() } as any;
    component.obtenerComplimentaria();
    expect(component.datosComplimentaria).toEqual(complimentariaData);
    expect((component as any).tramite80306Store.setDatosComplimentaria).toHaveBeenCalledWith(complimentariaData);
  });

  it('should handle error in obtenerComplimentaria', () => {
    component.buscarIdSolicitud = [1];
    component.solicitudService = {
      obtenerBuscarSocioAccionista: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerComplimentaria();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar los datos de complimentaria');
  });

  it('should populate datosFederetarios and call store in obtenerFederetarios', () => {
    const federetariosData = [{ test: 'federetario' }];
    component.buscarIdSolicitud = [2];
    component.solicitudService = {
      obtenerBuscarNotarios: jest.fn().mockReturnValue(observableOf({ datos: federetariosData })),
    } as any;
    (component as any).tramite80306Store = { setDatosFederetarios: jest.fn() };
    component.toastr = { error: jest.fn() } as any;
    component.obtenerFederetarios();
    expect(component.datosFederetarios).toEqual(federetariosData);
    expect((component as any).tramite80306Store.setDatosFederetarios).toHaveBeenCalledWith(federetariosData);
  });

  it('should handle error in obtenerFederetarios', () => {
    component.buscarIdSolicitud = [2];
    component.solicitudService = {
      obtenerBuscarNotarios: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerFederetarios();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar los federetarios');
  });

  it('should populate datosOperacions and call store in obtenerOperacions', () => {
    const operacionData = [{ test: 'operacion' }];
    component.buscarIdSolicitud = [3];
    component.solicitudService = {
      obtenerOperacionImmex: jest.fn().mockReturnValue(observableOf({ datos: operacionData })),
    } as any;
    (component as any).tramite80306Store = { setDatosOperacions: jest.fn() };
    component.toastr = { error: jest.fn() } as any;
    component.obtenerOperacions();
    expect(component.datosOperacions).toEqual(operacionData);
    expect((component as any).tramite80306Store.setDatosOperacions).toHaveBeenCalledWith(operacionData);
  });

  it('should handle error in obtenerOperacions', () => {
    component.buscarIdSolicitud = [3];
    component.solicitudService = {
      obtenerOperacionImmex: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerOperacions();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar las operaciones');
  });

  it('should be standalone and have correct selector', () => {
    const metadata = (DatosComplimentariaComponent as any).ɵcmp;
    expect(metadata.standalone).toBe(true);
    expect(metadata.selectors[0][0]).toBe('app-datos-complimentaria');
  });

  it('should run #obtenerComplimentaria()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerBuscarSocioAccionista = jest.fn().mockReturnValue(observableOf({}));
    component.toastr = component.toastr || {};
    component.toastr.error = jest.fn();
    component.obtenerComplimentaria();
    //expect(component.solicitudService.obtenerBuscarSocioAccionista).toHaveBeenCalled();
    //expect(component.toastr.error).toHaveBeenCalled();
  });

  it('should run #obtenerFederetarios()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerBuscarNotarios = jest.fn().mockReturnValue(observableOf({}));
    component.toastr = component.toastr || {};
    component.toastr.error = jest.fn();
    component.obtenerFederetarios();
    //expect(component.solicitudService.obtenerBuscarNotarios).toHaveBeenCalled();
    //expect(component.toastr.error).toHaveBeenCalled();
  });

  it('should run #obtenerOperacions()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerOperacionImmex = jest.fn().mockReturnValue(observableOf({}));
    component.toastr = component.toastr || {};
    component.toastr.error = jest.fn();
    component.obtenerOperacions();
    //expect(component.solicitudService.obtenerOperacionImmex).toHaveBeenCalled();
    //expect(component.toastr.error).toHaveBeenCalled();
  });

  // Skipped: No public obtenerPlanta method in component

  it('should show toastr error on obtenerServicios() failure', async () => {
    const errorResponse = throwError(() => new Error('Error en obtenerServicios'));
    component.buscarIdSolicitud = [4];
    component.solicitudService = {
      obtenerServiciosImmex: jest.fn().mockReturnValue(errorResponse)
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerServicios();
    expect(component.solicitudService.obtenerServiciosImmex).toHaveBeenCalled();
    expect(component.toastr.error).toHaveBeenCalled();
  });


  it('should populate datosEmpresas and call store in obtenerEmpresas', () => {
    const empresasData = [{ test: 'empresa' }];
    component.buscarIdSolicitudString = '1';
    component.solicitudService = {
      obtenerSubmanufacturera: jest.fn().mockReturnValue(observableOf({ datos: empresasData })),
    } as any;
    (component as any).tramite80306Store = { setDatosEmpresas: jest.fn() };
    component.toastr = { error: jest.fn() } as any;
    component.obtenerEmpresas();
    expect(component.datosEmpresas).toEqual(empresasData);
    expect((component as any).tramite80306Store.setDatosEmpresas).toHaveBeenCalledWith(empresasData);
  });

  it('should handle error in obtenerEmpresas', () => {
    component.buscarIdSolicitudString = '1';
    component.solicitudService = {
      obtenerSubmanufacturera: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerEmpresas();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar los anexos');
  });

  it('should populate datosManufacturera and call store in obtenerManufacturera', () => {
    const manufactureraData = [{ test: 'manufacturera' }];
    component.buscarIdSolicitudString = '1';
    component.solicitudService = {
      obtenerManufacturera: jest.fn().mockReturnValue(observableOf({ datos: manufactureraData })),
    } as any;
    (component as any).tramite80306Store = { setDatosManufacturera: jest.fn() };
    component.toastr = { error: jest.fn() } as any;
    component.obtenerManufacturera();
    expect(component.datosManufacturera).toEqual(manufactureraData);
    expect((component as any).tramite80306Store.setDatosManufacturera).toHaveBeenCalledWith(manufactureraData);
  });

  it('should handle error in obtenerManufacturera', () => {
    component.buscarIdSolicitudString = '1';
    component.solicitudService = {
      obtenerManufacturera: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerManufacturera();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar los datos de manufacturera');
  });

  it('should populate datosServicios and call store in obtenerServicios', () => {
    const serviciosData = [{ test: 'servicio' }];
    component.buscarIdSolicitud = [5];
    component.solicitudService = {
      obtenerServiciosImmex: jest.fn().mockReturnValue(observableOf({ datos: serviciosData })),
    } as any;
    (component as any).tramite80306Store = { setDatosServicios: jest.fn() };
    component.toastr = { error: jest.fn() } as any;
    component.obtenerServicios();
    expect(component.datosServicios).toEqual(serviciosData);
    expect((component as any).tramite80306Store.setDatosServicios).toHaveBeenCalledWith(serviciosData);
  });

  it('should handle error in obtenerServicios', () => {
    component.buscarIdSolicitud = [5];
    component.solicitudService = {
      obtenerServiciosImmex: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerServicios();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar las operaciones');
  });

  it('should populate certificacionSAT and call store in obtenerCertificacionSAT', () => {
    const certData = { datos: { certificacionSAT: 'SAT123' } };
    component.solicitudService = {
      obtenerDatosCertificacionSat: jest.fn().mockReturnValue(observableOf(certData)),
    } as any;
    (component as any).tramite80306Store = { setCertificacionSAT: jest.fn() };
    component.toastr = { error: jest.fn() } as any;
    component.obtenerCertificacionSAT();
    expect(component.certificacionSAT).toEqual('SAT123');
    expect((component as any).tramite80306Store.setCertificacionSAT).toHaveBeenCalledWith('SAT123');
  });

  it('should handle error in obtenerCertificacionSAT', () => {
    component.solicitudService = {
      obtenerDatosCertificacionSat: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerCertificacionSAT();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al obtener los datos de certificación SAT.');
  });

});