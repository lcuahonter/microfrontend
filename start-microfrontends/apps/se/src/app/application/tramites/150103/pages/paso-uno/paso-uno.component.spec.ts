
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Solicitud150103Store } from '../../estados/solicitud150103.store';
import { Solicitud150103Query } from '../../estados/solicitud150103.query';
import { InformeAnualProgramaService } from '../../services/informe-anual-programa.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockSolicitud150103Store {}

@Injectable()
class MockSolicitud150103Query {}

@Injectable()
class MockInformeAnualProgramaService {}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; solicitante: { obtenerTipoPersona?: any; }; ngAfterViewInit: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; informaAnualPrograma: { getRegistroData?: any; actualizarEstadoFormulario?: any; }; seleccionaTab: (arg0: {}) => void; getFilaDeInformeSeleccionada: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
        
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Solicitud150103Store, useClass: MockSolicitud150103Store },
        { provide: Solicitud150103Query, useClass: MockSolicitud150103Query },
        { provide: InformeAnualProgramaService, useClass: MockInformeAnualProgramaService },
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
      selectConsultaioState$: observableOf({ update: true })
    };
  
    component.guardarDatosFormulario = jest.fn();
  
    component.ngOnInit();
  
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.informaAnualPrograma = component.informaAnualPrograma || {};
    component.informaAnualPrograma.getRegistroData = jest.fn().mockReturnValue(observableOf({}));
    component.informaAnualPrograma.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
     expect(component.informaAnualPrograma.getRegistroData).toHaveBeenCalled();
     expect(component.informaAnualPrograma.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #getFilaDeInformeSeleccionada()', async () => {

    component.getFilaDeInformeSeleccionada({});

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