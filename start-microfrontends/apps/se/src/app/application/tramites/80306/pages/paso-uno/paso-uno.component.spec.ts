// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Tramite80306Store } from '../../estados/tramite80306.store';

@Injectable()
class MockImmerModificacionService {}

@Injectable()
class MockTramite80306Store {}

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
      imports: [ PasoUnoComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ImmerModificacionService, useClass: MockImmerModificacionService },
        ConsultaioQuery,
        { provide: Tramite80306Store, useClass: MockTramite80306Store }
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

  it('should have pasos defined and be an array', () => {
    expect(component.pasos).toBeDefined();
    expect(Array.isArray(component.pasos)).toBe(true);
  });

  it('should have indice initialized to 1', () => {
    expect(component.indice).toBe(1);
  });

  it('should have datosPasos initialized correctly', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('should update indice in seleccionaTab if payload has indice', () => {
    component.indice = 1;
    component.seleccionaTab({ indice: 3 });
    expect(component.indice).toBe(3);
  });

  it('should be standalone and have correct selector', () => {
    const metadata = (PasoUnoComponent as any).ɵcmp;
    expect(metadata.standalone).toBe(true);
    expect(metadata.selectors[0][0]).toBe('app-paso-uno');
  });

  it('should run #ngOnInit()', async () => {
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #ngAfterViewInit()', async () => {

    component.ngAfterViewInit();

  });

  it('should run #seleccionaTab()', async () => {

    component.seleccionaTab({});

  });

  it('should run #continuar()', async () => {
    component.continuarEvento = component.continuarEvento || {};
    component.continuarEvento.emit = jest.fn();
    component.continuar();
    expect(component.continuarEvento.emit).toHaveBeenCalled();
  });

  it('should run #getValorIndice()', async () => {
    component.wizardComponent = component.wizardComponent || {};
    component.wizardComponent.siguiente = jest.fn();
    component.wizardComponent.atras = jest.fn();
    component.getValorIndice({
      valor: {},
      accion: {}
    });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

});