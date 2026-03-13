// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { DatosDeReporteAnnualComponent } from './datos-de-reporte-anual.component';
import { FormBuilder } from '@angular/forms';
import { Solicitud150101Store } from '../../estados/solicitud150101.store';
import { Solicitud150101Query } from '../../estados/solicitud150101.query';
import { SolicitudService } from '../../services/registro-solicitud-anual.service';

@Injectable()
class MockSolicitudService { }

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) { return value; }
}

describe('DatosDeReporteAnnualComponent', () => {
  let fixture;
  let component;
  let solicitudStoreMock: any;
  let solicitudQueryMock: any;

  beforeEach(() => {
    solicitudStoreMock = {
      setReporteAnualFechaInicio: jest.fn(),
      setReporteAnualFechaFin: jest.fn(),
      actualizarFolioPrograma: jest.fn(),
      actualizarModalidad: jest.fn(),
      actualizarTipoPrograma: jest.fn(),
      actualizarEstatus: jest.fn(),
    };

    solicitudQueryMock = {
      seleccionarSolicitud$: of({ reporteAnualFechaInicio: '2023-01', reporteAnualFechaFin: '2023-12' })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, DatosDeReporteAnnualComponent],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: Solicitud150101Store, useValue: solicitudStoreMock },
        { provide: Solicitud150101Query, useValue: solicitudQueryMock },
        { provide: SolicitudService, useClass: MockSolicitudService }
      ]
    }).overrideComponent(DatosDeReporteAnnualComponent, {

    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeReporteAnnualComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = function () {};
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #obtenerVentasTotales()', async () => {
    component.solicitud150101Store = component.solicitud150101Store || {};
    component.solicitud150101Store.actualizarVentasTotales = jest.fn();
    component.calcularReporteAnnual = jest.fn();
    component.obtenerVentasTotales({
      target: {
        value: {}
      }
    });
  });

  it('should run #obtenerTotalExportaciones()', async () => {
    component.solicitud150101Store = component.solicitud150101Store || {};
    component.solicitud150101Store.actualizarTotalExportaciones = jest.fn();
    component.solicitud150101Store.actualizarSaldo = jest.fn();
    component.formReporteAnnual = component.formReporteAnnual || {};
    component.formReporteAnnual.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.calcularReporteAnnual = jest.fn();
    component.obtenerTotalExportaciones({
      target: {
        value: {}
      }
    });
  });

  it('should run #obtenerTotalImportaciones()', async () => {
    component.solicitud150101Store = component.solicitud150101Store || {};
    component.solicitud150101Store.actualizarTotalImportaciones = jest.fn();
    component.calcularReporteAnnual = jest.fn();
    component.obtenerTotalImportaciones({
      target: {
        value: {}
      }
    });
  });

  it('should run #calcularReporteAnnual()', async () => {
    component.formReporteAnnual = component.formReporteAnnual || {};
    component.formReporteAnnual.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.solicitud150101Store = component.solicitud150101Store || {};
    component.solicitud150101Store.actualizarPorcentajeExportacion = jest.fn();
    component.solicitud150101Store.actualizarSaldo = jest.fn();
    component.calcularReporteAnnual();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
  });

});