// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { FolioComponent } from './folio.component';
import { FormBuilder } from '@angular/forms';
import { Tramite240321Store } from '../../estados/tramite240321Store.store';
import { Tramite240321Query } from '../../estados/tramite240321Query.query';
import { ModificacionService } from '../../services/modificacion.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite240321Store {
  getValue = function() {};
}

@Injectable()
class MockTramite240321Query {}

@Injectable()
class MockModificacionService {}

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

describe('FolioComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: Tramite240321Store, useClass: MockTramite240321Store },
        { provide: Tramite240321Query, useClass: MockTramite240321Query },
        { provide: ModificacionService, useClass: MockModificacionService }
      ]
    }).overrideComponent(FolioComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(FolioComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.inicializarFormularioInfoRegistro = jest.fn();
    component.initializeFormFromStore = jest.fn();
    component.ngOnInit();
    expect(component.inicializarFormularioInfoRegistro).toHaveBeenCalled();
    expect(component.initializeFormFromStore).toHaveBeenCalled();
  });

  it('should run #initializeFormFromStore()', async () => {
    component.tramiteQuery = component.tramiteQuery || {};
    component.tramiteQuery.getFolio$ = observableOf({});
    component.formularioInfoRegistro = component.formularioInfoRegistro || {};
    component.formularioInfoRegistro.patchValue = jest.fn();
    component.tramiteState = component.tramiteState || {};
    component.tramiteState.folio = 'folio';
    component.initializeFormFromStore();
    expect(component.formularioInfoRegistro.patchValue).toHaveBeenCalled();
  });

  it('should run #inicializarFormularioInfoRegistro()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.inicializarFormularioInfoRegistro();
    expect(component.fb.group).toHaveBeenCalled();
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