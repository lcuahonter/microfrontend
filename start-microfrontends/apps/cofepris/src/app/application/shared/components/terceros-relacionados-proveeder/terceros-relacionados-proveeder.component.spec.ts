// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosComponent } from './terceros-relacionados.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TercerosRelacionadosFebService } from '../../services/tereceros-relacionados-feb.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class MockTercerosRelacionadosFebService {}

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

describe('TercerosRelacionadosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, TercerosRelacionadosComponent, HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Router, useClass: MockRouter },
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
        },
        { provide: TercerosRelacionadosFebService, useClass: MockTercerosRelacionadosFebService },
        ConsultaioQuery
      ]
    }).overrideComponent(TercerosRelacionadosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #irAAcciones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.irAAcciones({});
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', async () => {
    component.tercerosService = component.tercerosService || {};
    component.tercerosService.getFabricanteTablaDatos = jest.fn().mockReturnValue(observableOf({}));
    component.ngOnInit();
    expect(component.tercerosService.getFabricanteTablaDatos).toHaveBeenCalled();
  });

  it('should run #esCampoRequerido()', async () => {
    component.elementosRequeridos = component.elementosRequeridos || {};
    component.elementosRequeridos.includes = jest.fn();
    component.esCampoRequerido({});
    expect(component.elementosRequeridos.includes).toHaveBeenCalled();
  });

  it('should run #modificarFabricante()', async () => {
    component.fabricanteSeleccionadoDatos = [{ rfc: 'TEST123' }];
    component.fabricanteEventoModificar = component.fabricanteEventoModificar || {};
    component.fabricanteEventoModificar.emit = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarFabricante();
    expect(component.fabricanteEventoModificar.emit).toHaveBeenCalled();
    expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #modificarDestinatario()', async () => {
    component.destinatarioSeleccionadoDatos = [{ rfc: 'TEST123' }];
    component.destinatarioEventoModificar = component.destinatarioEventoModificar || {};
    component.destinatarioEventoModificar.emit = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarDestinatario();
    expect(component.destinatarioEventoModificar.emit).toHaveBeenCalled();
    expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #modificarProveedor()', async () => {
    component.proveedorSeleccionadoDatos = [{ nombreRazonSocial: 'Test Provider', razonSocial: 'Test' }];
    component.proveedorEventoModificar = component.proveedorEventoModificar || {};
    component.proveedorEventoModificar.emit = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarProveedor();
    expect(component.proveedorEventoModificar.emit).toHaveBeenCalled();
    expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #modificarFacturador()', async () => {
    component.facturadorSeleccionadoDatos = [{ nombreRazonSocial: 'Test Facturador', razonSocial: 'Test' }];
    component.facturadorEventoModificar = component.facturadorEventoModificar || {};
    component.facturadorEventoModificar.emit = jest.fn();
    component.irAAcciones = jest.fn();
    component.modificarFacturador();
    expect(component.facturadorEventoModificar.emit).toHaveBeenCalled();
    expect(component.irAAcciones).toHaveBeenCalled();
  });

  it('should run #eliminarFabricante()', async () => {
    component.fabricanteSeleccionadoDatos = [{ rfc: 'TEST123' }];
    component.fabricanteTablaDatos = [{ rfc: 'TEST123' }, { rfc: 'TEST456' }];
    component.fabricanteEliminar = component.fabricanteEliminar || {};
    component.fabricanteEliminar.emit = jest.fn();
    component.eliminarFabricante();
    expect(component.fabricanteEliminar.emit).toHaveBeenCalled();
  });

  it('should run #eliminarDestinatario()', async () => {
    component.destinatarioSeleccionadoDatos = [{ rfc: 'TEST123' }];
    component.destinatarioFinalTablaDatos = [
      { rfc: 'TEST123' },
      { rfc: 'TEST456' }
    ];
    component.destinatarioEliminar = component.destinatarioEliminar || {};
    component.destinatarioEliminar.emit = jest.fn();
    component.eliminarDestinatario();
    expect(component.destinatarioEliminar.emit).toHaveBeenCalled();
  });

  it('should run #eliminarProveedor()', async () => {
    component.proveedorSeleccionadoDatos = [{ nombreRazonSocial: 'Test Provider', razonSocial: 'Test' }];
    component.proveedorTablaDatos = [
      { nombreRazonSocial: 'Test Provider', razonSocial: 'Test' },
      { nombreRazonSocial: 'Another Provider', razonSocial: 'Another' }
    ];
    component.proveedorEliminar = component.proveedorEliminar || {};
    component.proveedorEliminar.emit = jest.fn();
    component.eliminarProveedor();
    expect(component.proveedorEliminar.emit).toHaveBeenCalled();
  });

  it('should run #eliminarFacturador()', async () => {
    component.facturadorSeleccionadoDatos = [{ nombreRazonSocial: 'Test Facturador', razonSocial: 'Test' }];
    component.facturadorTablaDatos = [
      { nombreRazonSocial: 'Test Facturador', razonSocial: 'Test' },
      { nombreRazonSocial: 'Another Facturador', razonSocial: 'Another' }
    ];
    component.facturadorEliminar = component.facturadorEliminar || {};
    component.facturadorEliminar.emit = jest.fn();
    component.eliminarFacturador();
    expect(component.facturadorEliminar.emit).toHaveBeenCalled();
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