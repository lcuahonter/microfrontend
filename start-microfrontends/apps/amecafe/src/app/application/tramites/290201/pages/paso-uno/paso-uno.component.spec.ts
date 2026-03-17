
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Solicitud290201Store } from '../../../../estados/tramites/tramites290201.store';
import { Solicitud290201Query } from '../../../../estados/queries/tramites290201.query';
import { RegistrarSolicitudService } from '../../services/registrar-solicitud.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockSolicitud290201Store {}

@Injectable()
class MockSolicitud290201Query {}

@Injectable()
class MockRegistrarSolicitudService {}


describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; registrarsolicitud: { getConsultaData?: any; actualizarEstadoFormulario?: any; }; seleccionaTab: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasoUnoComponent], // Declare the component here

      imports: [ FormsModule, ReactiveFormsModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Solicitud290201Store, useClass: MockSolicitud290201Store },
        { provide: Solicitud290201Query, useClass: MockSolicitud290201Query },
        { provide: RegistrarSolicitudService, useClass: MockRegistrarSolicitudService },
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
    component.registrarsolicitud = component.registrarsolicitud || {};
    component.registrarsolicitud.getConsultaData = jest.fn().mockReturnValue(observableOf({}));
    component.registrarsolicitud.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
     expect(component.registrarsolicitud.getConsultaData).toHaveBeenCalled();
     expect(component.registrarsolicitud.actualizarEstadoFormulario).toHaveBeenCalled();
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