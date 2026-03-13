import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { SolicitudComponent } from './solicitud.component';
import { ExportacionHidrocarburosService } from '../../services/exportacion-hidrocarburos.service';
import { Tramite130204Store } from '../../estados/tramites/tramites130204.store';
import { Tramite130204Query } from '../../estados/queries/tramite130204.query';
import { PaisDeOrigenComponent } from '../../../../shared/components/pais-de-origen/pais-de-origen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;
  let exportacionHidrocarburosServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;

  beforeEach(async () => {
    exportacionHidrocarburosServiceMock = {
      getSolicitudeOptions: jest.fn().mockReturnValue(of({ options: [] })),
      getProductoOptions: jest.fn().mockReturnValue(of({ options: [] })),
      getTablaDatos: jest.fn().mockReturnValue(of([{ cantidad: 10, totalUSD: 100 }])),
      getEstado: jest.fn().mockReturnValue(of([])),
      getRepresentacionFederal: jest.fn().mockReturnValue(of([])),
      getListaDePaisesDisponibles: jest.fn().mockReturnValue(of([])),
      obtenerListaDeCiudades: jest.fn().mockReturnValue(of([{ descripcion: 'Ciudad 1' }])),
      getPaisesPorBloque: jest.fn().mockReturnValue(of([{ descripcion: 'País 1' }])),
    };

    tramiteStoreMock = {
      establecerDatos: jest.fn(),
      storeTableValues: jest.fn(),
      setMostrarTabla: jest.fn(),
    };

    tramiteQueryMock = {
      selectSolicitud$: of({}),
      mostrarTabla$: of(false),
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      declarations: [SolicitudComponent],
      imports: [
        ReactiveFormsModule,
        PaisDeOrigenComponent,
        HttpClientTestingModule,
        DatosDelTramiteComponent
      ],
      providers: [
        FormBuilder,
        { provide: ExportacionHidrocarburosService, useValue: exportacionHidrocarburosServiceMock },
        { provide: Tramite130204Store, useValue: tramiteStoreMock },
        { provide: Tramite130204Query, useValue: tramiteQueryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar formularios al iniciar', () => {
    const spyInitForms = jest.spyOn(component, 'inicializarFormularios');
    component.ngOnInit();
    expect(spyInitForms).toHaveBeenCalled();
  });

  it('debería llamar opcionesDeBusqueda al iniciar', () => {
    const spyOpcionesDeBusqueda = jest.spyOn(component, 'opcionesDeBusqueda');
    component.ngOnInit();
    expect(spyOpcionesDeBusqueda).toHaveBeenCalled();
  });

  it('debería obtener datos de la tabla y actualizar formForTotalCount', () => {
    component.obtenerTablaDatos();
    expect(exportacionHidrocarburosServiceMock.getTablaDatos).toHaveBeenCalled();
    expect(component.tableBodyData).toEqual([{ cantidad: 10, totalUSD: 100 }]);
    expect(component.formForTotalCount.value).toEqual({
      cantidadTotal: 10,
      valorTotalUSD: 100,
    });
  });

  it('debería manejar setFraccion actualizando el formulario', () => {
    const form = new FormBuilder().group({ fraccion: [1], umt: [''] });
    component.mercanciaCatalogoArray = [[{ id: 1, descripcion: 'Sample', relacionadaUmtId: 2 }]];
    component.acotacionCatalogo = [{ id: 3, descripcion: 'Acotación 3' }];
    const spy = jest.spyOn(component, 'setValoresStore');

    component.handleStoreUpdate({ form, campo: 'fraccion', metodoNombre: 'setFraccion' });

    expect(spy).toHaveBeenCalledWith(form, 'fraccion');
    expect(form.value.umt).toBe(2);
  });

  it('debería manejar setNico actualizando descripciónNico', () => {
    const form = new FormBuilder().group({ fraccion: [1], descripcionNico: [''] });
    component.mercanciaCatalogoArray = [[{ id: 1, descripcion: 'Descripción NICO' }]];
    const spy = jest.spyOn(component, 'setValoresStore');

    component.handleStoreUpdate({ form, campo: 'nico', metodoNombre: 'setNico' });

    expect(spy).toHaveBeenCalledWith(form, 'nico');
    expect(form.value.descripcionNico).toBe('Descripción NICO');
  });

  it('debería validar y mostrar/ocultar tabla según validez del formulario', () => {
    component['fb'] = new FormBuilder();
    component.partidasDelaMercanciaForm = component['fb'].group({
      cantidadModificar: ['', Validators.required]
    });

    component.validarYEnviarFormulario();
    expect(component.mostrarTabla).toBe(false);

    component.partidasDelaMercanciaForm.patchValue({ cantidadModificar: '5' });
    component.validarYEnviarFormulario();
    expect(component.mostrarTabla).toBe(true);
  });

  it('debería obtener países por bloque y actualizar selectRangoDias', () => {
    const mockData = [{ descripcion: 'País 1' }, { descripcion: 'País 2' }];
    exportacionHidrocarburosServiceMock.getPaisesPorBloque.mockReturnValue(of(mockData));

    component.fetchPaisesPorBloque(1);
    expect(exportacionHidrocarburosServiceMock.getPaisesPorBloque).toHaveBeenCalledWith(1);
    expect(component.paisesPorBloque).toEqual(mockData);
    expect(component.selectRangoDias).toEqual(['País 1', 'País 2']);
  });

  it('debería asignar valores al store correctamente', () => {
    const form = new FormBuilder().group({ campo: ['valor'] });
    component.setValoresStore(form, 'campo');
    expect(tramiteStoreMock.establecerDatos).toHaveBeenCalledWith({ campo: 'valor' });
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const spyNext = jest.spyOn(component['destroyed$'], 'next');
    const spyComplete = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('debería obtener lista de ciudades y actualizar fechasDatos', () => {
    const paisComponentMock: any = { crosslistComponent: { fechasDatos: [] } };
    component.paisDeOrigenComponent = paisComponentMock;

    component.obtenerListaDeCiudades();

    expect(paisComponentMock.crosslistComponent.fechasDatos).toEqual(['Ciudad 1']);
  });

  it('no debería fallar si acotacionCatalogo es undefined en setFraccion', () => {
  const form = new FormBuilder().group({ fraccion: [1], umt: [''], acotacion: [''] });
  component.mercanciaCatalogoArray = [[{ id: 1, descripcion: 'Sample', relacionadaUmtId: 2, relacionadaAcotacionId: 3 }]];
  component.acotacionCatalogo = undefined as any; // or just don't set it
  expect(() => {
    component.handleStoreUpdate({ form, campo: 'fraccion', metodoNombre: 'setFraccion' });
  }).not.toThrow();
});

it('no debería actualizar acotacion si no hay coincidencia en acotacionCatalogo', () => {
  const form = new FormBuilder().group({ fraccion: [1], umt: [''], acotacion: [''] });
  component.mercanciaCatalogoArray = [[{ id: 1, descripcion: 'Sample', relacionadaUmtId: 2, relacionadaAcotacionId: 99 }]];
  component.acotacionCatalogo = [{ id: 3, descripcion: 'Acotación 3' }];
  component.handleStoreUpdate({ form, campo: 'fraccion', metodoNombre: 'setFraccion' });
  expect(form.value.acotacion).toBe('');
});

it('debería deshabilitar todos los formularios si esFormularioSoloLectura es true', () => {
  component.esFormularioSoloLectura = true;
  component.inicializarFormularios();
  component.guardarDatosFormulario();
  expect(component.formDelTramite.disabled).toBe(true);
  expect(component.mercanciaForm.disabled).toBe(true);
  expect(component.partidasDelaMercanciaForm.disabled).toBe(true);
  expect(component.paisForm.disabled).toBe(true);
  expect(component.frmRepresentacionForm.disabled).toBe(true);
  expect(component.manifestoForm.disabled).toBe(true);
});

it('debería habilitar todos los formularios si esFormularioSoloLectura es false', () => {
  component.esFormularioSoloLectura = false;
  component.inicializarFormularios();
  component.guardarDatosFormulario();
  expect(component.formDelTramite.enabled).toBe(true);
  expect(component.mercanciaForm.enabled).toBe(true);
  expect(component.partidasDelaMercanciaForm.enabled).toBe(true);
  expect(component.paisForm.enabled).toBe(true);
  expect(component.frmRepresentacionForm.enabled).toBe(true);
  expect(component.manifestoForm.enabled).toBe(true);
});

it('no debería fallar si metodoNombre es desconocido en handleStoreUpdate', () => {
  const form = new FormBuilder().group({ campo: ['valor'] });
  expect(() => {
    component.handleStoreUpdate({ form, campo: 'campo', metodoNombre: 'desconocido' });
  }).not.toThrow();
});

it('debería manejar setValoresStore con formulario vacío', () => {
  const form = new FormBuilder().group({});
  expect(() => component.setValoresStore(form, 'campo')).not.toThrow();
});
});
