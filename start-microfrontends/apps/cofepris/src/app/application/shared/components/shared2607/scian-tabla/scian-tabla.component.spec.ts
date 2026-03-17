// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { ScianTablaComponent } from './scian-tabla.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockDatosSolicitudService {
  obtenerRespuestaPorUrl = function() {};
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

describe('ScianTablaComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule, ScianTablaComponent],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        Location,
        { provide: DatosSolicitudService, useClass: MockDatosSolicitudService }
      ]
    }).overrideComponent(ScianTablaComponent, {

      set: { providers: [{ provide: DatosSolicitudService, useClass: MockDatosSolicitudService }] }    
    }).compileComponents();
    fixture = TestBed.createComponent(ScianTablaComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.ngOnInit();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #claveSelecionada()', async () => {
    const mockEvent = { id: 1, descripcion: 'Test SCIAN' };
    component.scianLista = [
      { id: 1, descripcion: 'Test SCIAN' },
      { id: 2, descripcion: 'Another SCIAN' }
    ];
    component.scianForm = component.scianForm || {};
    component.scianForm.patchValue = jest.fn();
    component.claveSelecionada(mockEvent);
    expect(component.scianForm.patchValue).toHaveBeenCalledWith({
      scianNino: 1
    });
  });

  it('should run #agregarScian()', async () => {
    component.scianForm = component.scianForm || {};
    component.scianForm.invalid = false; // Set form as valid
    component.scianForm.get = jest.fn().mockReturnValue({
      value: 'test-value'
    });
    component.scianNinoLista = [
      { id: 1, descripcion: 'Test SCIAN Description' }
    ];
    component.scianSeleccionado = component.scianSeleccionado || {};
    component.scianSeleccionado.emit = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.agregarScian();
    expect(component.scianForm.get).toHaveBeenCalledWith('scianNino');
    expect(component.scianSeleccionado.emit).toHaveBeenCalledWith({
      clave: 'Test SCIAN Description',
      descripcion: 'test-value'
    });
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #limpiarScian()', async () => {
    component.scianForm = component.scianForm || {};
    component.scianForm.reset = jest.fn();
    component.limpiarScian();
    expect(component.scianForm.reset).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

});