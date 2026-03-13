
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Solicitud230101Store } from '../../estados/tramites/tramites230101.store';
import { Solicitud230101Query } from '../../estados/queries/tramites230101.query';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockSolicitud230101Store {}

@Injectable()
class MockSolicitud230101Query {}

@Injectable()
class MockMediodetransporteService {}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; mediodetransporteService: { getConsultaData?: any; actualizarEstadoFormulario?: any; }; seleccionaTab: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Solicitud230101Store, useClass: MockSolicitud230101Store },
        { provide: Solicitud230101Query, useClass: MockSolicitud230101Query },
        { provide: MediodetransporteService, useClass: MockMediodetransporteService },
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

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = {
      selectConsultaioState$: observableOf({ update: true }) 
    };
  
   
    component.guardarDatosFormulario = jest.fn();
  
    component.ngOnInit();
  
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });
  it('should run #guardarDatosFormulario()', async () => {
    component.mediodetransporteService = component.mediodetransporteService || {};
    component.mediodetransporteService.getConsultaData = jest.fn().mockReturnValue(observableOf({}));
    component.mediodetransporteService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
     expect(component.mediodetransporteService.getConsultaData).toHaveBeenCalled();
     expect(component.mediodetransporteService.actualizarEstadoFormulario).toHaveBeenCalled();
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