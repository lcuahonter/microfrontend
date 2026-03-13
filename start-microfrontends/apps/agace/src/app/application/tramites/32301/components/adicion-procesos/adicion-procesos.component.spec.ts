// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { AdicionProcesosComponent } from './adicion-procesos.component';
import { FormBuilder } from '@angular/forms';
import { Tramite32301Store } from '../../estados/tramite32301.store';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite32301Store {}

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

describe('AdicionProcesosComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule,AdicionProcesosComponent,HttpClientTestingModule ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite32301Store, useClass: MockTramite32301Store },
        { provide: Tramite32301Query, useClass: MockTramite32301Query },
        ConsultaioQuery
      ]
    }).overrideComponent(AdicionProcesosComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(AdicionProcesosComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarEstadoFormulario = jest.fn();
    component.ngOnInit();
  });

  it('should run #inicializarEstadoFormulario()', async () => {
    component.guardarDatosFormulario = jest.fn();
    component.inicializarFormulario = jest.fn();
    component.inicializarEstadoFormulario();
  });

  it('should run #guardarDatosFormulario()', async () => {
    component.inicializarFormulario = jest.fn();
    component.proveedorXtranjForm = component.proveedorXtranjForm || {};
    component.proveedorXtranjForm.disable = jest.fn();
    component.proveedorXtranjForm.enable = jest.fn();
    component.guardarDatosFormulario();
  });

  it('should run #inicializarFormulario()', async () => {
    component.inicializaProveedorExtranjer = jest.fn();
    component.Tramite32301Query = component.Tramite32301Query || {};
    component.Tramite32301Query.select = jest.fn().mockReturnValue(observableOf({}));
    component.crearFormProveedorExtranjer = jest.fn();
    component.inicializarFormulario();
  });

  it('should run #inicializaProveedorExtranjer()', async () => {
    component.store = component.store || {};
    component.store.setRegistrosProveedoresExtranjeros = jest.fn();
    component.inicializaProveedorExtranjer();
  });

  it('should run #crearFormProveedorExtranjer()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.proveedorExtranjero = component.proveedorExtranjero || {};
    component.proveedorExtranjero.archivoExtranjero = 'archivoExtranjero';
    component.proveedorExtranjero.registrosProveedoresExtranjeros = 'registrosProveedoresExtranjeros';
    component.crearFormProveedorExtranjer();
  });

  it('should run #onFileSelected()', async () => {
    component.proveedorXtranjForm = component.proveedorXtranjForm || {};
    component.proveedorXtranjForm.patchValue = jest.fn();
    component.proveedorXtranjForm.get = jest.fn().mockReturnValue({
      updateValueAndValidity: function() {}
    });
    component.openCargaExtranjeroModel = jest.fn();
    component.onFileSelected({
      target: {
        files: {}
      }
    });
    expect(component.openCargaExtranjeroModel).toHaveBeenCalled();
  });

  it('should run #openCargaExtranjeroModel()', async () => {

    component.openCargaExtranjeroModel();

  });

  it('should run #ngOnDestroy()', async () => {
    component.destroy$ = component.destroy$ || {};
    component.destroy$.next = jest.fn();
    component.destroy$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  it('should run #onCambioDeArchivo()', async () => {
    component.abrirModal = jest.fn();
    component.onCambioDeArchivo({
      target: {
        files: {
          0: {
            name: {}
          },
          length: {}
        }
      }
    });
  });

  it('should run #abrirModal()', async () => {

    component.abrirModal();

  });

  it('should run #activarSeleccionArchivo()', async () => {

    component.activarSeleccionArchivo();

  });

});