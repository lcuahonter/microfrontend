// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { MercanciaFormComponent } from './mercancia-form.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AgriculturaApiService } from '../../services/220202/agricultura-api.service';
import { FitosanitarioQuery } from '../../queries/fitosanitario.query';

@Injectable()
class MockAgriculturaApiService {
  obtenerSelectorList = jest.fn().mockReturnValue(observableOf({}));
}

@Injectable()
class MockFitosanitarioQuery {
  select = jest.fn().mockReturnValue({
    0: {
      usoCrossListDatos: {}
    },
    pipe: function() {
      return observableOf({});
    }
  });
  seleccionarDatosSeleccionados$ = observableOf({});
}

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

describe('MercanciaFormComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, MercanciaFormComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        Location,
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
        { provide: AgriculturaApiService, useClass: MockAgriculturaApiService },
        { provide: FitosanitarioQuery, useClass: MockFitosanitarioQuery }
      ]
    }).overrideComponent(MercanciaFormComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(MercanciaFormComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // Espía el método crearFormulario en lugar del inexistente cargarTodosLosCatalogos.
    component.crearFormulario = jest.fn();
    component.fitosanitarioQuery = component.fitosanitarioQuery || {};
    component.fitosanitarioQuery.select = jest.fn().mockReturnValue({
      pipe: function() {
        return observableOf({});
      }
    });
    component.fitosanitarioQuery.seleccionarDatosSeleccionados$ = observableOf({});
    component.fb = component.fb || {};
    component.fb.group = jest.fn().mockReturnValue({
      patchValue: function() {}
    });
    component.route = component.route || {};
    component.route.snapshot = {
      paramMap: {
        get: function() {}
      }
    };
    component.ngOnInit();
    expect(component.crearFormulario).toHaveBeenCalled();
    expect(component.fitosanitarioQuery.select).toHaveBeenCalled();
  });

  it('should run #tipoSelecionada()', async () => {
    // Simula catalogosDatos utilizando fraccionArancelariaList
    component.catalogosDatos = component.catalogosDatos || {};
    component.catalogosDatos.fraccionArancelariaList = [
      {
        id: 'test-id',
        descripcion: 'Test Description'
      }
    ];
    
    const mockControl = {
      clearValidators: jest.fn(),
      setValue: jest.fn(),
      setValidators: jest.fn(),
      updateValueAndValidity: jest.fn()
    };
    
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.get = jest.fn().mockReturnValue(mockControl);
    component.mercanciaForm.patchValue = jest.fn();
    
    const mockEvent = {
      descripcion: 'Inspección Ocular'
    };
    
    component.tipoSelecionada(mockEvent);
    expect(component.mercanciaForm.get).toHaveBeenCalledWith('requisito');
    expect(mockControl.clearValidators).toHaveBeenCalled();
    expect(mockControl.setValue).toHaveBeenCalledWith('');
    expect(mockControl.updateValueAndValidity).toHaveBeenCalled();
  });

  it('should run #limpiarAnimalesVivo()', async () => {
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.reset = jest.fn();
    component.limpiarAnimalesVivo();
    expect(component.mercanciaForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.cerrar = component.cerrar || {};
    component.cerrar.emit = jest.fn();
    component.cancelar();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('should run #agregarAnimales()', async () => {
    component.agregarDatosFormulario = component.agregarDatosFormulario || {};
    component.agregarDatosFormulario.emit = jest.fn();
    component.mercanciaForm = component.mercanciaForm || {};
    component.mercanciaForm.getRawValue = jest.fn();
    component.cerrar = component.cerrar || {};
    component.cerrar.emit = jest.fn();
    component.agregarAnimales();
    expect(component.agregarDatosFormulario.emit).toHaveBeenCalled();
    expect(component.mercanciaForm.getRawValue).toHaveBeenCalled();
    expect(component.cerrar.emit).toHaveBeenCalled();
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