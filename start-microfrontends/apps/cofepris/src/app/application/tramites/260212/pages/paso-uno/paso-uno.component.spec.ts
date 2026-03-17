// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe,
  PipeTransform,
  Injectable,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Directive,
  Input,
  Output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260212Query } from '../../estados/tramite260212Query.query';
import { Tramite260214Store } from '../../estados/tramite260212Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite260212Query {}

@Injectable()
class MockTramite260214Store {}

@Injectable()
class MockHttpClient {
  post() {}
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        PasoUnoComponent,
        HttpClientTestingModule,
      ],
      declarations: [
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite260212Query, useClass: MockTramite260212Query },
        { provide: Tramite260214Store, useClass: MockTramite260214Store },
        ConsultaioQuery,
        { provide: HttpClient, useClass: MockHttpClient },
      ],
    })
      .overrideComponent(PasoUnoComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.consultaState = {
      procedureId: '260212',
      update: true,
    };
    component.guardarDatosFormulario = jest.fn();
    component.Tramite260212Query = component.Tramite260212Query || {};
    component.Tramite260212Query.getTabSeleccionado$ = observableOf({});
    component.ngOnInit();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.getRegistroTomaMuestrasMercanciasData = jest
      .fn()
      .mockReturnValue(observableOf({}));
    component.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    expect(component.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(component.actualizarEstadoFormulario).toHaveBeenCalled();
  });

  it('should run #actualizarEstadoFormulario()', async () => {
    component.tramite260214Store = component.tramite260214Store || {};
    component.tramite260214Store.update = jest.fn().mockReturnValue([null]);
    component.actualizarEstadoFormulario({});
    expect(component.tramite260214Store.update).toHaveBeenCalled();
  });

  it('should run #getRegistroTomaMuestrasMercanciasData()', async () => {
    component.http = component.http || {};
    component.http.get = jest.fn();
    component.getRegistroTomaMuestrasMercanciasData();
    expect(component.http.get).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite260214Store = component.tramite260214Store || {};
    component.tramite260214Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    expect(
      component.tramite260214Store.updateTabSeleccionado
    ).toHaveBeenCalled();
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
