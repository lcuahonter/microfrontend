// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ModificacionComponent } from './modificacion.component';
import { FormBuilder } from '@angular/forms';
import { ModificacionProgramaImmexBajaSubmanufactureraService } from '../../services/modificacion-programa-immex-baja-submanufacturera.service';
import { Tramite80303Query } from '../../estados/tramite80303Query.query';

@Injectable()
class MockModificacionProgramaImmexBajaSubmanufactureraService {
  obtenerModificacionFormDatos = jest.fn().mockReturnValue(observableOf({}));
  obtenerRespuestaPorUrl = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockTramite80303Query {
  selectTramiteState$ = observableOf({ submanufacturerasTablaDatos: [] });
}

describe('ModificacionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ModificacionComponent, FormsModule, ReactiveFormsModule ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ModificacionProgramaImmexBajaSubmanufactureraService, useClass: MockModificacionProgramaImmexBajaSubmanufactureraService },
        { provide: Tramite80303Query, useClass: MockTramite80303Query }
      ]
    }).overrideComponent(ModificacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ModificacionComponent);
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
    const obtenerModificacionFormDatosSpy = jest.spyOn(component, 'obtenerModificacionFormDatos');
        
    component.modificacionProgramaImmexBajaSubmanufactureraService = component.modificacionProgramaImmexBajaSubmanufactureraService || {};
    component.modificacionProgramaImmexBajaSubmanufactureraService.obtenerRespuestaPorUrl = jest.fn();
    component.modificacionProgramaImmexBajaSubmanufactureraService.obtenerModificacionFormDatos = jest.fn().mockReturnValue(observableOf({}));
    
    component.tramite80303Querry = component.tramite80303Querry || {};
    component.tramite80303Querry.selectTramiteState$ = observableOf({
      submanufacturerasTablaDatos: []
    });
    
    component.ngOnInit();
    
    expect(obtenerModificacionFormDatosSpy).toHaveBeenCalled();
    expect(component.modificacionProgramaImmexBajaSubmanufactureraService.obtenerRespuestaPorUrl).toHaveBeenCalled();
  });

  it('should run #obtenerModificacionFormDatos()', async () => {
    component.modificacionProgramaImmexBajaSubmanufactureraService = component.modificacionProgramaImmexBajaSubmanufactureraService || {};
    component.modificacionProgramaImmexBajaSubmanufactureraService.obtenerModificacionFormDatos = jest.fn().mockReturnValue(observableOf({}));
    
    component.obtenerModificacionFormDatos();
    
    expect(component.modificacionProgramaImmexBajaSubmanufactureraService.obtenerModificacionFormDatos).toHaveBeenCalled();
  });

  it('should run #alternarValorSubmanufactureras() and toggle status from "Baja" to "Activada"', () => {
    const mockRow = { rfc: 'TEST123', desEstatus: 'Baja' };
    component.submanufacturerasTablaDatos = [{ rfc: 'TEST123', desEstatus: 'Baja' }];
    component.cd = { detectChanges: jest.fn() } as any;

    component.alternarValorSubmanufactureras({ row: mockRow, column: 'desEstatus' });

    expect(component.submanufacturerasTablaDatos[0].desEstatus).toBe('Activada');
    expect(component.cd.detectChanges).toHaveBeenCalled();
  });

  it('should run #alternarValorSubmanufactureras() and toggle status from "Activada" to "Baja"', () => {
    const mockRow = { rfc: 'TEST123', desEstatus: 'Activada' };
    component.submanufacturerasTablaDatos = [{ rfc: 'TEST123', desEstatus: 'Activada' }];
    component.cd = { detectChanges: jest.fn() } as any;

    component.alternarValorSubmanufactureras({ row: mockRow, column: 'desEstatus' });

    expect(component.submanufacturerasTablaDatos[0].desEstatus).toBe('Baja');
    expect(component.cd.detectChanges).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

});