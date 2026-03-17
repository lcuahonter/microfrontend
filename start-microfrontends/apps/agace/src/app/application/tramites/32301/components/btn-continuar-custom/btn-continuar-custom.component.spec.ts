// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { BtnContinuarCustomComponent } from './btn-continuar-custom.component';
import { SeccionLibQuery } from '@ng-mf/data-access-user';
import { Tramite32101Store } from '../../../../estados/tramites/tramite32101.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite32101Store {}

@Injectable()
class MockTramite32301Query {}

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

describe('BtnContinuarCustomComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,BtnContinuarCustomComponent,HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        SeccionLibQuery,
        { provide: Tramite32101Store, useClass: MockTramite32101Store },
        { provide: Tramite32301Query, useClass: MockTramite32301Query }
      ]
    }).overrideComponent(BtnContinuarCustomComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(BtnContinuarCustomComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run GetterDeclaration #btnAntVisible', async () => {
    component.datos = component.datos || {};
    component.datos.indice = 'indice';
    const btnAntVisible = component.btnAntVisible;

  });

  it('should run GetterDeclaration #btnContVisible', async () => {
    component.datos = component.datos || {};
    component.datos.nroPasos = 'nroPasos';
    component.datos.indice = 'indice';
    const btnContVisible = component.btnContVisible;

  });

  it('should run #ngOnInit()', async () => {
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.Tramite32301Query = component.Tramite32301Query || {};
    component.Tramite32301Query.selectState$ = observableOf({
      tipoDevAviso: {},
      modificacionSocios: {}
    });
    component.ngOnInit();

  });

  it('should run #continuar()', async () => {
    component.datos = component.datos || {};
    component.datos.indice = 'indice';
    component.datos.nroPasos = 'nroPasos';
    component.vistaEmergente = component.vistaEmergente || {};
    component.vistaEmergente.abierto = 'abierto';
    component.vistaEmergente.indice = 'indice';
    component.wizardService = component.wizardService || {};
    component.wizardService.cambio_indice = jest.fn();
    component.continuarEvento = component.continuarEvento || {};
    component.continuarEvento.emit = jest.fn();
    component.continuar();
  });

  it('should run #anterior()', async () => {
    component.datos = component.datos || {};
    component.datos.indice = 'indice';
    component.datos.nroPasos = 'nroPasos';
    component.continuarEvento = component.continuarEvento || {};
    component.continuarEvento.emit = jest.fn();
    component.anterior();
  });

  it('should run #eliminarPedimento()', async () => {
    component.datos = component.datos || {};
    component.datos.indice = 'indice';
    component.datos.nroPasos = 'nroPasos';
    component.wizardService = component.wizardService || {};
    component.wizardService.cambio_indice = jest.fn();
    component.continuarEvento = component.continuarEvento || {};
    component.continuarEvento.emit = jest.fn();
    component.eliminarPedimento({});
  });

  it('should run #guardar()', async () => {
    component.btnGuardarClicked = component.btnGuardarClicked || {};
    component.btnGuardarClicked.emit = jest.fn();
    component.guardar();
    expect(component.btnGuardarClicked.emit).toHaveBeenCalled();
  });

});