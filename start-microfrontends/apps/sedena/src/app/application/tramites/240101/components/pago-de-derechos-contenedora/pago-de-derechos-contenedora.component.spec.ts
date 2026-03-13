// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { PagoDeDerechosContenedoraComponent } from './pago-de-derechos-contenedora.component';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { Tramite240101Query } from '../../estados/tramite240101Query.query';
import { Tramite240101Store } from '../../estados/tramite240101Store.store';
import { of, Subject } from 'rxjs';
import { PagoDerechosFormState } from '../../../../shared/models/pago-de-derechos.model';
import { CommonModule } from '@angular/common';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

describe('PagoDeDerechosContenedoraComponent', () => {
  let component: PagoDeDerechosContenedoraComponent;
  let fixture: ComponentFixture<PagoDeDerechosContenedoraComponent>;
  let tramiteQueryMock: any;
  let tramiteStoreMock: any;

  const mockFormState: PagoDerechosFormState = {
    // fill with minimal required mock properties
    // e.g. field1: 'value', field2: 123
  } as PagoDerechosFormState;

  beforeEach(async () => {
    tramiteQueryMock = {
      getPagoDerechos$: of(mockFormState)
    };
    tramiteStoreMock = {
      updatePagoDerechosFormState: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, PagoDeDerechosComponent, PagoDeDerechosContenedoraComponent],
      declarations: [],
      providers: [
        { provide: Tramite240101Query, useValue: tramiteQueryMock },
        { provide: Tramite240101Store, useValue: tramiteStoreMock },
        { provide: DatosSolicitudService, useValue: {} }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to tramiteQuery.getPagoDerechos$ on init and set pagoDerechoFormState', () => {
    component.ngOnInit();
    expect(component.pagoDerechoFormState).toEqual(mockFormState);
  });

  it('should call tramiteStore.updatePagoDerechosFormState when updatePagoDerechos is called', () => {
    const event = { ...mockFormState };
    component.updatePagoDerechos(event);
    expect(tramiteStoreMock.updatePagoDerechosFormState).toHaveBeenCalledWith(event);
  });

  it('should complete unsubscribe$ on destroy', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [CommonModule, PagoDeDerechosComponent, PagoDeDerechosContenedoraComponent],
      declarations: [],
      providers: [
        { provide: Tramite240101Query, useValue: tramiteQueryMock },
        { provide: Tramite240101Store, useValue: tramiteStoreMock },
        { provide: DatosSolicitudService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;

    const nextSpy = jest.spyOn((component as any).unsubscribe$, 'next');
    const completeSpy = jest.spyOn((component as any).unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should unsubscribe from observable on destroy', () => {
    const subject = new Subject<PagoDerechosFormState>();
    tramiteQueryMock.getPagoDerechos$ = subject.asObservable();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [CommonModule, PagoDeDerechosComponent, PagoDeDerechosContenedoraComponent],
      declarations: [],
      providers: [
        { provide: Tramite240101Query, useValue: tramiteQueryMock },
        { provide: Tramite240101Store, useValue: tramiteStoreMock },
        { provide: DatosSolicitudService, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosContenedoraComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    component.ngOnDestroy();
    expect((component as any).unsubscribe$.isStopped).toBe(true);
  });
});