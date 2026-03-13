
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Solicitud261601Store } from '../../estados/tramites261601.store';
import { Solicitud261601Query } from '../../estados/tramites261601.query';
import { CorreccionInternaDeLaCofeprisService } from '../../services/correccion-interna-de-la-cofepris.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockSolicitud261601Store {}

@Injectable()
class MockSolicitud261601Query {}

@Injectable()
class MockCorreccionInternaDeLaCofeprisService {}


describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; solicitante: { obtenerTipoPersona?: any; }; ngAfterViewInit: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; correccionService: { getConsultaData?: any; actualizarEstadoFormulario?: any; }; seleccionaTab: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Solicitud261601Store, useClass: MockSolicitud261601Store },
        { provide: Solicitud261601Query, useClass: MockSolicitud261601Query },
        { provide: CorreccionInternaDeLaCofeprisService, useClass: MockCorreccionInternaDeLaCofeprisService },
        ConsultaioQuery
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.ngAfterViewInit();
     expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalled();
  });
  it('should run #ngOnInit()', async () => {
    component.consultaQuery = {
      selectConsultaioState$: observableOf({
        update: true, 
      }),
    };
  
    component.guardarDatosFormulario = jest.fn();
  
    component.ngOnInit();
  
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.correccionService = component.correccionService || {};
    component.correccionService.getConsultaData = jest.fn().mockReturnValue(observableOf({}));
    component.correccionService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
     expect(component.correccionService.getConsultaData).toHaveBeenCalled();
     expect(component.correccionService.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

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