// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260217Query } from '../../estados/tramite260217Query.query';
import { Tramite260217Store } from '../../estados/tramite260217Store.store';
import { HttpClientModule } from '@angular/common/http';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockTramite260217Query {
  getTabSeleccionado$ = observableOf(1);
}

@Injectable()
class MockTramite260217Store {
  updateTabSeleccionado = jest.fn();
  update = jest.fn();
}

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({
    procedureId: '260217',
    update: true
  });
}


describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260217Query, useClass: MockTramite260217Query },
        { provide: Tramite260217Store, useClass: MockTramite260217Store },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite260217Query = component.tramite260217Query || {};
    component.tramite260217Query.getTabSeleccionado$ = observableOf({});
    component.ngOnInit();
  });

  it('should run #ngOnInit() with consultaState having procedureId 260217 and update true', async () => {
    component.consultaState = {
      procedureId: '260217',
      update: true
    };
    component.guardarDatosFormulario = jest.fn();
    component.tramite260217Query = component.tramite260217Query || {};
    component.tramite260217Query.getTabSeleccionado$ = observableOf(2);
    
    component.ngOnInit();
    
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(false);
  });

  it('should run #ngOnInit() without consultaState update', async () => {
    component.consultaState = {
      procedureId: '260217',
      update: false
    };
    component.tramite260217Query = component.tramite260217Query || {};
    component.tramite260217Query.getTabSeleccionado$ = observableOf(3);
    
    component.ngOnInit();
    
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should run #guardarDatosFormulario()', async () => {
    const mockData = { 
      tipoSolicitud: 'test',
      numeroSolicitud: '123'
    };
    component.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf(mockData));
    component.actualizarEstadoFormulario = jest.fn();
    
    component.guardarDatosFormulario();
    
    expect(component.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
    expect(component.actualizarEstadoFormulario).toHaveBeenCalledWith(mockData);
  });

  it('should run #guardarDatosFormulario() with null response', async () => {
    component.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf(null));
    component.actualizarEstadoFormulario = jest.fn();
    
    component.guardarDatosFormulario();
    
    expect(component.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    const mockData = { 
      tipoSolicitud: 'test',
      numeroSolicitud: '123'
    };
    component.tramite260217Store = component.tramite260217Store || {};
    component.tramite260217Store.update = jest.fn();
    
    component.actualizarEstadoFormulario(mockData);
    
    expect(component.tramite260217Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    const mockHttpResponse = { 
      tipoSolicitud: 'test',
      numeroSolicitud: '123'
    };
    component.http = component.http || {};
    component.http.get = jest.fn().mockReturnValue(observableOf(mockHttpResponse));
    
    const result = component.getRegistroTomaMuestrasMercanciasData();
    
    expect(component.http.get).toHaveBeenCalledWith('assets/json/260217/respuestaDeActualizacionDe.json');
    result.subscribe(data => {
      expect(data).toEqual(mockHttpResponse);
    });
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite260217Store = component.tramite260217Store || {};
    component.tramite260217Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    expect(component.tramite260217Store.updateTabSeleccionado).toHaveBeenCalled();
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