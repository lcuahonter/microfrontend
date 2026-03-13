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
import { FederatariosYPlantasComponent } from './federatarios-y-plantas.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { Modal } from 'bootstrap';
@Injectable()
class MockRouter {
  navigate() {}
}

describe('FederatariosYPlantasComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({}),
          },
        },
      ],
    })
      .overrideComponent(FederatariosYPlantasComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(FederatariosYPlantasComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('debe ejecutar #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('debe ejecutar #initFederatariosFormGroup()', async () => {
    component.initFederatariosFormGroup();
  });

  it('debe ejecutar #irAAcciones()', async () => {
    component.router = component.router || {};
    component.router.navigate = jest.fn();
    component.irAAcciones({});
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('debe ejecutar #aggregarDatos()', async () => {
    component.datosFormaFedratario = component.datosFormaFedratario || {};
    component.datosFormaFedratario.emit = jest.fn();
    component.federatariosFormGroup = component.federatariosFormGroup || {};
    component.federatariosFormGroup.value = 'value';
    component.aggregarDatos();
    expect(component.datosFormaFedratario.emit).toHaveBeenCalled();
  });

  it('debe inicializar federatariosFormGroup', () => {
    component.initFederatariosFormGroup();
    expect(component.federatariosFormGroup.contains('nombre')).toBe(true);
    expect(component.federatariosFormGroup.contains('estado')).toBe(true);
  });

  it('debe inicializar expresasFormGroup', () => {
    component.initExpresasFormGroup();
    expect(component.expresasFormGroup.contains('taxId')).toBe(true);
    expect(component.expresasFormGroup.contains('pais')).toBe(true);
  });

  it('debe navegar a la ruta dada en irAAcciones()', () => {
  const router = TestBed.inject(Router);
  const routerSpy = jest.spyOn(router, 'navigate');
  const path = 'some-path';
  component.irAAcciones(path);
  expect(routerSpy).toHaveBeenCalledWith([path], {
    relativeTo: TestBed.inject(ActivatedRoute),
  });
});


  it('debe emitir los datos del formulario de federatario en aggregarDatos()', () => {
    const emitSpy = jest.spyOn(component.datosFormaFedratario, 'emit');
    component.federatariosFormGroup.setValue({
      nombre: 'John',
      fechaInicioInput: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeActa: '',
      numeroDeNotaria: '',
      estado: '',
      estadoOptions: '',
    });
    component.aggregarDatos();
    expect(emitSpy).toHaveBeenCalledWith(component.federatariosFormGroup.value);
  });

  it('debe agregar datos a expresasDatos en aggregarExpresasDatos()', () => {
    component.expresasFormGroup.setValue({
      taxId: '123',
      nombreDelEmpresa: 'Empresa S.A.',
      pais: 'MX',
      direccion: 'Calle 123',
    });
    component.aggregarExpresasDatos();
    expect(component.expresasDatos.length).toBe(1);
    expect(component.expresasDatos[0].taxId).toBe('123');
  });

  describe('Métodos de apertura modales', () => {
    it('debe abrir el modal complementarPlanta', () => {
      const modalEl = document.createElement('div');
      document.body.appendChild(modalEl);
      component.modalElement = new ElementRef(modalEl);
      const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
      component.abrirDialogoComplementarPlanta();
      expect(modalSpy).toHaveBeenCalled();
      modalSpy.mockRestore();
    });

    it('debe abrir el modal montos', () => {
      const modalEl = document.createElement('div');
      document.body.appendChild(modalEl);
      component.montos = new ElementRef(modalEl);
      const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
      component.abrirDialogoMontos();
      expect(modalSpy).toHaveBeenCalled();
      modalSpy.mockRestore();
    });

    it('debe abrir el modal empleadosAcciones', () => {
      const modalEl = document.createElement('div');
      document.body.appendChild(modalEl);
      component.empleadosAcciones = new ElementRef(modalEl);
      const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
      component.abrirDialogoempleadosAcciones();
      expect(modalSpy).toHaveBeenCalled();
      modalSpy.mockRestore();
    });

    it('debe abrir el modal capacidadInstalada', () => {
      const modalEl = document.createElement('div');
      document.body.appendChild(modalEl);
      component.capacidadInstalada = new ElementRef(modalEl);
      const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
      component.abrirDialogocapacidadInstalada();
      expect(modalSpy).toHaveBeenCalled();
      modalSpy.mockRestore();
    });

    it('debe abrir el modal cargaPorArchivo', () => {
      const modalEl = document.createElement('div');
      document.body.appendChild(modalEl);
      component.cargaPorPrchivo = new ElementRef(modalEl);
      const modalSpy = jest.spyOn(Modal.prototype, 'show').mockImplementation(() => {});
      component.abrirDialogocargaPorPrchivo();
      expect(modalSpy).toHaveBeenCalled();
      modalSpy.mockRestore();
    });
  });
});
