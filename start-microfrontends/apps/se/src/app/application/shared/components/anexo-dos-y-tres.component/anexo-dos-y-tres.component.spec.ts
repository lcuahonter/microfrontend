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
import { AnexoDosYTresComponent } from './anexo-dos-y-tres.component';
import { FormBuilder } from '@angular/forms';

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

describe('AnexoDosYTresComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, AnexoDosYTresComponent],
      declarations: [
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [FormBuilder],
    })
      .overrideComponent(AnexoDosYTresComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(AnexoDosYTresComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #crearFormularioAnexoDos()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormularioAnexoDos();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #crearFormularioAnexoTres()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormularioAnexoTres();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('should run #eliminarAnexoDos()', async () => {
    component.anexoDosTablaLista = component.anexoDosTablaLista || {};
    component.anexoDosTablaLista = ['anexoDosTablaLista'];
    component.obtenerAnexoDosDevolverLaLlamada =
      component.obtenerAnexoDosDevolverLaLlamada || {};
    component.obtenerAnexoDosDevolverLaLlamada.emit = jest.fn();
    component.eliminarAnexoDos();
    expect(component.obtenerAnexoDosDevolverLaLlamada.emit).toHaveBeenCalled();
  });

  it('should run #agregarAnexoDos()', async () => {
    component.anexoDosFormGroup = component.anexoDosFormGroup || {};
    component.anexoDosFormGroup.get = jest.fn().mockReturnValue({
      value: {},
    });
    component.anexoDosTablaLista = component.anexoDosTablaLista || {};
    component.anexoDosTablaLista.push = jest.fn();
    component.obtenerAnexoDosDevolverLaLlamada =
      component.obtenerAnexoDosDevolverLaLlamada || {};
    component.obtenerAnexoDosDevolverLaLlamada.emit = jest.fn();
    component.agregarAnexoDos();
    expect(component.anexoDosFormGroup.get).toHaveBeenCalled();
    expect(component.anexoDosTablaLista.push).toHaveBeenCalled();
    expect(component.obtenerAnexoDosDevolverLaLlamada.emit).toHaveBeenCalled();
  });

  it('should run #eliminarAnexoTres()', async () => {
    component.anexoDosTablaLista = component.anexoDosTablaLista || {};
    component.anexoDosTablaLista = ['anexoDosTablaLista'];
    component.obtenerAnexoTresDevolverLaLlamada =
      component.obtenerAnexoTresDevolverLaLlamada || {};
    component.obtenerAnexoTresDevolverLaLlamada.emit = jest.fn();
    component.eliminarAnexoTres();
    expect(component.obtenerAnexoTresDevolverLaLlamada.emit).toHaveBeenCalled();
  });

  it('should run #agregarAnexoTres()', async () => {
    component.anexoTresFormGroup = component.anexoTresFormGroup || {};
    component.anexoTresFormGroup.get = jest.fn().mockReturnValue({
      value: {},
    });
    component.anexoTresTablaLista = component.anexoTresTablaLista || {};
    component.anexoTresTablaLista.push = jest.fn();
    component.obtenerAnexoTresDevolverLaLlamada =
      component.obtenerAnexoTresDevolverLaLlamada || {};
    component.obtenerAnexoTresDevolverLaLlamada.emit = jest.fn();
    component.agregarAnexoTres();
    expect(component.anexoTresFormGroup.get).toHaveBeenCalled();
    expect(component.anexoTresTablaLista.push).toHaveBeenCalled();
    expect(component.obtenerAnexoTresDevolverLaLlamada.emit).toHaveBeenCalled();
  });

  it('should run #setAnexoTresLista() and update the list correctly', async () => {
    const event = [
      {
        ENCABEZADO_FRACCION: '001',
        ENCABEZADO_DESCRIPCION: 'Description 1',
        estatus: false,
      },
      {
        ENCABEZADO_FRACCION: '002',
        ENCABEZADO_DESCRIPCION: 'Description 2',
        estatus: false,
      },
    ];
    component.anexoTresTablaLista = [
      {
        ENCABEZADO_FRACCION: '001',
        ENCABEZADO_DESCRIPCION: 'Description 1',
        estatus: false,
      },
      {
        ENCABEZADO_FRACCION: '003',
        ENCABEZADO_DESCRIPCION: 'Description 3',
        estatus: false,
      },
    ];
    component.obtenerAnexoTresDevolverLaLlamada =
      component.obtenerAnexoTresDevolverLaLlamada || {};
    component.obtenerAnexoTresDevolverLaLlamada.emit = jest.fn();
    component.setAnexoTresLista(event);
    expect(component.anexoTresTablaLista[0].estatus).toBe(true);
    expect(component.anexoTresTablaLista[1].estatus).toBe(true);
    expect(
      component.obtenerAnexoTresDevolverLaLlamada.emit
    ).toHaveBeenCalledWith(component.anexoTresTablaLista);
  });

  it('should run #setAnexoDosLista() and update the list correctly', async () => {
    const event = [
      {
        ENCABEZADO_FRACCION: '001',
        ENCABEZADO_DESCRIPCION: 'Description 1',
        estatus: true,
      },
      {
        ENCABEZADO_FRACCION: '002',
        ENCABEZADO_DESCRIPCION: 'Description 2',
        estatus: false,
      },
    ];
    component.anexoDosTablaLista = [
      {
        ENCABEZADO_FRACCION: '001',
        ENCABEZADO_DESCRIPCION: 'Description 1',
        estatus: true,
      },
      {
        ENCABEZADO_FRACCION: '003',
        ENCABEZADO_DESCRIPCION: 'Description 3',
        estatus: false,
      },
    ];
    component.obtenerAnexoDosDevolverLaLlamada =
      component.obtenerAnexoDosDevolverLaLlamada || {};
    component.obtenerAnexoDosDevolverLaLlamada.emit = jest.fn();
    component.setAnexoDosLista(event);
    expect(component.anexoDosTablaLista[0].estatus).toBe(true);
    expect(component.anexoDosTablaLista[1].estatus).toBe(true);
    expect(
      component.obtenerAnexoDosDevolverLaLlamada.emit
    ).toHaveBeenCalledWith(component.anexoDosTablaLista);
  });

  it('should run #eliminarAnexoDos() and remove items without status', async () => {
    component.anexoDosTablaLista = [
      {
        ENCABEZADO_FRACCION: '001',
        ENCABEZADO_DESCRIPCION: 'Description 1',
        estatus: true,
      },
      {
        ENCABEZADO_FRACCION: '002',
        ENCABEZADO_DESCRIPCION: 'Description 2',
        estatus: false,
      },
    ];
    component.obtenerAnexoDosDevolverLaLlamada =
      component.obtenerAnexoDosDevolverLaLlamada || {};
    component.obtenerAnexoDosDevolverLaLlamada.emit = jest.fn();
    component.eliminarAnexoDos();
    expect(component.anexoDosTablaLista.length).toBe(1);
    expect(component.anexoDosTablaLista[0].ENCABEZADO_FRACCION).toBe('002');
    expect(
      component.obtenerAnexoDosDevolverLaLlamada.emit
    ).toHaveBeenCalledWith(component.anexoDosTablaLista);
  });

  it('should run #eliminarAnexoTres() and remove items without status', async () => {
    component.anexoTresTablaLista = [
      {
        ENCABEZADO_FRACCION: '001',
        ENCABEZADO_DESCRIPCION: 'Description 1',
        estatus: true,
      },
      {
        ENCABEZADO_FRACCION: '002',
        ENCABEZADO_DESCRIPCION: 'Description 2',
        estatus: false,
      },
    ];
    component.obtenerAnexoTresDevolverLaLlamada =
      component.obtenerAnexoTresDevolverLaLlamada || {};
    component.obtenerAnexoTresDevolverLaLlamada.emit = jest.fn();
    component.eliminarAnexoTres();
    expect(component.anexoTresTablaLista.length).toBe(1);
    expect(component.anexoTresTablaLista[0].ENCABEZADO_FRACCION).toBe('002');
    expect(
      component.obtenerAnexoTresDevolverLaLlamada.emit
    ).toHaveBeenCalledWith(component.anexoTresTablaLista);
  });

  it('should run #agregarAnexoDos() and add a new item correctly', async () => {
    component.anexoDosFormGroup = component.anexoDosFormGroup || {};
    component.anexoDosFormGroup.get = jest.fn().mockReturnValue({
      value: 'test value',
    });
    component.anexoDosTablaLista = [];
    component.obtenerAnexoDosDevolverLaLlamada =
      component.obtenerAnexoDosDevolverLaLlamada || {};
    component.obtenerAnexoDosDevolverLaLlamada.emit = jest.fn();
    component.agregarAnexoDos();
    expect(component.anexoDosFormGroup.get).toHaveBeenCalledWith(
      'fraccionArancelaria'
    );
    expect(component.anexoDosFormGroup.get).toHaveBeenCalledWith('descripcion');
    expect(component.anexoDosTablaLista.length).toBe(1);
    expect(component.anexoDosTablaLista[0].estatus).toBe(false);
    expect(
      component.obtenerAnexoDosDevolverLaLlamada.emit
    ).toHaveBeenCalledWith(component.anexoDosTablaLista);
  });

  it('should run #agregarAnexoTres() and add a new item correctly', async () => {
    component.anexoTresFormGroup = component.anexoTresFormGroup || {};
    component.anexoTresFormGroup.get = jest.fn().mockReturnValue({
      value: 'test value',
    });
    component.anexoTresTablaLista = [];
    component.obtenerAnexoTresDevolverLaLlamada =
      component.obtenerAnexoTresDevolverLaLlamada || {};
    component.obtenerAnexoTresDevolverLaLlamada.emit = jest.fn();
    component.agregarAnexoTres();
    expect(component.anexoTresFormGroup.get).toHaveBeenCalledWith(
      'fraccionArancelaria'
    );
    expect(component.anexoTresFormGroup.get).toHaveBeenCalledWith(
      'descripcion'
    );
    expect(component.anexoTresTablaLista.length).toBe(1);
    expect(component.anexoTresTablaLista[0].estatus).toBe(false);
    expect(
      component.obtenerAnexoTresDevolverLaLlamada.emit
    ).toHaveBeenCalledWith(component.anexoTresTablaLista);
  });
});
