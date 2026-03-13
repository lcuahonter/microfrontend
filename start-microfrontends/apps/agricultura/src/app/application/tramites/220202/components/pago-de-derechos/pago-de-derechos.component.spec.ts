// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component, ChangeDetectorRef } from '@angular/core';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';

@Injectable()
class MockAgriculturaApiService {
  updatePagoDeDerechos = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockFitosanitarioQuery {
  seleccionarPagoDerechos$ = observableOf({});
}

@Injectable()
class MockHttpClient {
  post = jest.fn().mockReturnValue(observableOf({}));
  get = jest.fn().mockReturnValue(observableOf({
    data: {}
  }));
}

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

describe('PagoDeDerechosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, PagoDeDerechosComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AgriculturaApiService, useClass: MockAgriculturaApiService },
        { provide: FitosanitarioQuery, useClass: MockFitosanitarioQuery },
        ConsultaioQuery,
        ChangeDetectorRef,
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    }).overrideComponent(PagoDeDerechosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fitosanitarioQuery = component.fitosanitarioQuery || {};
    component.fitosanitarioQuery.seleccionarPagoDerechos$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #obtenerBancoSelectorList()', async () => {
    component.httpServicios = component.httpServicios || {};
    component.httpServicios.get = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.pagoSelect = component.pagoSelect || {};
    component.pagoSelect.bancoSelector = 'bancoSelector';
    component.obtenerBancoSelectorList();
    expect(component.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #obtenerListaDeJustificaciones()', async () => {
    component.httpServicios = component.httpServicios || {};
    component.httpServicios.get = jest.fn().mockReturnValue(observableOf({
      data: {}
    }));
    component.pagoSelect = component.pagoSelect || {};
    component.pagoSelect.justificacionSelector = 'justificacionSelector';
    component.obtenerListaDeJustificaciones();
    expect(component.httpServicios.get).toHaveBeenCalled();
  });

  it('should run #onPagoChanged()', async () => {
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.updatePagoDeDerechos = jest.fn();
    component.onPagoChanged({});
    expect(component.agriculturaApiService.updatePagoDeDerechos).toHaveBeenCalled();
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