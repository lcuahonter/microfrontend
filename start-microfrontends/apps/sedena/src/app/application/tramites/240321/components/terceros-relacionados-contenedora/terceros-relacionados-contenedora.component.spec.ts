// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { ModificacionService } from '../../services/modificacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240321Store {}

@Injectable()
class MockTramite240321Query {}

@Injectable()
class MockModificacionService {}

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

@Injectable()
class MockRouter {
  navigate() {};
}

describe('TercerosRelacionadosContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240321Store, useClass: MockTramite240321Store },
        { provide: Tramite240321Query, useClass: MockTramite240321Query },
        { provide: ModificacionService, useClass: MockModificacionService },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {url: 'url', params: {}, queryParams: {}, data: {}},
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        }
      ]
    }).overrideComponent(TercerosRelacionadosContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
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
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getDestinatarioFinalTablaDatos$ = observableOf({});
    component.tramiteQuery.getProveedorTablaDatos$ = observableOf({});
    component.getDestinatariosFinales = jest.fn();
    component.getProveedores = jest.fn();
    component.ngOnInit();
    expect(component.getDestinatariosFinales).toHaveBeenCalled();
    expect(component.getProveedores).toHaveBeenCalled();
  });

  it('should run #getDestinatariosFinales()', async () => {
    component.modificacionService = component.modificacionService || {};
    component.modificacionService.getDestinatariosFinales = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.destinatarioFinalTablaDatos = component.destinatarioFinalTablaDatos || {};
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDestinatarioFinalTablaDatos = jest.fn();
    component.getDestinatariosFinales();
    expect(component.modificacionService.getDestinatariosFinales).toHaveBeenCalled();
   expect(component.tramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
  });

  it('should run #getProveedores()', async () => {
    component.modificacionService = component.modificacionService || {};
    component.modificacionService.getProveedores = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.proveedorTablaDatos = component.proveedorTablaDatos || {};
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateProveedorTablaDatos = jest.fn();
    component.getProveedores();
    expect(component.modificacionService.getProveedores).toHaveBeenCalled();
    expect(component.tramiteStore.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
     expect(component.unsubscribe$.next).toHaveBeenCalled();
     expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

});