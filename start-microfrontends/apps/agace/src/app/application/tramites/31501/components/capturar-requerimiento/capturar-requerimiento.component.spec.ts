// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { CapturarRequerimientoComponent } from './capturar-requerimiento.component';
import { AutoridadService } from '../../services/autoridad.service';
import { FormBuilder } from '@angular/forms';
import { Tramite31501Store } from '../../../../estados/tramites/tramite31501.store';
import { Tramite31501Query } from '../../../../estados/queries/tramite31501.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockAutoridadService {}

@Injectable()
class MockTramite31501Store {}

@Injectable()
class MockTramite31501Query {}

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

describe('CapturarRequerimientoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CapturarRequerimientoComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AutoridadService, useClass: MockAutoridadService },
        FormBuilder,
        { provide: Tramite31501Store, useClass: MockTramite31501Store },
        { provide: Tramite31501Query, useClass: MockTramite31501Query },
        ConsultaioQuery
      ]
    }).overrideComponent(CapturarRequerimientoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(CapturarRequerimientoComponent);
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
    component.tramite31501Query = component.tramite31501Query || {};
    component.tramite31501Query.selectSolicitud$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.inicializarEstadoFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.fetchAduanaList = jest.fn();
    component.ngOnInit();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.fetchAduanaList).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.solicitud31501State = component.solicitud31501State || {};
    component.solicitud31501State.motivoCancelacion = 'motivoCancelacion';
    component.solicitud31501State.tipoDeRequerimiento = 'tipoDeRequerimiento';
    component.inicializarEstadoFormulario = jest.fn();
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
  });

  it('should disable the form when soloLectura is true', () => {
    component.soloLectura = true;

    component.capturarRequirementoForm = {
      disable: jest.fn(),
      enable: jest.fn(),
    } as any;

    component.inicializarEstadoFormulario();

    expect(component.capturarRequirementoForm.disable).toHaveBeenCalled();
    expect(component.capturarRequirementoForm.enable).not.toHaveBeenCalled();
  });

  it('should run #fetchAduanaList()', async () => {
    component.autoridadService = component.autoridadService || {};
    component.autoridadService.getTramiteList = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.tramiteList = component.tramiteList || {};
    component.tramiteList.catalogos = 'catalogos';
    component.fetchAduanaList();
    expect(component.autoridadService.getTramiteList).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', () => {
    const mockFn = jest.fn();
    const campo = 'testCampo';

    component.tramite31501Store = {
      setValor: mockFn, // clave real que existe en el store
    } as any;

    const mockForm = {
      get: (field: string) => ({
        value: 'valorEsperado',
      }),
    } as unknown as FormGroup;

    component.setValoresStore(mockForm, campo, 'setValor');
    expect(mockFn).toHaveBeenCalledWith('valorEsperado');
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