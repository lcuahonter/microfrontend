// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ModificacionComponent } from './modificacion.component';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { ImmerModificacionService } from '../../service/immer-modificacion.service';
import { Tramite80306Store } from '../../../../estados/tramites/tramite80306.store';
import { Tramite80306Query } from '../../../../estados/queries/tramite80306.query';

@Injectable()
class MockImmerModificacionService {}

@Injectable()
class MockTramite80306Store {}

@Injectable()
class MockTramite80306Query {}

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

describe('ModificacionComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ModificacionComponent, FormsModule, ReactiveFormsModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: ImmerModificacionService, useClass: MockImmerModificacionService },
        { provide: Tramite80306Store, useClass: MockTramite80306Store },
        { provide: Tramite80306Query, useClass: MockTramite80306Query },
        {
          provide: ToastrService,
          useValue: {
            success: jest.fn(),
            error: jest.fn(),
            info: jest.fn(),
            warning: jest.fn(),
          }
        }
      ]
    }).overrideComponent(ModificacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(ModificacionComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should have encabezadoDeTabla defined and be an array', () => {
    expect(component.encabezadoDeTabla).toBeDefined();
    expect(Array.isArray(component.encabezadoDeTabla)).toBe(true);
  });


  it('should populate datosTabla in loadDatosTablaData with valid data', () => {
    const validData = { datos: [{ test: 'row' }] };
    component.solicitudService = {
      obtenerBuscarServicios: jest.fn().mockReturnValue(observableOf(validData)),
    } as any;
    component.solicitudState = { selectedFolioPrograma: 'folio' } as any;
    component.buscarIdSolicitudString = 'id';
    component.datosTabla = [];
    component.loadDatosTablaData();
    expect(component.datosTabla).toEqual(validData.datos);
  });


  it('should not populate datosTabla in loadDatosTablaData with invalid data', () => {
    const invalidData = { datos: null };
    component.solicitudService = {
      obtenerBuscarServicios: jest.fn().mockReturnValue(observableOf(invalidData)),
    } as any;
    component.solicitudState = { selectedFolioPrograma: 'folio' } as any;
    component.buscarIdSolicitudString = 'id';
    component.datosTabla = [];
    component.loadDatosTablaData();
    expect(component.datosTabla).toEqual([]);
  });

  it('should set buscarIdSolicitudString and call loadDatosTablaData in obtenerSolicitudId', () => {
    const response = { datos: { buscaIdSolicitud: '1,2,3' } };
    component.solicitudService = {
      obtenerSolicitudId: jest.fn().mockReturnValue(observableOf(response)),
    } as any;
    component.solicitudState = { selectedIdPrograma: 'p', selectedTipoPrograma: 't' } as any;
    component.loadDatosTablaData = jest.fn();
    component.obtenerSolicitudId();
    expect(component.buscarIdSolicitudString).toBe('1,2,3');
    expect(component.loadDatosTablaData).toHaveBeenCalled();
  });

  it('should handle error in obtenerSolicitudId and call toastr', () => {
    component.solicitudService = {
      obtenerSolicitudId: jest.fn().mockReturnValue(throwError(() => new Error('err'))),
    } as any;
    component.solicitudState = { selectedIdPrograma: 'p', selectedTipoPrograma: 't' } as any;
    component.toastr = { error: jest.fn() } as any;
    component.obtenerSolicitudId();
    expect((component as any).toastr.error).toHaveBeenCalledWith('Error al cargar las operaciones');
  });

  it('should be standalone and have correct selector', () => {
    const metadata = (ModificacionComponent as any).ɵcmp;
    expect(metadata.standalone).toBe(true);
    expect(metadata.selectors[0][0]).toBe('app-modificacion');
  });

  it('should run #ngOnInit()', async () => {
    component.tramite80306Query = component.tramite80306Query || {};
    component.tramite80306Query.selectSolicitud$ = observableOf({});
    component.solicitudService = {
      obtenerSolicitudId: jest.fn().mockReturnValue(observableOf({ datos: { buscaIdSolicitud: '' } })),
    } as any;
    component.inicializarFormulario = jest.fn();
    component.loadDatosModificacion = jest.fn();
    component.loadDatosTablaData = jest.fn();
    component.ngOnInit();
    expect(component.inicializarFormulario).toHaveBeenCalled();
    expect(component.loadDatosModificacion).toHaveBeenCalled();
    expect(component.loadDatosTablaData).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

  it('should run #inicializarFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.derechoState = component.derechoState || {};
    component.derechoState.datosModificacion = 'datosModificacion';
    component.inicializarFormulario();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #loadDatosModificacion()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.getDatosModificacion = jest.fn().mockReturnValue(observableOf({}));
    component.tramite80306Store = component.tramite80306Store || {};
    component.tramite80306Store.setDatosModificacion = jest.fn();
    component.setFormValues = jest.fn();
    component.loadDatosModificacion();
    expect(component.solicitudService.getDatosModificacion).toHaveBeenCalled();
    expect(component.tramite80306Store.setDatosModificacion).toHaveBeenCalled();
    expect(component.setFormValues).toHaveBeenCalled();
  });

  it('should run #loadDatosTablaData()', async () => {
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.getDatosTableData = jest.fn().mockReturnValue(observableOf({}));
    component.loadDatosTablaData();
    expect(component.solicitudService.getDatosTableData).toHaveBeenCalled();
  });

  it('should run #setFormValues()', async () => {
    component.modificacionForm = component.modificacionForm || {};
    component.modificacionForm.get = jest.fn().mockReturnValue({
      setValue: function() {}
    });
    component.derechoState = component.derechoState || {};
    component.derechoState.datosModificacion = 'datosModificacion';
    component.setFormValues();
    expect(component.modificacionForm.get).toHaveBeenCalled();
  });

  it('should run #setValoresStore()', async () => {
    // Arrange
    const mockForm = {
      get: jest.fn().mockReturnValue({ value: 'mockValue' }),
    } as unknown as FormGroup;

    const mockCampo = 'mockCampo';
    const mockMetodoNombre = 'setDatosModificacion'; // Use a valid method name

    component.tramite80306Store = {
      setDatosModificacion: jest.fn()
    } as any;

    // Act
    component.setValoresStore(
      mockForm,
      mockCampo,
      mockMetodoNombre as keyof Tramite80306Store
    );

    // Assert
    expect(
       component.tramite80306Store.setDatosModificacion
     ).toHaveBeenCalledWith('mockValue');
   });

});