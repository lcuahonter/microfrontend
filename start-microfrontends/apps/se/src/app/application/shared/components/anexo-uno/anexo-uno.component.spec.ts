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
import { AnexoUnoComponent } from './anexo-uno.component';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

@Injectable()
class MockRouter {
  navigate() {}
}

describe('AnexoUnoComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
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
      .overrideComponent(AnexoUnoComponent, {})
      .compileComponents();
    fixture = TestBed.createComponent(AnexoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function () {};
    fixture.destroy();
  });

  it('debe ejecutar #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('Debería ejecutar #crearFormularioAnexoUno()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormularioAnexoUno();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('Debería ejecutar #crearFormularioAnexoDos()', async () => {
    component.fb = component.fb || {};
    component.fb.group = jest.fn();
    component.crearFormularioAnexoDos();
    expect(component.fb.group).toHaveBeenCalled();
  });

  it('Debería ejecutar #eliminarAnexoUno()', async () => {
    component.anexoUnoTablaLista = component.anexoUnoTablaLista || {};
    component.anexoUnoTablaLista = ['anexoUnoTablaLista'];
    component.obtenerAnexoUnoDevolverLaLlamada =
      component.obtenerAnexoUnoDevolverLaLlamada || {};
    component.obtenerAnexoUnoDevolverLaLlamada.emit = jest.fn();
    component.eliminarAnexoUno();
    expect(component.obtenerAnexoUnoDevolverLaLlamada.emit).toHaveBeenCalled();
  });

  it('Debería ejecutar #eliminarAnexoDos()', async () => {
    component.anexoDosTablaLista = component.anexoDosTablaLista || {};
    component.anexoDosTablaLista = ['anexoDosTablaLista'];
    component.obtenerAnexoDosDevolverLaLlamada =
      component.obtenerAnexoDosDevolverLaLlamada || {};
    component.obtenerAnexoDosDevolverLaLlamada.emit = jest.fn();
    component.eliminarAnexoDos();
    expect(component.obtenerAnexoDosDevolverLaLlamada.emit).toHaveBeenCalled();
  });

  it('Debería ejecutar #agregarAnexoUno()', async () => {
    component.anexoUnoFormGroup = component.anexoUnoFormGroup || {};
    component.anexoUnoFormGroup.get = jest.fn().mockReturnValue({
      value: {},
    });
    component.anexoUnoFormGroup.reset = jest.fn();
    component.anexoUnoTablaLista = component.anexoUnoTablaLista || {};
    component.anexoUnoTablaLista.push = jest.fn();
    component.obtenerAnexoUnoDevolverLaLlamada =
      component.obtenerAnexoUnoDevolverLaLlamada || {};
    component.obtenerAnexoUnoDevolverLaLlamada.emit = jest.fn();
    component.agregarAnexoUno();
    expect(component.anexoUnoFormGroup.get).toHaveBeenCalled();
    // expect(component.anexoUnoFormGroup.reset).toHaveBeenCalled();
    // expect(component.anexoUnoTablaLista.push).toHaveBeenCalled();
    // expect(component.obtenerAnexoUnoDevolverLaLlamada.emit).toHaveBeenCalled();
  });

  it('Debería ejecutar #agregarAnexoDos()', async () => {
    component.anexoDosFormGroup = component.anexoDosFormGroup || {};
    component.anexoDosFormGroup.get = jest.fn().mockReturnValue({
      value: {},
    });
    component.anexoDosTablaLista = component.anexoDosTablaLista || {};
    component.anexoDosTablaLista.push = jest.fn();
    component.obtenerAnexoDosDevolverLaLlamada =
      component.obtenerAnexoDosDevolverLaLlamada || {};
    component.obtenerAnexoDosDevolverLaLlamada.emit = jest.fn();
    component.anexoUnoFormGroup = component.anexoUnoFormGroup || {};
    component.anexoUnoFormGroup.reset = jest.fn();
    component.agregarAnexoDos();
    expect(component.anexoDosFormGroup.get).toHaveBeenCalled();
  });

  it('Debería ejecutar #setRuta()', async () => {
    component.rutaLaFraccionDeComplemento =
      component.rutaLaFraccionDeComplemento || {};
    component.rutaLaFraccionDeComplemento.emit = jest.fn();
    component.setRuta({});
    expect(component.rutaLaFraccionDeComplemento.emit).toHaveBeenCalled();
  });

  describe('#ngOnInit', () => {
    it('Debería deshabilitar los formularios si formularioDeshabilitado es true', () => {
      component.formularioDeshabilitado = true;
      component.ngOnInit();
      expect(component.anexoUnoFormGroup.disabled).toBe(true);
      expect(component.anexoDosFormGroup.disabled).toBe(true);
    });

    it('Debería habilitar los formularios si formularioDeshabilitado es false', () => {
      component.formularioDeshabilitado = false;
      component.ngOnInit();
      expect(component.anexoUnoFormGroup.enabled).toBe(true);
      expect(component.anexoDosFormGroup.enabled).toBe(true);
    });
  });

  it('Debería filtrar y emitir anexoUnoTablaLista en eliminarAnexoUno', () => {
    const emitSpy = jest.spyOn(component.obtenerAnexoUnoDevolverLaLlamada, 'emit');
    component.anexoUnoTablaLista = [{ estatus: false }, { estatus: true }] as any;
    component.eliminarAnexoUno();
    expect(component.anexoUnoTablaLista.length).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith(component.anexoUnoTablaLista);
  });

  it('Debería filtrar y emitir anexoDosTablaLista en eliminarAnexoDos', () => {
    const emitSpy = jest.spyOn(component.obtenerAnexoDosDevolverLaLlamada, 'emit');
    component.anexoDosTablaLista = [{ estatus: false }, { estatus: true }] as any;
    component.eliminarAnexoDos();
    expect(component.anexoDosTablaLista.length).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith(component.anexoDosTablaLista);
  });

  it('Debería agregar una entrada a anexoUnoTablaLista y emitirla', () => {
    const emitSpy = jest.spyOn(component.obtenerAnexoUnoDevolverLaLlamada, 'emit');
    component.anexoUnoFormGroup.setValue({
      fraccionArancelaria: '0101',
      descripcion: 'desc',
    });
    component.anexoUnoTablaLista = [];
    component.agregarAnexoUno();
    expect(component.anexoUnoTablaLista.length).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith(component.anexoUnoTablaLista);
    expect(component.anexoUnoFormGroup.value.fraccionArancelaria).toBeFalsy();
  });

  it('Debería agregar la entrada a anexoDosTablaLista y emitirla', () => {
    const emitSpy = jest.spyOn(component.obtenerAnexoDosDevolverLaLlamada, 'emit');
    component.anexoDosFormGroup.setValue({
      fraccionArancelaria: '0102',
      descripcion: 'desc 2',
    });
    component.anexoDosTablaLista = [];
    component.agregarAnexoDos();
    expect(component.anexoDosTablaLista.length).toBe(1);
    expect(emitSpy).toHaveBeenCalledWith(component.anexoDosTablaLista);
    expect(component.anexoDosFormGroup.value.fraccionArancelaria).toBeFalsy();
  });

  it('debe establecer el elemento de importación seleccionado en setAnexoUnoLista', () => {
    const mockItem = { encabezadoFraccion: '0103' } as any;
    component.setAnexoUnoLista(mockItem);
    expect(component.datosImportacionSeleccionados).toEqual(mockItem);
  });

  it('debe establecer el elemento de exportación seleccionado en setAnexoDosLista', () => {
    const mockItem = { encabezadoFraccion: '0104' } as any;
    component.setAnexoDosLista(mockItem);
    expect(component.datosExportacionSeleccionados).toEqual(mockItem);
  });

  it('Debería emitir rutaLaFraccionDeComplemento con la carga útil correcta en setRuta IMPORT', () => {
    const emitSpy = jest.spyOn(component.rutaLaFraccionDeComplemento, 'emit');
    const mockImport = { encabezadoFraccion: '0001' } as any;
    component.datosImportacionSeleccionados = mockImport;
    component.setRuta('some-name', 'IMPORT');
    expect(emitSpy).toHaveBeenCalledWith({
      catagoria: 'some-name',
      id: 'IMPORT',
      datos: mockImport,
    });
  });

  it('Debería emitir rutaLaFraccionDeComplemento con la carga útil correcta en setRuta EXPORT', () => {
    const emitSpy = jest.spyOn(component.rutaLaFraccionDeComplemento, 'emit');
    const mockExport = { encabezadoFraccion: '0002' } as any;
    component.datosExportacionSeleccionados = mockExport;
    component.setRuta('other-name', 'EXPORT');
    expect(emitSpy).toHaveBeenCalledWith({
      catagoria: 'other-name',
      id: 'EXPORT',
      datos: mockExport,
    });
  });
});
