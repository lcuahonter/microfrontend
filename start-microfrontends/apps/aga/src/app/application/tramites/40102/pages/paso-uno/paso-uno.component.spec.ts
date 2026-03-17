// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { PasoUnoComponent } from './paso-uno.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Chofer40102Service } from '../../estados/chofer40102.service';
import { ConsultaioQuery } from '../../estados/consulta.query';



describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        {provide: HttpClient, useValue: provideHttpClientTesting()}
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  /**
   * Verifica que el componente se haya creado correctamente.
   */
  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifica que el método `ngAfterViewInit` funcione correctamente.
   */
  it('should run #ngAfterViewInit()', async () => {
    component.ngAfterViewInit();
  });

  /**
   * Verifica que el método `seleccionaTab` funcione correctamente.
   */
  it('should run #seleccionaTab()', async () => {
    component.seleccionaTab({});
  });
});

describe('#ngOnInit', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;
  let consultaQueryMock: any;
  let guardarDatosFormularioSpy: jest.Spy;
  let chofer40102ServiceMock: jest.Mocked<Chofer40102Service>;

  beforeEach(() => {
    chofer40102ServiceMock = {
      guardarDatosFormulario: jest.fn(),
      getDirectorGeneralData: jest.fn().mockReturnValue(observableOf({})),
      obtenerTablaDatos: jest.fn().mockReturnValue(observableOf([]))
    } as unknown as jest.Mocked<Chofer40102Service>;

    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule ],
      declarations: [
        PasoUnoComponent
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        {provide: HttpClient, useValue: provideHttpClientTesting()},
        {provide: Chofer40102Service, useValue: chofer40102ServiceMock}
      ]
    }).overrideComponent(PasoUnoComponent, {

  }).compileComponents();
  fixture = TestBed.createComponent(PasoUnoComponent);
  component = fixture.debugElement.componentInstance;

    consultaQueryMock = {
      selectConsultaioState$: observableOf({ update: false })
    };
    component['consultaQuery'] = consultaQueryMock;
    guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
  });

  it('should set esDatosRespuesta to true if consultaDatos.update is false', () => {
    consultaQueryMock.selectConsultaioState$ = observableOf({ update: false });
    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
    expect(guardarDatosFormularioSpy).not.toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if consultaDatos.update is true', () => {
    chofer40102ServiceMock.guardarDatosFormulario.mockReturnValue(observableOf({}));
    chofer40102ServiceMock.getDirectorGeneralData.mockReturnValue(observableOf({}));
    chofer40102ServiceMock.obtenerTablaDatos.mockReturnValue(observableOf([]));

    consultaQueryMock.selectConsultaioState$ = observableOf({ update: true });
    component.ngOnInit();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should assign consultaDatos from observable', () => {
    const state = { update: false, foo: 'bar' };
    consultaQueryMock.selectConsultaioState$ = observableOf(state);
    component.ngOnInit();
    expect(component.consultaDatos).toEqual(state);
  });
});