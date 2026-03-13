// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';
import { Tramite240102Query } from '../../estados/tramite240102Query.query';
import { Tramite240102Store } from '../../estados/tramite240102Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite240102Query {}

@Injectable()
class MockTramite240102Store {}

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

describe('DatosDelTramiteContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,DatosDelTramiteContenedoraComponent,HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite240102Query, useClass: MockTramite240102Query },
        { provide: Tramite240102Store, useClass: MockTramite240102Store },
        ConsultaioQuery,
        ChangeDetectorRef,
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
    }).overrideComponent(DatosDelTramiteContenedoraComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getMercanciaTablaDatos$ = observableOf({});
    component.tramiteQuery.getDatosDelTramite$ = observableOf({});
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.cdf = component.cdf || {};
    component.cdf.detectChanges = jest.fn();
    component.ngOnInit();
    expect(component.cdf.detectChanges).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('should run #updateDatosDelTramiteFormulario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDatosDelTramiteFormState = jest.fn();
    component.updateDatosDelTramiteFormulario({});
    expect(component.tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
  });

  it('should run #openModal()', async () => {
    component.modalComponent = component.modalComponent || {};
    component.modalComponent.abrir = jest.fn();
    component.cerrarModal = component.cerrarModal || {};
    component.cerrarModal.bind = jest.fn();
    component.openModal({});
  });

  it('should run #cerrarModal()', async () => {
    component.modalComponent = component.modalComponent || {};
    component.modalComponent.cerrar = jest.fn();
    component.cerrarModal();
  });

  it('should run #eliminarMercanciasDatos()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.eliminarMercancias = jest.fn();
    component.eliminarMercanciasDatos({});
    expect(component.tramiteStore.eliminarMercancias).toHaveBeenCalled();
  });

});