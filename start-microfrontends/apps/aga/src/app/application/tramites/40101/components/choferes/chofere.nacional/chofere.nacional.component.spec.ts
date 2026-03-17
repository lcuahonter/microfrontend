// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ChofereNacionalComponent } from './chofere.nacional.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Chofer40101Service } from '../../../estado/chofer40101.service';
import { Chofer40101Query } from '../../../estado/chofer40101.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockChofer40101Service {}

@Injectable()
class MockChofer40101Query {}

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

class MockBsModalService {
  show() { return {}; }
  hide() {}
}

describe('ChofereNacionalComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ChofereNacionalComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        BsModalService,
        { provide: Chofer40101Service, useClass: MockChofer40101Service },
        { provide: Chofer40101Query, useClass: MockChofer40101Query },
        ConsultaioQuery
      ]
    }).overrideComponent(ChofereNacionalComponent, {

      set: { providers: [{ provide: BsModalService, useClass: MockBsModalService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(ChofereNacionalComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {}; 
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.chofer40101Query = component.chofer40101Query || {};
    component.chofer40101Query.selectSolicitud$ = observableOf({});
    component.consultaioQuery = component.consultaioQuery || {};
    component.consultaioQuery.selectConsultaioState$ = observableOf({});
    component.ngOnInit();

  });

  it('should run #alSeleccionarChoferNacional()', async () => {

    component.alSeleccionarChoferNacional({});

  });

  it('should run #agregarNuevaFila()', async () => {
    component.abrirModal = jest.fn();
    component.agregarNuevaFila({});
  });

  it('should run #editarFilaSeleccionada()', () => {
    component.datosDelChoferNacional = [{ id: '1', nombre: 'Test', licencia: '123', telefono: '555', correoElectronico: 'test@test.com' }];
    component.datosDelChoferesDialogComponent = { editarRegistro: jest.fn() };

  component.datosDelChoferNacional = [{ id: '1', nombre: 'Test', licencia: '123', telefono: '555', correoElectronico: 'test@test.com' }];
  component.datosDeChoferesDialogComponent = { editarRegistro: jest.fn() };
  jest.spyOn(component, 'abrirModal').mockImplementation();
  component.editarFilaSeleccionada({});

  });

  it('should run #eliminarFilaSeleccionada()', () => {
  const row = { id: '1', nombre: 'Test', licencia: '123', telefono: '555', correoElectronico: 'test@test.com' };
  component.datosDelChoferNacional = [row];
  component.datosDelChoferNacionalSelected = [row];
  component.eliminarFilaSeleccionada();
  expect(component.datosDelChoferNacional.length).toBe(0);
  expect(component.datosDelChoferNacionalSelected.length).toBe(0);
  });

  it('should run #abrirModal()', async () => {
    component.bsModalService = component.bsModalService || {};
    component.bsModalService.show = jest.fn();
    component.abrirModal({});
    expect(component.bsModalService.show).toHaveBeenCalled();
  });

  it('should run #cancelarModal()', () => {
    component.modalRef = { hide: jest.fn() } as any;
    component.cancelarModal();
    expect(component.modalRef).toBeNull();
  });

  it('should run #agregarModal()', () => {
    component.datosDelChoferNacional = [];
    component.chofer40101Service = { updateDatosDelChoferNacional: jest.fn() } as any;
    jest.spyOn(component, 'cancelarModal').mockImplementation();
    component.agregarModal({ datos: { id: '2', nombre: 'Nuevo', licencia: '456', telefono: '555', correoElectronico: 'nuevo@test.com' } });
    expect(component.datosDelChoferNacional.length).toBe(1);
    expect(component.chofer40101Service.updateDatosDelChoferNacional).toHaveBeenCalled();
    expect(component.cancelarModal).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

});