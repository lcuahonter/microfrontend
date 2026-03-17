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
import { ModificacionComponent } from './modificacion.component';
import { FormBuilder } from '@angular/forms';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { AmpliacionServiciosQuery } from '../../estados/tramite90302.query';
import { Tramite90302Store } from '../../estados/tramite90302.store';

@Injectable()
class MockAmpliacionServiciosService {}

@Injectable()
class MockAmpliacionServiciosQuery {}

@Injectable()
class MockTramite90302Store {}

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

describe('ModificacionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        ModificacionComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        {
          provide: AmpliacionServiciosService,
          useClass: MockAmpliacionServiciosService,
        },
        {
          provide: AmpliacionServiciosQuery,
          useClass: MockAmpliacionServiciosQuery,
        },
        { provide: Tramite90302Store, useClass: MockTramite90302Store },
      ],
    })
      .overrideComponent(ModificacionComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(ModificacionComponent);
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
    component.getDatos = jest.fn();
    component.inicializarFormularioInfoRegistro = jest.fn();
    component.inicializarFormularioDesdeAlmacen = jest.fn();
    component.loadDatosTablaData = jest.fn();
    component.ngOnInit();
     expect(component.getDatos).toHaveBeenCalled();
    expect(component.inicializarFormularioInfoRegistro).toHaveBeenCalled();
    expect(component.inicializarFormularioDesdeAlmacen).toHaveBeenCalled();
     expect(component.loadDatosTablaData).toHaveBeenCalled();
  });

  it('should run #getDatos()', async () => {
    component.ampliacionServiciosService =
      component.ampliacionServiciosService || {};
    component.ampliacionServiciosService.getDatos = jest
      .fn()
      .mockReturnValue(observableOf({ data: 'mockData' }));
    component.tramite90302Store = component.tramite90302Store || {};
    component.tramite90302Store.setInfoRegistro = jest.fn();
    component.getDatos();
    expect(component.ampliacionServiciosService.getDatos).toHaveBeenCalled();
    expect(component.tramite90302Store.setInfoRegistro).toHaveBeenCalled();
  });

  it('should run #inicializarFormularioInfoRegistro()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormularioInfoRegistro();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #inicializarFormularioDesdeAlmacen()', async () => {
    component.ampliacionServiciosQuery =
      component.ampliacionServiciosQuery || {};
    component.ampliacionServiciosQuery.selectInfoRegistro$ = observableOf({
      rfc: {},
      representacionFederal: {},
      tipoModificacion: {},
      modificacionPrograma: {},
    });
    component.formularioInfoRegistro = component.formularioInfoRegistro || {};
    component.formularioInfoRegistro.patchValue = jest.fn();
    component.inicializarFormularioDesdeAlmacen();
    expect(component.formularioInfoRegistro.patchValue).toHaveBeenCalled();
  });

  it('should run #loadDatosTablaData()', async () => {
    component.ampliacionServiciosService =
      component.ampliacionServiciosService || {};
    component.ampliacionServiciosService.getModificacionTableData = jest
      .fn()
      .mockReturnValue(observableOf({}));
    component.loadDatosTablaData();
    expect(
      component.ampliacionServiciosService.getModificacionTableData
    ).toHaveBeenCalled();
  });

  it('should run #valorDeAlternancia()', async () => {
    component.datosTabla = component.datosTabla || {};
    component.datosTabla = [
      { id: 1, desEstatus: 'BAJA' },
      { id: 2, desEstatus: 'ACTIVADA' },
    ];
    component.datosTabla.findIndex = jest.fn().mockReturnValue(0);
    component.valorDeAlternancia({
      id: {},
    });
    expect(component.datosTabla.findIndex).toHaveBeenCalled();
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
