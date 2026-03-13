// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite260209Query } from '../../estados/tramite260209Query.query';
import { Tramite260209Store } from '../../estados/tramite260209Store.store';
import { HttpClientModule } from '@angular/common/http';


@Injectable()
class MockTramite260209Query {
  getTabSeleccionado$ = observableOf(2);
}

@Injectable()
class MockTramite260209Store {}

@Injectable()
class MockConsultaioQuery {
  selectConsultaioState$ = observableOf({ procedureId: '260209', update: false });
}


describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, HttpClientModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        { provide: Tramite260209Query, useClass: MockTramite260209Query },
        { provide: Tramite260209Store, useClass: MockTramite260209Store },
        { provide: 'ConsultaioQuery', useClass: MockConsultaioQuery }
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite260209Store = component.tramite260209Store || {};
    component.tramite260209Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    expect(component.tramite260209Store.updateTabSeleccionado).toHaveBeenCalled();
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