import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Component, ChangeDetectorRef } from '@angular/core';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Service260601Service } from '../../services/service260601.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

@Injectable()
class MockService260601Service {}

describe('DatosComponent', () => {
  let fixture: ComponentFixture<DatosComponent>;
  let component: { ngOnDestroy: () => void; consultaQuery: { selectConsultaioState$?: any; }; guardarDatosFormulario: jest.Mock<any, any, any> | (() => void); ngOnInit: () => void; service260601Service: { getRegistroTomaMuestrasMercanciasData?: any; actualizarEstadoFormulario?: any; }; solicitante: { obtenerTipoPersona?: any; }; cdr: { detectChanges?: any; }; ngAfterViewInit: () => void; seleccionaTab: (arg0: {}) => void; destroyNotifier$: { next?: any; complete?: any; }; };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosComponent, HttpClientTestingModule, ToastrModule.forRoot()  ],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ChangeDetectorRef,
        ConsultaioQuery,
        { provide: Service260601Service, useClass: MockService260601Service },
        { provide: 'ToastConfig', useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: observableOf({}), queryParams: observableOf({}) } }
      ]
    }).overrideComponent(DatosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component && typeof component.ngOnDestroy === 'function') {
      component.ngOnDestroy();
    }
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.service260601Service = component.service260601Service || {};
    component.service260601Service.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.service260601Service.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.solicitante = component.solicitante || {};
    component.solicitante.obtenerTipoPersona = jest.fn();
    component.cdr = component.cdr || {};
    component.cdr.detectChanges = jest.fn();
    component.ngAfterViewInit();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
  });

});