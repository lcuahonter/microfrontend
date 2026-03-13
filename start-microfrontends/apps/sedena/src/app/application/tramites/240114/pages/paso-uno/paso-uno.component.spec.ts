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
import { PasoUnoComponent } from './paso-uno.component';
import { Tramite240114Query } from '../../estados/tramite240114Query.query';
import { Tramite240114Store } from '../../estados/tramite240114Store.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';
@Injectable()
class MockTramite240114Query {}

@Injectable()
class MockTramite240114Store {}

describe('PasoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        PasoUnoComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite240114Query, useClass: MockTramite240114Query },
        { provide: Tramite240114Store, useClass: MockTramite240114Store },
        DatosSolicitudService,
      ],
    })
      .overrideComponent(PasoUnoComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = function () {};
    }
    fixture?.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite240114Query = component.tramite240114Query || {};
    component.tramite240114Query.getTabSeleccionado$ = observableOf({});
    component.ngOnInit();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite240114Store = component.tramite240114Store || {};
    component.tramite240114Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    // expect(component.tramite240114Store.updateTabSeleccionado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyNotifier$.next).toHaveBeenCalled();
    // expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
});
