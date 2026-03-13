// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Tramite240101Store } from '../../estados/tramite240101Store.store'; // <-- Ensure this path is correct
import { Tramite240101Query } from '../../estados/tramite240101Query.query'; // <-- Ensure this path is correct
// If the files do not exist at this path, update the path accordingly or create stub files to resolve the import error.
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of, Subject } from 'rxjs';
import { DestinoFinal, Proveedor } from '../../../../shared/models/terceros-relacionados.model';

describe('TercerosRelacionadosContenedoraComponent', () => {
  let component: TercerosRelacionadosContenedoraComponent;
  let fixture: ComponentFixture<TercerosRelacionadosContenedoraComponent>;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let consultaQueryMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    tramiteStoreMock = {
      setDestinatarioFinalTablaDatos: jest.fn(),
      setProveedorTablaDatos: jest.fn(),
      actualizarDatosDestinatario: jest.fn(),
      actualizarDatosProveedor: jest.fn(),
      eliminarDestinatarioFinal: jest.fn(),
      eliminarProveedorFinal: jest.fn(),
    };

    tramiteQueryMock = {
      getDestinatarioFinalTablaDatos$: of([]),
      getProveedorTablaDatos$: of([]),
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    activatedRouteMock = {};

    await TestBed.resetTestingModule().configureTestingModule({
      imports: [TercerosRelacionadosContenedoraComponent],
      providers: [
        { provide: Tramite240101Store, useValue: tramiteStoreMock },
        { provide: Tramite240101Query, useValue: tramiteQueryMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
    component = fixture.componentInstance;
  });


  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to observables and update destinatarioFinalTablaDatos and proveedorTablaDatos on ngOnInit', () => {
    const destinatarios = [{ nombre: 'A' }, { nombre: 'B' }];
    const proveedores = [{ nombre: 'P1' }, { nombre: 'P2' }];
    tramiteQueryMock.getDestinatarioFinalTablaDatos$ = of(destinatarios);
    tramiteQueryMock.getProveedorTablaDatos$ = of(proveedores);
    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.destinatarioFinalTablaDatos.length).toBe(2);
    expect(component.proveedorTablaDatos.length).toBe(2);
  });

    it('should call next and complete on unsubscribe$ when ngOnDestroy is called', () => {
    const nextSpy = jest.spyOn((component as any).unsubscribe$, 'next');
    const completeSpy = jest.spyOn((component as any).unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

});