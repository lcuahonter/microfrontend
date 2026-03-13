import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { ElementRef, QueryList } from '@angular/core';
import { Modal } from 'bootstrap';

import { EstablecimientoComponent } from './establecimiento.component';
import { EstablecimientoService } from '../../services/establecimiento.service';
import { Catalogo, CrosslistComponent } from '@libs/shared/data-access-user/src';

describe('EstablecimientoComponent', () => {
  let component: EstablecimientoComponent;
  let fixture: ComponentFixture<EstablecimientoComponent>;
  let mockEstablecimientoService: jest.Mocked<EstablecimientoService>;

  beforeEach(async () => {
    mockEstablecimientoService = {
      getEstadoData: jest.fn(),
      getTipoDeProductoData: jest.fn(),
      getUnidadDeMedidaData: jest.fn(),
      getUsoEspecificoData: jest.fn(),
    } as unknown as jest.Mocked<EstablecimientoService>;

    await TestBed.configureTestingModule({
   
      imports: [CommonModule, ReactiveFormsModule, FormsModule,EstablecimientoComponent],
      providers: [{ provide: EstablecimientoService, useValue: mockEstablecimientoService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();

    expect(component.datosMercanciaForm).toBeDefined();
    expect(component.datosMercanciaForm.get('nombreEspecifico')).toBeTruthy();
    expect(component.datosMercanciaForm.get('tipoDeProducto')).toBeTruthy();
  });

  it('should load estado data', () => {
    const mockEstadoData: Catalogo[] = [{ id: 1, descripcion: 'Estado 1' }];
    mockEstablecimientoService.getEstadoData.mockReturnValue(of(mockEstadoData));

    component.loadEstado();

    expect(component.estadoJson).toEqual(mockEstadoData);
  });

  it('should load tipo de producto data', () => {
    const mockTipoProductoData: Catalogo[] = [{ id: 1, descripcion: 'Producto 1' }];
    mockEstablecimientoService.getTipoDeProductoData.mockReturnValue(of(mockTipoProductoData));

    component.loadTipoProducto();

    expect(component.catalogoTipoProducto).toEqual(mockTipoProductoData);
  });

  it('should load unidad de medida data', () => {
    const mockUnidadDeMedidaData: Catalogo[] = [{ id: 1, descripcion: 'Unidad 1' }];
    mockEstablecimientoService.getUnidadDeMedidaData.mockReturnValue(of(mockUnidadDeMedidaData));

    component.loadUnidadDeMedida();

    expect(component.unidadDeMedida).toEqual(mockUnidadDeMedidaData);
  });

  it('should load uso especifico data', () => {
    const mockUsoEspecificoData: Catalogo[] = [{ id: 1, descripcion: 'Uso 1' }];
    mockEstablecimientoService.getUsoEspecificoData.mockReturnValue(of(mockUsoEspecificoData));

    component.loadUsoEspecifico();

    expect(component.usoEspecifico).toEqual(mockUsoEspecificoData);
  });

  it('should open and close the modal', () => {
    const mockShow = jest.fn();
    const mockHide = jest.fn();
    component.datosModalInstance = { show: mockShow, hide: mockHide } as unknown as Modal;

    component.openDatosMercanciaModal();
    expect(mockShow).toHaveBeenCalled();

    component.closeDatosMercanciaModal();
    expect(mockHide).toHaveBeenCalled();
  });

  it('should toggle colapsable state', () => {
    expect(component.colapsable).toBe(false);

    component.mostrar_colapsable_pais();
    expect(component.colapsable).toBe(true);

    component.mostrar_colapsable_pais();
    expect(component.colapsable).toBe(false);
  });

  it('should toggle colapsable_procedencia state', () => {
    expect(component.colapsable_procedencia).toBe(false);

    component.mostrar_colapsable_pais_procedencia();
    expect(component.colapsable_procedencia).toBe(true);

    component.mostrar_colapsable_pais_procedencia();
    expect(component.colapsable_procedencia).toBe(false);
  });

  it('should add a new mercancia entry and reset the form', () => {
    component.datosMercanciaForm.patchValue({
      tipoDeProducto: 'Producto 1',
      nombreEspecifico: 'Nombre 1',
      cantidadOVolumen: '10',
      unidadDeMedida: 'Unidad 1',
      presentacionaFrmaceutica: 'Presentacion 1',
      fraccionArancelaria: '1234',
      descripcionFraccionArancelaria: 'Descripcion 1',
      umt: 'UMT 1',
      cantidadUMT: '5',
      almacenamientoEnvasePrimario: 'Envase 1',
      almacenamientoEnvaseSecundario: 'Envase 2',
      paisDeDestino: 'Destino 1',
      usoEspecifico: 'Uso 1',
    });

    component.guardarDatosMercancia();

    expect(component.establecimientoData.length).toBe(1);
    expect(component.establecimientoData[0].tipoDeProducto).toBe('Producto 1');
    expect(component.datosMercanciaForm.value).toEqual({
      nombreEspecifico: null,
      tipoDeProducto: null,
      fraccionArancelaria: null,
      descripcionFraccionArancelaria: null,
      cantidadUMT: null,
      umt: null,
      cantidadOVolumen: null,
      unidadDeMedida: null,
      transporteEnvaseSecundario: null,
      transporteEnvasePrimario: null,
      almacenamientoEnvaseSecundario: null,
      usoEspecifico: null,
      almacenamientoEnvasePrimario: null,
      presentacionaFrmaceutica: null,
    });
  });

  it('should not add a new mercancia entry if the form is empty', () => {
    component.datosMercanciaForm.reset();

    component.guardarDatosMercancia();

    expect(component.establecimientoData.length).toBe(0);
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should disable the form if esFormularioSoloLectura is true', () => {
  component.esFormularioSoloLectura = true;

  component.ngOnInit();

  component.inicializarEstadoFormulario();

  expect(component.datosMercanciaForm.disabled).toBeTruthy();
});

it('should enable the form if esFormularioSoloLectura is false', () => {
  component.esFormularioSoloLectura = false;


  component.ngOnInit();

  component.inicializarEstadoFormulario();

  expect(component.datosMercanciaForm.enabled).toBeTruthy();
});

});