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
  NgModule,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf, throwError } from 'rxjs';

import { Component } from '@angular/core';
import { SolicitanteComponent } from './solicitante.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';

import { provideHttpClientTesting } from '@angular/common/http/testing';


jest.mock('@libs/shared/theme/assets/json/40101/solicitante-mockdata.json', () => ({

  "rfc": "AAL0409235E6",
  "denominacion": "AGRICOLA ALPE S DE RL DE CV",
  "actividadEconomica": "Siembra, cultivo y cosecha de papa",
  "correoElectronico": "vucem2.5@hotmail.com",
  "pais": "Mexico",
  "codigoPostal": "25000",
  "estado": "Coahuila",
  "municipioOAlcadia": "Saltillo",
  "localidad": "Saltillo",
  "colonia": "Centro",
  "calle": "Avenida Juarez",
  "numeroExterior": "123",
  "numeroInterior": "1",
  "telefono": "1234567890"
}));

describe('SolicitanteComponent', () => {
  let fixture: ComponentFixture<SolicitanteComponent>;
  let component: SolicitanteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitanteComponent],
      imports: [TituloComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    if (!component.formBuilder && TestBed.inject(FormBuilder)) {
      component.formBuilder = TestBed.inject(FormBuilder);
    }
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize solicitudForm with all controls on ngOnInit', async () => {
    
    component.ngOnInit();
    expect(component.solicitudForm).toBeDefined();
    const controls = [
      'rfc',
      'denominacion',
      'actividadEconomica',
      'correoElectronico',
      'pais',
      'codigoPostal',
      'estado',
      'municipioOAlcadia',
      'localidad',
      'colonia',
      'calle',
      'numeroExterior',
      'numeroInterior',
      'lada',
      'telefono',
    ];
    controls.forEach(control => {
      expect(component.solicitudForm.contains(control)).toBe(true);
    });
  });

  it('should call setFormValues on ngOnInit', () => {
    const setFormValuesSpy = jest.spyOn(component, 'setFormValues');
    component.ngOnInit();
    expect(setFormValuesSpy).toHaveBeenCalled();
  });

  it('should set all form values from mockData', async () => {
    const { SolicitanteComponent } = await import('./solicitante.component');
    const mockDataTest = await import('@libs/shared/theme/assets/json/40101/solicitante-mockdata.json');
    const { FormBuilder } = await import('@angular/forms');

    component.ngOnInit();
    component.setFormValues();

    expect(component.solicitudForm.get('rfc')?.value).toBe(mockDataTest.rfc);
    expect(component.solicitudForm.get('denominacion')?.value).toBe(mockDataTest.denominacion);
    expect(component.solicitudForm.get('actividadEconomica')?.value).toBe(mockDataTest.actividadEconomica);
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe(mockDataTest.correoElectronico);
    expect(component.solicitudForm.get('pais')?.value).toBe(mockDataTest.pais);
    expect(component.solicitudForm.get('codigoPostal')?.value).toBe(mockDataTest.codigoPostal);
    expect(component.solicitudForm.get('estado')?.value).toBe(mockDataTest.estado);
    expect(component.solicitudForm.get('municipioOAlcadia')?.value).toBe(mockDataTest.municipioOAlcadia);
    expect(component.solicitudForm.get('localidad')?.value).toBe(mockDataTest.localidad);
    expect(component.solicitudForm.get('colonia')?.value).toBe(mockDataTest.colonia);
    expect(component.solicitudForm.get('calle')?.value).toBe(mockDataTest.calle);
    expect(component.solicitudForm.get('numeroExterior')?.value).toBe(mockDataTest.numeroExterior);
    expect(component.solicitudForm.get('numeroInterior')?.value).toBe(mockDataTest.numeroInterior);
    expect(component.solicitudForm.get('telefono')?.value).toBe(mockDataTest.telefono);
  });
});