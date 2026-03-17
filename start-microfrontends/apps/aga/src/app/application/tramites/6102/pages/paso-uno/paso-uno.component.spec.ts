// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { JuntaTecnicaRegistroService } from '../../service/junta-tecnica-registro.service';
import { Solicitud6102Store } from '../../estados/solicitud6102.store';

@Injectable()
class MockJuntaTecnicaRegistroService {}

@Injectable()
class MockSolicitud6102Store {}

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

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: JuntaTecnicaRegistroService, useClass: MockJuntaTecnicaRegistroService },
        { provide: Solicitud6102Store, useClass: MockSolicitud6102Store }
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
  component.fetchGetDatosConsulta = jest.fn();

  // Mock the consultaioQuery observable with `update: true`
  component.consultaioQuery = {
    selectConsultaioState$: observableOf({
      update: true
    })
  } as any;

  component.ngOnInit();

  expect(component.fetchGetDatosConsulta).toHaveBeenCalled();
});

it('should run #fetchGetDatosConsulta()', async () => {
  const mockResponse = {
    success: true,
    datos: {
      tecnicaForm: {
        contenedores: ['container1'],
        aduana: { name: 'TestAduana' },
        observaciones: 'Test observation'
      }
    }
  };

  // Mock the service method
  component.juntaTecnicaRegistroService = {
    getDatosConsulta: jest.fn().mockReturnValue(observableOf(mockResponse))
  } as any;

  // Mock the store with spies
  component.solicitud6102Store = {
    setContenedores: jest.fn(),
    setAduana: jest.fn(),
    setObservaciones: jest.fn()
  } as any;

  // Call the method
  component.fetchGetDatosConsulta();

  // Optional: wait if using Angular fixture
  await fixture.whenStable?.();

  // Assert that all expected methods were called
  expect(component.juntaTecnicaRegistroService.getDatosConsulta).toHaveBeenCalled();
  expect(component.solicitud6102Store.setContenedores).toHaveBeenCalledWith(['container1']);
  expect(component.solicitud6102Store.setAduana).toHaveBeenCalledWith({ name: 'TestAduana' });
  expect(component.solicitud6102Store.setObservaciones).toHaveBeenCalledWith('Test observation');
});


  it('should run #ngAfterViewInit()', async () => {

    component.ngAfterViewInit();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

});