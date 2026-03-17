import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { DatosSolicitudComponent } from './datos-solicitud.component';
import { PermisoDeHidrocarburosService } from '../../services/permiso-de-hidrocarburos.service';
import { Tramite130121Store } from '../../estados/tramites/tramites130121.store';
import { Tramite130121Query } from '../../estados/queries/tramite130121.query';
import { PaisDeOrigenComponent } from '../../../../shared/components/pais-de-origen/pais-de-origen.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosDelTramiteComponent } from '../../../../shared/components/datos-del-tramite/datos-del-tramite.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DatosSolicitudComponent', () => {
  let component: DatosSolicitudComponent;
  let fixture: ComponentFixture<DatosSolicitudComponent>;
  let permisodehidrocarburosServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;

  beforeEach(async () => {
    permisodehidrocarburosServiceMock = {
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
      declarations: [DatosSolicitudComponent],
      imports: [
        ReactiveFormsModule,
        PaisDeOrigenComponent,
        HttpClientTestingModule,
        DatosDelTramiteComponent
      ],
      providers: [
        FormBuilder,
        { provide: PermisoDeHidrocarburosService, useValue: permisodehidrocarburosServiceMock },
        { provide: Tramite130121Store, useValue: tramiteStoreMock },
        { provide: Tramite130121Query, useValue: tramiteQueryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosSolicitudComponent);
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
    // Arrange - Preparar los datos simulados
    const serviceMockData = [{ cantidad: 10, totalUSD: 100 }];
    permisodehidrocarburosServiceMock.getTablaDatos.mockReturnValue(of(serviceMockData));

    // Act - Ejecutar el método bajo prueba
    component.obtenerTablaDatos();
    
    // Assert - Verificar los resultados esperados
    expect(permisodehidrocarburosServiceMock.getTablaDatos).toHaveBeenCalled();
    expect(tramiteStoreMock.establecerDatos).toHaveBeenCalledWith({ tablaDatos: serviceMockData });
    expect(component.formForTotalCount.value).toEqual({
      cantidadTotal: 10,
      valorTotalUSD: 100,
    });
  });

  it('debería manejar setFraccion actualizando el formulario', () => {
    const form = new FormBuilder().group({ fraccion: [1], umt: [''] });
    component.mercanciaCatalogoArray = [[{ id: 1, descripcion: 'Sample', relacionadaUmtId: 2 }]];
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
    permisodehidrocarburosServiceMock.getPaisesPorBloque.mockReturnValue(of(mockData));

    component.fetchPaisesPorBloque(1);
    expect(permisodehidrocarburosServiceMock.getPaisesPorBloque).toHaveBeenCalledWith(1);
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

  it('debería obtener lista de ciudades y actualizar selectRangoDias', () => {
    // Arrange - Preparar los datos simulados
    const mockCiudades = [{ descripcion: 'Ciudad 1' }];
    permisodehidrocarburosServiceMock.obtenerListaDeCiudades.mockReturnValue(of(mockCiudades));

    // Act - Ejecutar el método bajo prueba
    component.obtenerListaDeCiudades();

    // Assert - Verificar los resultados esperados
    expect(permisodehidrocarburosServiceMock.obtenerListaDeCiudades).toHaveBeenCalled();
    expect(component.selectRangoDias).toEqual(['Ciudad 1']);
    expect(tramiteStoreMock.establecerDatos).toHaveBeenCalledWith({
      rangoDias: ['Ciudad 1'],
      seleccionada: []
    });
    expect(component.fechaSeleccionada).toEqual([]);
  });
});
