// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DatosComponent } from './datos.component';
import { AvisoUnicoService } from '../../services/aviso-unico.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { UnicoStore } from '../../estados/renovacion.store';

@Injectable()
class MockAvisoUnicoService {}

@Injectable()
class MockUnicoStore {}

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
        { provide: AvisoUnicoService, useClass: MockAvisoUnicoService },
        ConsultaioQuery,
        { provide: UnicoStore, useClass: MockUnicoStore }
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

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #fetchGetDatosConsulta()', async () => {
    component.service = component.service || {};
    component.service.getDatosConsulta = jest.fn().mockReturnValue(observableOf({
      success: {},
      datos: {}
    }));
    component.unicoStore = component.unicoStore || {};
    component.unicoStore.setmapTipoTramite = jest.fn();
    component.unicoStore.setmapDeclaracionSolicitud = jest.fn();
    component.unicoStore.setenvioAviso = jest.fn();
    component.unicoStore.setnumeroAviso = jest.fn();
    component.unicoStore.setclaveReferencia = jest.fn();
    component.unicoStore.setnumeroOperacion = jest.fn();
    component.unicoStore.setcadenaDependencia = jest.fn();
    component.unicoStore.setbanco = jest.fn();
    component.unicoStore.setllavePago = jest.fn();
    component.unicoStore.setfechaPago = jest.fn();
    component.unicoStore.setimportePago = jest.fn();
    component.fetchGetDatosConsulta();
    expect(component.service.getDatosConsulta).toHaveBeenCalled();
    expect(component.unicoStore.setmapTipoTramite).toHaveBeenCalled();
    expect(component.unicoStore.setmapDeclaracionSolicitud).toHaveBeenCalled();
    expect(component.unicoStore.setenvioAviso).toHaveBeenCalled();
    expect(component.unicoStore.setnumeroAviso).toHaveBeenCalled();
    expect(component.unicoStore.setclaveReferencia).toHaveBeenCalled();
    expect(component.unicoStore.setnumeroOperacion).toHaveBeenCalled();
    expect(component.unicoStore.setcadenaDependencia).toHaveBeenCalled();
    expect(component.unicoStore.setbanco).toHaveBeenCalled();
    expect(component.unicoStore.setllavePago).toHaveBeenCalled();
    expect(component.unicoStore.setfechaPago).toHaveBeenCalled();
    expect(component.unicoStore.setimportePago).toHaveBeenCalled();
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