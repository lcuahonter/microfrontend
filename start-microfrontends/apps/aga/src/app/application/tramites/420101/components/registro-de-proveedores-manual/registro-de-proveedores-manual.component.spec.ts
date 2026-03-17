// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { RegistroDeProveedoresManualComponent } from './registro-de-proveedores-manual.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Tramite420101Query } from '../../estados/tramite420101Query.query';
import { Tramite420101Store } from '../../estados/tramite420101Store.store';
import { RegistrarProveedoresService } from '../../service/registrar-proveedores.service';

@Injectable()
class MockTramite420101Query {}

@Injectable()
class MockTramite420101Store {}

@Injectable()
class MockRegistrarProveedoresService {}

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

describe('RegistroDeProveedoresManualComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, RegistroDeProveedoresManualComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        Location,
        { provide: Tramite420101Query, useClass: MockTramite420101Query },
        { provide: Tramite420101Store, useClass: MockTramite420101Store },
        { provide: RegistrarProveedoresService, useClass: MockRegistrarProveedoresService }
      ]
    }).overrideComponent(RegistroDeProveedoresManualComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RegistroDeProveedoresManualComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite420101Query = component.tramite420101Query || {};
    component.tramite420101Query.select = jest.fn().mockReturnValue({
      0: {
        usoCrossListDatos: {}
      },
      pipe: function() {
        return observableOf({});
      }
    });
    component.iniciarProveedore = jest.fn();
    component.getProveedoresManual = jest.fn();
    component.ngOnInit();
    expect(component.tramite420101Query.select).toHaveBeenCalled();
    expect(component.iniciarProveedore).toHaveBeenCalled();
    expect(component.getProveedoresManual).toHaveBeenCalled();
  });

  it('should run #getProveedoresManual()', async () => {
    component.registrarProveedoresService = component.registrarProveedoresService || {};
    component.registrarProveedoresService.proveedoresManual = jest.fn().mockReturnValue(observableOf({}));
    component.proveedoreForm = component.proveedoreForm || {};
    component.proveedoreForm.patchValue = jest.fn();
    component.getProveedoresManual();
    expect(component.registrarProveedoresService.proveedoresManual).toHaveBeenCalled();
    expect(component.proveedoreForm.patchValue).toHaveBeenCalled();
  });

  it('should run #iniciarProveedore()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.iniciarProveedore();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #agregarProveedore()', async () => {
    component.proveedoreForm = component.proveedoreForm || {};
    component.proveedoreForm.get = jest.fn().mockReturnValue({
      value: {}
    });
    component.tramite420101Store = component.tramite420101Store || {};
    component.tramite420101Store.updateProveedoresTabla = jest.fn();
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.agregarProveedore();
    expect(component.proveedoreForm.get).toHaveBeenCalled();
    expect(component.tramite420101Store.updateProveedoresTabla).toHaveBeenCalled();
    expect(component.ubicaccion.back).toHaveBeenCalled();
  });

  it('should run #cancelar()', async () => {
    component.ubicaccion = component.ubicaccion || {};
    component.ubicaccion.back = jest.fn();
    component.cancelar();
    expect(component.ubicaccion.back).toHaveBeenCalled();
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