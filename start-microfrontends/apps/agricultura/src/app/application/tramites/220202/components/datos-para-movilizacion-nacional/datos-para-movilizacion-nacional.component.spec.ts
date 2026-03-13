// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosParaMovilizacionNacionalComponent } from './datos-para-movilizacion-nacional.component';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockAgriculturaApiService {
  getAllDatosForma() {
    return observableOf({ movilizacion: {} });
  }
  actualizarFormaValida = jest.fn();
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

describe('DatosParaMovilizacionNacionalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosParaMovilizacionNacionalComponent, ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AgriculturaApiService, useClass: MockAgriculturaApiService },
        ConsultaioQuery
      ]
    }).overrideComponent(DatosParaMovilizacionNacionalComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosParaMovilizacionNacionalComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });


  it('should run #obtenerTodosLosDatosDeOpciones()', async () => {
    component.obtenerListaDeJustificaciones = jest.fn();
    component.obtenerListaDePunto = jest.fn();
    component.obtenerTodosLosDatosDeOpciones();
    expect(component.obtenerListaDeJustificaciones).toHaveBeenCalled();
    expect(component.obtenerListaDePunto).toHaveBeenCalled();
  });

  it('should run #obtenerListaDeJustificaciones()', async () => {
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerListaDeJustificaciones();
    expect(component.agriculturaApiService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #obtenerListaDePunto()', async () => {
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerListaDePunto();
    expect(component.agriculturaApiService.obtenerSelectorList).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    component.forma = component.forma || {};
    component.forma.value = 'value';
    component.agriculturaApiService = component.agriculturaApiService || {};
    component.agriculturaApiService.updateMovilizacion = jest.fn();
    component.setValoresStore({}, {});
    expect(component.agriculturaApiService.updateMovilizacion).toHaveBeenCalled();
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