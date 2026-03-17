// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input, Output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { DescripcionDelCupoComponent } from './descripcion-del-cupo.component';
import { FormBuilder } from '@angular/forms';
import { AsignacionDirectaCupoPersonasFisicasPrimeraVezService } from '../../services/asignacion-directa-cupo-personas-fisicas-primera-vez.service';
import { HttpClient,HttpClientModule } from '@angular/common/http';

@Injectable()
class MockAsignacionDirectaCupoPersonasFisicasPrimeraVezService {
  getDescripcionDelCupo() {
    return observableOf({});
  }
}


describe('DescripcionDelCupoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, DescripcionDelCupoComponent, HttpClientModule],
      declarations: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AsignacionDirectaCupoPersonasFisicasPrimeraVezService, useClass: MockAsignacionDirectaCupoPersonasFisicasPrimeraVezService }
      ]
    }).overrideComponent(DescripcionDelCupoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(DescripcionDelCupoComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.crearFormulario = jest.fn();
    component.loadDescripcionDelCupo = jest.fn();
    component.ngOnInit();
    // expect(component.crearFormulario).toHaveBeenCalled();
    // expect(component.loadDescripcionDelCupo).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyed$ = component.destroyed$ || {};
    component.destroyed$.next = jest.fn();
    component.destroyed$.complete = jest.fn();
    component.ngOnDestroy();
    // expect(component.destroyed$.next).toHaveBeenCalled();
    // expect(component.destroyed$.complete).toHaveBeenCalled();
  });

  it('should run #crearFormulario()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormulario();
    // expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #loadDescripcionDelCupo()', async () => {
    component.form = component.form || {};
    component.form.patchValue = jest.fn();
    component.data = component.data || {};
    component.data.claveDelCupo = 'claveDelCupo';
    component.data.mecanismoDeAsignacion = 'mecanismoDeAsignacion';
    component.data.descripcionDelProducto = 'descripcionDelProducto';
    component.data.unidadDeMedida = 'unidadDeMedida';
    component.data.regimenAduanero = 'regimenAduanero';
    component.data.fechaDeInicioDeVigenciaDelCupo = 'fechaDeInicioDeVigenciaDelCupo';
    component.data.fechaDeFinDeVigenciaDelCupo = 'fechaDeFinDeVigenciaDelCupo';
    component.data.fraccionesArancelarias = 'fraccionesArancelarias';
    component.data.tratadoAcuerdo = 'tratadoAcuerdo';
    component.data.paises = 'paises';
    component.loadDescripcionDelCupo();
    // expect(component.form.patchValue).toHaveBeenCalled();
  });

});