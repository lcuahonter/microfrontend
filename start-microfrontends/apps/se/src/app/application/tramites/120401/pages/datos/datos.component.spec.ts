// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosComponent } from './datos.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';

@Injectable()
class MockAsignacionDirectaCupoPersonasFisicasPrimeraVezService {}

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

describe('DatosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        DatosComponent,
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        ConsultaioQuery,
        { provide: AsignacionDirectaCupoPersonasFisicasPrimeraVezService, useClass: MockAsignacionDirectaCupoPersonasFisicasPrimeraVezService }
      ]
    }).overrideComponent(DatosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #esPrimeraPestana', async () => {

    const esPrimeraPestana = component.esPrimeraPestana;

  });

  it('should run GetterDeclaration #esUltimaPestana', async () => {

    const esUltimaPestana = component.esUltimaPestana;

  });

  it('should run #ngOnInit()', async () => {
    component.consultaQuery = component.consultaQuery || {};
    component.consultaQuery.selectConsultaioState$ = observableOf({});
    component.guardarDatosFormulario = jest.fn();
    component.ngOnInit();
    // expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.AsignacionDirectaCupoPersonasFisicasPrimeraVezService = component.AsignacionDirectaCupoPersonasFisicasPrimeraVezService || {};
    component.AsignacionDirectaCupoPersonasFisicasPrimeraVezService.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(observableOf({}));
    component.AsignacionDirectaCupoPersonasFisicasPrimeraVezService.actualizarEstadoFormulario = jest.fn();
    component.guardarDatosFormulario();
    });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #avanzarTab()', async () => {

    component.avanzarTab();

  });

  it('should run #retrocederTab()', async () => {

    component.retrocederTab();

  });

  it('should run #resetTabs()', async () => {

    component.resetTabs();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
     });

});