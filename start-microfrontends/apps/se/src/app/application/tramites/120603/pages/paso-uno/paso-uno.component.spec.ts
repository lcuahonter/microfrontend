import {ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Solicitud120603Store } from '../../estados/tramite120603.store';
import { Solicitud120603Query } from '../../estados/tramite120603.query';
import { RegistroComoEmpresaService } from '../../services/registro-como-empresa.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockSolicitud120603Store {}

@Injectable()
class MockSolicitud120603Query {}

@Injectable()
class MockRegistroComoEmpresaService {}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: { ngOnDestroy: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; registroComoEmpresa: { getConsultaData?: any; actualizarEstadoFormulario?: any; }; seleccionaTab: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Solicitud120603Store, useClass: MockSolicitud120603Store },
        { provide: Solicitud120603Query, useClass: MockSolicitud120603Query },
        { provide: RegistroComoEmpresaService, useClass: MockRegistroComoEmpresaService },
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
    component.registroComoEmpresa = component.registroComoEmpresa || {};
    component.registroComoEmpresa.getConsultaData = jest.fn().mockReturnValue(observableOf({}));
    component.registroComoEmpresa.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
     expect(component.registroComoEmpresa.getConsultaData).toHaveBeenCalled();
     expect(component.registroComoEmpresa.actualizarEstadoFormulario).toHaveBeenCalled();
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