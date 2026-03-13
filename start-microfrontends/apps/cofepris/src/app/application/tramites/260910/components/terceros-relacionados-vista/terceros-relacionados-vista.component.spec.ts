// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { Tramite260910Store } from '../../estados/tramite260910Store.store';
import { Tramite260910Query } from '../../estados/tramite260910Query.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite260910Store { }

@Injectable()
class MockTramite260910Query { }

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ readonly: false });
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('TercerosRelacionadosVistaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, TercerosRelacionadosVistaComponent, HttpClientTestingModule],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite260910Store, useClass: MockTramite260910Store },
        { provide: Tramite260910Query, useClass: MockTramite260910Query },
        { provide: ConsultaioQuery, useClass: MockConsultaioQuery },
        {
          provide: ActivatedRoute,
          useValue: {
            params: observableOf({}),
            queryParams: observableOf({}),
            snapshot: { params: {}, queryParams: {} }
          }
        }
      ]
    }).overrideComponent(TercerosRelacionadosVistaComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getFabricanteTablaDatos$ = observableOf({});
    component.tramiteQuery.getDestinatarioFinalTablaDatos$ = observableOf({});
    component.tramiteQuery.getProveedorTablaDatos$ = observableOf({});
    component.tramiteQuery.getFacturadorTablaDatos$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #addFabricantes()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateFabricanteTablaDatos = jest.fn();
    component.addFabricantes({});
    expect(component.tramiteStore.updateFabricanteTablaDatos).toHaveBeenCalled();
  });

  it('should run #addDestinatarios()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDestinatarioFinalTablaDatos = jest.fn();
    component.addDestinatarios({});
    expect(component.tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
  });

  it('should run #addProveedores()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateProveedorTablaDatos = jest.fn();
    component.addProveedores({});
    expect(component.tramiteStore.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run #addFacturadores()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateFacturadorTablaDatos = jest.fn();
    component.addFacturadores({});
    expect(component.tramiteStore.updateFacturadorTablaDatos).toHaveBeenCalled();
  });

});