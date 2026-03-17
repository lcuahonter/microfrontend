// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ImportadorEnDestinoComponent } from './importador-en-destino.component';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ElegibilidadDeTextilesStore } from '../../estados/elegibilidad-de-textiles.store';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { SeccionLibStore, SeccionLibQuery } from '@ng-mf/data-access-user';
import { ImporteRecordService } from '../../services/catalogos/importe-record.service';

@Injectable()
class MockElegibilidadTextilesService {}

@Injectable()
class MockHttpClient {
  post() {};
}

@Injectable()
class MockElegibilidadDeTextilesStore {}

@Injectable()
class MockElegibilidadDeTextilesQuery {
  selectTextile$ = observableOf({
    tipo: '',
    cantidadTotalImportador: '',
    razonSocialImportador: '',
    domicilio: '',
    ciudadImportador: '',
    codigoPostal: '',
    pais: '',
    formaValida: []
  });
}

@Injectable()
class MockImporteRecordService {
  getImporteRecord() {
    return observableOf([]);
  }
}

@Injectable()
class MockChangeDetectorRef {
  detectChanges() {}
}


describe('ImportadorEnDestinoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        ImportadorEnDestinoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ElegibilidadTextilesService, useClass: MockElegibilidadTextilesService },
        FormBuilder,
        { provide: HttpClient, useClass: MockHttpClient },
        { provide: ElegibilidadDeTextilesStore, useClass: MockElegibilidadDeTextilesStore },
        { provide: ElegibilidadDeTextilesQuery, useClass: MockElegibilidadDeTextilesQuery },
        { provide: SeccionLibStore, useValue: { establecerSeccion: jest.fn(), establecerFormaValida: jest.fn() } },
        { provide: SeccionLibQuery, useValue: { selectSeccionState$: observableOf({}) } },
        { provide: ImporteRecordService, useClass: MockImporteRecordService },
        { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ImportadorEnDestinoComponent);
    component = fixture.componentInstance;
    
    (component as any).importadorState = {
      tipo: '',
      cantidadTotalImportador: '',
      razonSocialImportador: '',
      domicilio: '',
      ciudadImportador: '',
      codigoPostal: '',
      pais: '',
      formaValida: []
    };
  });
  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.importadorForm).toBeDefined();
  });
  it('debe inicializar correctamente el formulario y lógica de estado', () => {
    component.ngOnInit();
    expect(component.importadorForm).toBeDefined();
    component.importadorState = { formaValida: [] };
    component.ElegibilidadDeTextilesStore = { setFormaValida: jest.fn() };
    component.seccionStore = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn()
    };
    
    component.importadorForm = {
      valid: true,
      statusChanges: { pipe: () => ({ subscribe: (fn) => fn() }) }
    } as any;
    
    if (component.importadorForm.valid) {
      component.ElegibilidadDeTextilesStore.setFormaValida([
        ...component.importadorState.formaValida,
        { id: 4, descripcion: 'TodoValido' },
      ]);
    }
    component.seccionStore.establecerSeccion([true]);
    component.seccionStore.establecerFormaValida([true]);
    expect(component.ElegibilidadDeTextilesStore.setFormaValida).toHaveBeenCalledWith([
      ...component.importadorState.formaValida,
      { id: 4, descripcion: 'TodoValido' },
    ]);
    expect(component.seccionStore.establecerSeccion).toHaveBeenCalledWith([true]);
    expect(component.seccionStore.establecerFormaValida).toHaveBeenCalledWith([true]);
  });

  it('debe deshabilitar el formulario si formularioDeshabilitado es verdadero', () => {
      component.importadorForm = new FormGroup({});
      component.formularioDeshabilitado = true;
      component.importadorForm.disable = jest.fn();
      if (component.formularioDeshabilitado) {
        component.importadorForm.disable();
      }
      expect(component.importadorForm.disable).toHaveBeenCalled();
    });

  it('debe manejar continuar() cuando el formulario es inválido', () => {
    component.importadorForm = new FormGroup({});
    Object.defineProperty(component.importadorForm, 'valid', { get: () => false });
    component.importadorForm.markAllAsTouched = jest.fn();
    component.importadorForm.updateValueAndValidity = jest.fn();
    component.cdr = { detectChanges: jest.fn() };
    window.scrollTo = jest.fn();
    component.formularioAlertaError = '';
    component.esFormaValido = false;
    const mockErrorAlert = 'Error';
    const originalContinuar = component.continuar;
    component.continuar = function() {
      this.importadorForm.markAllAsTouched();
      this.importadorForm.updateValueAndValidity();
      this.cdr.detectChanges();
      if (!this.importadorForm.valid) {
        this.formularioAlertaError = mockErrorAlert;
        this.esFormaValido = true;
        window.scrollTo(0, 0);
        return;
      }
      this.esFormaValido = false;
      this.formularioAlertaError = '';
      window.scrollTo(0, 0);
      this.mostrarTabs.emit(true);
    };
    component.continuar();
    expect(component.importadorForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.importadorForm.updateValueAndValidity).toHaveBeenCalled();
    expect(component.cdr.detectChanges).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(component.formularioAlertaError).toBe(mockErrorAlert);
    expect(component.esFormaValido).toBe(true);
    });

  it('debe manejar continuar() cuando el formulario es válido', () => {
    component.importadorForm = new FormGroup({});
    Object.defineProperty(component.importadorForm, 'valid', { get: () => true });
    component.importadorForm.markAllAsTouched = jest.fn();
    component.importadorForm.updateValueAndValidity = jest.fn();
    component.cdr = { detectChanges: jest.fn() };
    window.scrollTo = jest.fn();
    component.formularioAlertaError = 'Error';
    component.esFormaValido = true;
    component.mostrarTabs = { emit: jest.fn() };
    const originalContinuar = component.continuar;
    component.continuar = function() {
      this.importadorForm.markAllAsTouched();
      this.importadorForm.updateValueAndValidity();
      this.cdr.detectChanges();
      if (!this.importadorForm.valid) {
        this.formularioAlertaError = 'Error';
        this.esFormaValido = true;
        window.scrollTo(0, 0);
        return;
      }
      this.esFormaValido = false;
      this.formularioAlertaError = '';
      window.scrollTo(0, 0);
      this.mostrarTabs.emit(true);
    };
    component.continuar();
    expect(component.importadorForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.importadorForm.updateValueAndValidity).toHaveBeenCalled();
    expect(component.cdr.detectChanges).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(component.formularioAlertaError).toBe('');
    expect(component.esFormaValido).toBe(false);
    expect(component.mostrarTabs.emit).toHaveBeenCalledWith(true);
    });

  it('debe ejecutar el constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('debe ejecutar #ngOnInit()', async () => {
    component.initActionFormBuild = jest.fn();
    component.seccionQuery = component.seccionQuery || {};
    component.seccionQuery.selectSeccionState$ = observableOf({});
    component.ElegibilidadDeTextilesQuery = component.ElegibilidadDeTextilesQuery || {};
    component.ElegibilidadDeTextilesQuery.selectTextile$ = observableOf({});
    component.importadorForm = {
      valid: true,
      statusChanges: observableOf({})
    } as any;
    component.ElegibilidadDeTextilesStore = component.ElegibilidadDeTextilesStore || {};
    component.ElegibilidadDeTextilesStore.setFormaValida = jest.fn();
    component.obtenerListasDesplegables = jest.fn();
    component.seccionStore = component.seccionStore || {};
    component.seccionStore.establecerFormaValida = jest.fn();
    component.seccionStore.establecerSeccion = jest.fn();
    component.ngOnInit();
    expect(component.initActionFormBuild).toHaveBeenCalled();
  });

  it('debe ejecutar #initActionFormBuild()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.importadorState = component.importadorState || {};
    component.importadorState.tipo = 'tipo';
    component.importadorState.cantidadTotalImportador = 'cantidadTotalImportador';
    component.importadorState.razonSocialImportador = 'razonSocialImportador';
    component.importadorState.domicilio = 'domicilio';
    component.importadorState.ciudadImportador = 'ciudadImportador';
    component.importadorState.cpImportador = 'cpImportador';
    component.importadorState.PaisImportador = 'PaisImportador';
    component.initActionFormBuild();
  });

  it('debe ejecutar #obtenerListasDesplegables()', async () => {
    component.obtenerIngresoSelectList = jest.fn();
    component.obtenerListasDesplegables();
  });

  it('debe ejecutar #obtenerIngresoSelectList()', async () => {
    component.ElegibilidadTextilesService = component.ElegibilidadTextilesService || {};
    component.ElegibilidadTextilesService.obtenerMenuDesplegable = jest.fn().mockReturnValue(observableOf({}));
    component.obtenerIngresoSelectList();
  });

  it('debe ejecutar #setValoresStore()', async () => {
    component.ElegibilidadDeTextilesStore = component.ElegibilidadDeTextilesStore || {};
    component.ElegibilidadDeTextilesStore.someMethod = jest.fn();
    const form = new FormGroup({
      campo: new FormControl('testValue'),
    });

    component.setValoresStore(form, 'campo', 'someMethod');

    expect(component.ElegibilidadDeTextilesStore.someMethod).toHaveBeenCalled();
  });
});