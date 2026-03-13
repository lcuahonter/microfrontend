// @ts-nocheck
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  Directive,
  Injectable,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
  Pipe,
  PipeTransform
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; 
import { Observable, of as observableOf } from 'rxjs';

import { ValidacionesFormularioService } from '@ng-mf/data-access-user';

import { Tramite240107Query } from '../../estados/tramite240107Query.query';
import { Tramite240107Store } from '../../estados/tramite240107Store.store';
import { DatosDelTramiteContenedoraComponent } from './datos-del-tramite-contenedora.component';

class MockActivatedRoute {
  snapshot = {
    params: {}
  };
}

@Injectable()
class MockTramite240107Query {}

@Injectable()
class MockTramite240107Store {}

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

describe('DatosDelTramiteContenedoraComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DatosDelTramiteContenedoraComponent ],
      declarations: [
        TranslatePipe, PhoneNumberPipe, SafeHtmlPipe,
        MyCustomDirective
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite240107Query, useClass: MockTramite240107Query },
        { provide: Tramite240107Store, useClass: MockTramite240107Store },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        ValidacionesFormularioService
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DatosDelTramiteContenedoraComponent);
    component = fixture.debugElement.componentInstance;
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

  it('should run #ngOnInit()', async () => {
    component.crearFormCombinacion = jest.fn();
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getMercanciaTablaDatos$ = observableOf({});
    component.tramiteQuery.getDatosDelTramite$ = observableOf({});
    component.ngOnInit();
    expect(component.crearFormCombinacion).toHaveBeenCalled();
  });

  it('should run #isValid()', async () => {
    component.validacionesService = component.validacionesService || {};
    component.validacionesService.isValid = jest.fn();
    component.isValid({});
    expect(component.validacionesService.isValid).toHaveBeenCalled();
  });

  it('should run #crearFormCombinacion()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormCombinacion();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #updateDatosDelTramiteFormulario()', async () => {
    component.tramiteStore = component.tramiteStore || {};
    component.tramiteStore.updateDatosDelTramiteFormState = jest.fn();
    component.updateDatosDelTramiteFormulario({});
    expect(component.tramiteStore.updateDatosDelTramiteFormState).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.unsubscribe$ = component.unsubscribe$ || {};
    component.unsubscribe$.next = jest.fn();
    component.unsubscribe$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

});
