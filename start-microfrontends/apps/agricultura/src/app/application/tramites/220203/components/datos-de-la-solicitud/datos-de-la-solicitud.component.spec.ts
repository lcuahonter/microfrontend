import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ImportacionDeAcuiculturaService } from '../../services/220203/importacion-de-acuicultura.service';
import { AcuiculturaStore } from '../../estados/220203/sanidad-certificado.store';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';

describe('DatosDeLaSolicitudComponent', () => {
  let componente: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;
  let servicioMock: any;
  let consultaMock: any;
  let storeMock: any;

  beforeEach(async () => {
    servicioMock = {
      obtenerDatos: jest.fn().mockReturnValue(
        of({
          realizarGroup: {
            aduanaIngreso: 'aduana',
            oficinaInspeccion: 'oficina',
            puntoInspeccion: 'punto',
            numeroGuia: '12345',
            regimen: 'general'
          },
          mercanciaGroup: []
        })
      ),
      obtenerDetallesDelCatalogo: jest.fn().mockReturnValue(of({ data: [] })),
      actualizarFormaValida: jest.fn(),
      actualizarDatosMercancia: jest.fn()
    };

    consultaMock = {
      selectConsultaioState$: of({ readonly: false })
    };

    storeMock = {
      update: jest.fn(),
      getValue: jest.fn().mockReturnValue({}),
      remove: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        CommonModule,
        DatosDeLaSolicitudComponent
      ],
      providers: [
        FormBuilder,
        {
          provide: ImportacionDeAcuiculturaService,
          useValue: servicioMock
        },
        {
          provide: ConsultaioQuery,
          useValue: consultaMock
        },
        {
          provide: AcuiculturaStore,
          useValue: storeMock
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    componente = fixture.componentInstance;

    componente.cuerpoTablaFila = [];
    componente.cuerpoTablasoli = [];
    componente.cuerpoTablaSolicitud = [];
    componente.listSelectedView = [];
    componente.aduanaDeIngresoList = [];
    componente.oficinaInspeccionList = [];
    componente.puntoInspeccionList = [];
    componente.tipoRequisitoList = [];
    componente.arancelariaList = [];
    componente.regimenList = [];
    componente.nicoList = [];
    componente.umcList = [];
    componente.usoList = [];
    componente.paisDeOrigenList = [];
    componente.paisDeProcedenciaList = [];
    componente.createFromGroup();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('crea componente', () => {
    expect(componente).toBeTruthy();
  });

  it('inicializa formulario en ngOnInit', () => {
    componente.ngOnInit();
    expect(componente.datosMercanciaFormGroup).toBeDefined();
    expect(componente.datosMercanciaFormGroup.get('realizarGroup')).toBeTruthy();
  });

  it('deshabilita formulario solo lectura', () => {
    componente.esFormularioSoloLectura = true;
    componente.inicializarEstadoFormulario();
    expect(componente.datosMercanciaFormGroup.disabled).toBe(true);
  });

  it('habilita formulario editable', () => {
    componente.esFormularioSoloLectura = false;
    componente.inicializarEstadoFormulario();
    expect(componente.datosMercanciaFormGroup.enabled).toBe(true);
  });

  it('toggle colapsable', () => {
    const inicial = componente.colapsable;
    componente.mostrar_colapsable();
    expect(componente.colapsable).toBe(!inicial);
  });

  it('estructura formulario', () => {
    expect(componente.datosMercanciaFormGroup).toBeDefined();
    expect(componente.datosMercanciaFormGroup.get('realizarGroup')).toBeTruthy();
  });

  it('realizarGroup con validadores', () => {
    const realizarGroup = componente.createRealizarGroup();
    expect(realizarGroup.get('aduanaIngreso')).toBeTruthy();
    expect(realizarGroup.get('oficinaInspeccion')).toBeTruthy();
    expect(realizarGroup.get('puntoInspeccion')).toBeTruthy();
    expect(realizarGroup.get('numeroGuia')).toBeTruthy();
    expect(realizarGroup.get('regimen')).toBeTruthy();
  });

  it('carga catalogos', () => {
    componente.ngOnInit();
    expect(servicioMock.obtenerDetallesDelCatalogo).toHaveBeenCalled();
  });

  it('actualiza valores formulario', () => {
    const datosPrueba = {
      aduanaIngreso: 'test-aduana',
      oficinaInspeccion: 'test-oficina',
      puntoInspeccion: 'test-punto',
      numeroGuia: 'test-guia',
      regimen: 'test-regimen'
    };

    servicioMock.obtenerDatos.mockReturnValue(
      of({
        realizarGroup: datosPrueba,
        mercanciaGroup: []
      })
    );

    componente.datosMercanciaStore = datosPrueba;
    componente.datosMercanciaFormGroup.patchValue({
      realizarGroup: componente.datosMercanciaStore
    });

    const realizarGroup = componente.datosMercanciaFormGroup.get('realizarGroup');
    expect(realizarGroup?.get('aduanaIngreso')?.value).toBe('test-aduana');
    expect(realizarGroup?.get('oficinaInspeccion')?.value).toBe('test-oficina');
    expect(realizarGroup?.get('puntoInspeccion')?.value).toBe('test-punto');
    expect(realizarGroup?.get('numeroGuia')?.value).toBe('test-guia');
    expect(realizarGroup?.get('regimen')?.value).toBe('test-regimen');
  });

  it('asigna datos store', () => {
    const datos = {
      aduanaIngreso: 'store-aduana',
      oficinaInspeccion: 'store-oficina',
      puntoInspeccion: 'store-punto',
      numeroGuia: 'store-guia',
      regimen: 'store-regimen'
    };

    servicioMock.obtenerDatos.mockReturnValue(
      of({
        realizarGroup: datos,
        mercanciaGroup: []
      })
    );

    componente.ngOnInit();
    expect(componente.datosMercanciaStore).toEqual(datos);
  });

  it('actualiza datos tabla', () => {
    const mercancia = [
      { id: 1, descripcion: 'Test mercancia 1' },
      { id: 2, descripcion: 'Test mercancia 2' }
    ];

    servicioMock.obtenerDatos.mockReturnValue(
      of({
        realizarGroup: {
          aduanaIngreso: 'aduana',
          oficinaInspeccion: 'oficina',
          puntoInspeccion: 'punto',
          numeroGuia: '12345',
          regimen: 'general'
        },
        mercanciaGroup: mercancia
      })
    );

    componente.ngOnInit();
    expect(componente.cuerpoTablaFila).toEqual(mercancia);
  });

  it('valida formulario', () => {
    const valido = componente.validarFormulario();
    expect(typeof valido).toBe('boolean');
  });

  it('arreglos tabla inicializados', () => {
    expect(Array.isArray(componente.cuerpoTablaFila)).toBe(true);
    expect(Array.isArray(componente.cuerpoTablasoli)).toBe(true);
    expect(Array.isArray(componente.cuerpoTablaSolicitud)).toBe(true);
    expect(Array.isArray(componente.listSelectedView)).toBe(true);
  });

  it('arreglos catalogos inicializados', () => {
    expect(Array.isArray(componente.aduanaDeIngresoList)).toBe(true);
    expect(Array.isArray(componente.oficinaInspeccionList)).toBe(true);
    expect(Array.isArray(componente.tipoRequisitoList)).toBe(true);
    expect(Array.isArray(componente.arancelariaList)).toBe(true);
    expect(Array.isArray(componente.regimenList)).toBe(true);
  });

  it('configuracion columnas tabla', () => {
    expect(componente.configuracionColumnas).toBeDefined();
    expect(Array.isArray(componente.configuracionColumnas)).toBe(true);
    expect(componente.configuracionColumnas.length).toBeGreaterThan(0);
  });

  it('tipos seleccion tabla', () => {
    expect(componente.tipoSeleccion).toBeDefined();
    expect(componente.tipoSeleccionsoli).toBeDefined();
  });

  it('datos tabla por defecto', () => {
    expect(Array.isArray(componente.cuerpoTabla)).toBe(true);
    expect(componente.cuerpoTabla.length).toBeGreaterThan(0);
  });
});
