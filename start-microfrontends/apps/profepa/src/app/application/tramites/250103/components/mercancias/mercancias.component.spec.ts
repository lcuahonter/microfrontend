import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MercanciasComponent } from './mercancias.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite250103Store } from '../../estados/tramite250103.store';
import { Tramite250103Query } from '../../estados/tramite250103.query';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Detalle, Producto } from '../../models/embalaje-de-madera.models';

const MOCK_STORE = {
  establecerDatos: jest.fn(),
};

const MOCK_QUERY = {
  selectTramiteState$: of({
    tipoMovimiento: '',
    tipoAduana: '',
    tipoInspectoria: '',
    tipoMunicipio: '',
    descripcion: 'Descripción de prueba',
    fraccion: 'Fracción de prueba',
    arancelaria: 'Arancelaria de prueba',
    cantidad: 'Cantidad de prueba',
    medida: 'Medida de prueba',
    genero: 'Género de prueba',
    especie: 'Especie de prueba',
    comun: 'Común de prueba',
    origen: 'Origen de prueba',
    procedencia: 'Procedencia de prueba',
    productos: [],
    detalles: []
  }),
};

describe('MercanciasComponent', () => {
  let component: MercanciasComponent;
  let fixture: ComponentFixture<MercanciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MercanciasComponent,
        CommonModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: Tramite250103Store, useValue: MOCK_STORE },
        { provide: Tramite250103Query, useValue: MOCK_QUERY }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Para ignorar errores de componentes hijos
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MercanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con valores predeterminados', () => {
    expect(component.formMercancias).toBeDefined();
    expect(component.formMercancias.get('descripcion')).toBeDefined();
    expect(component.formMercancias.get('fraccion')).toBeDefined();
    expect(component.formMercancias.get('arancelaria')).toBeDefined();
    expect(component.formMercancias.get('cantidad')).toBeDefined();
    expect(component.formMercancias.get('medida')).toBeDefined();
    expect(component.formMercancias.get('genero')).toBeDefined();
    expect(component.formMercancias.get('especie')).toBeDefined();
    expect(component.formMercancias.get('comun')).toBeDefined();
    expect(component.formMercancias.get('origen')).toBeDefined();
    expect(component.formMercancias.get('procedencia')).toBeDefined();
  });

  it('debe deshabilitar el campo arancelaria', () => {
    expect(component.formMercancias.get('arancelaria')?.disabled).toBe(true);
  });

  it('debe inicializar los catálogos correctamente', () => {
    expect(component.descripcion).toBeDefined();
    expect(component.fraccion).toBeDefined();
    expect(component.medida).toBeDefined();
    expect(component.genero).toBeDefined();
    expect(component.especie).toBeDefined();
    expect(component.comun).toBeDefined();
    expect(component.origen).toBeDefined();
    expect(component.procedencia).toBeDefined();
  });

  it('debe inicializar las propiedades correctamente', () => {
    expect(component.fraccionData).toBeDefined();
    expect(component.producto).toBeDefined();
    expect(component.productoSeleccionado).toBeNull();
    expect(component.TablaSeleccion).toBeDefined();
    expect(component.configuracionTabla).toBeDefined();
    expect(component.configuracionMercanciasTabla).toBeDefined();
    expect(component.mapaDetalles).toBeDefined();
    expect(component.mostrarModalMercancias).toBe(false);
  });

  it('debe obtener datos anidados correctamente con obtenerDatosAnidados', () => {
    // Preparar datos de prueba
    const PRODUCTO: Producto = { id: 1, descripcion: 'Producto de prueba' };
    const DETALLES: Detalle[] = [{
      fraccionArancelaria: 'Fracción 1',
      cantidad: '10',
      unidadMedida: 'KG',
      nombreCientifico: 'Nombre científico',
      nombreComun: 'Nombre común',
      paisOrigen: 'País origen',
      paisProcedencia: 'País procedencia'
    }];
    component.mapaDetalles.set(1, DETALLES);

    // Ejecutar método
    const RESULT = component.obtenerDatosAnidados(PRODUCTO);

    // Verificar resultado
    expect(RESULT).toEqual(DETALLES);
  });

  it('debe manejar el caso de producto sin detalles en obtenerDatosAnidados', () => {
    const PRODUCTO: Producto = { id: 999, descripcion: 'Producto sin detalles' };
    const RESULT = component.obtenerDatosAnidados(PRODUCTO);
    expect(RESULT).toEqual([]);
  });

  it('debe manejar la selección de productos con alSeleccionarProducto', () => {
    const PRODUCTO: Producto = { id: 1, descripcion: 'Producto de prueba' };
    component.alSeleccionarProducto(PRODUCTO);
    expect(component.productoSeleccionado).toEqual(PRODUCTO);
  });

  it('debe agregar un detalle correctamente con agregarDetalle', () => {
    // Configurar el formulario con valores válidos
    component.formMercancias.patchValue({
      fraccion: '1',
      cantidad: '10',
      medida: '1',
      genero: '1',
      comun: '1',
      origen: '1',
      procedencia: '1'
    });

    // Espiar el método push del array fraccionData
    const PUSH_SPY = jest.spyOn(component.fraccionData, 'push');

    // Llamar al método
    component.agregarDetalle();

    // Verificar que se llamó al método push
    expect(PUSH_SPY).toHaveBeenCalled();
    expect(component.fraccionData.length).toBe(1);
  });

  it('no debería agregar un detalle si el formulario no es válido', () => {
    // Configurar el formulario con valores inválidos
    component.formMercancias.reset();
    component.formMercancias.setErrors({ 'invalid': true });

    // Espiar el método push del array fraccionData
    const PUSH_SPY = jest.spyOn(component.fraccionData, 'push');

    // Espiar console.error
    const CONSOLE_SPY = jest.spyOn(console, 'error').mockImplementation();

    // Llamar al método
    component.agregarDetalle();

    // Verificar que no se llamó al método push
    expect(PUSH_SPY).not.toHaveBeenCalled();
    expect(component.fraccionData.length).toBe(0);
    expect(CONSOLE_SPY).toHaveBeenCalled();

    CONSOLE_SPY.mockRestore();
  });

  it('debe establecer valores en el store correctamente con establecerValoresStore', () => {
    // Configurar el formulario con un valor
    component.formMercancias.patchValue({
      descripcion: 'Valor de prueba'
    });

    // Llamar al método
    component.establecerValoresStore(component.formMercancias, 'descripcion');

    // Verificar que se llamó al método establecerDatos del store
    expect(MOCK_STORE.establecerDatos).toHaveBeenCalledWith({
      descripcion: 'Valor de prueba'
    });
  });

  it('no debería llamar a establecerDatos si el valor es undefined', () => {
    // Crear un formulario con un control que no existe
    const FORM_GROUP = new FormBuilder().group({
      otroControl: ['']
    });

    // Llamar al método con un campo que no existe
    component.establecerValoresStore(FORM_GROUP, 'campoInexistente');

    // Verificar que no se llamó al método establecerDatos del store
    expect(MOCK_STORE.establecerDatos).not.toHaveBeenCalled();
  });

  it('debe cancelar el detalle correctamente con cancelarDetalle', () => {
    // Agregar datos al array fraccionData
    component.fraccionData = [{
      fraccionArancelaria: 'Fracción 1',
      cantidad: '10',
      unidadMedida: 'KG',
      nombreCientifico: 'Nombre científico',
      nombreComun: 'Nombre común',
      paisOrigen: 'País origen',
      paisProcedencia: 'País procedencia'
    }];

    // Establecer el modal como visible
    component.mostrarModalMercancias = true;

    // Espiar el método reset del formulario
    const RESET_SPY = jest.spyOn(component.formMercancias, 'reset');

    // Llamar al método
    component.cancelarDetalle();

    // Verificar que se llamó al método reset y se limpiaron los datos
    expect(RESET_SPY).toHaveBeenCalled();
    expect(component.fraccionData).toEqual([]);
    expect(component.mostrarModalMercancias).toBe(false);
  });

  it('debe guardar el detalle correctamente con guardarDetalle', () => {
    // Configurar datos para la prueba
    component.fraccionData = [{
      fraccionArancelaria: 'Fracción 1',
      cantidad: '10',
      unidadMedida: 'KG',
      nombreCientifico: 'Nombre científico',
      nombreComun: 'Nombre común',
      paisOrigen: 'País origen',
      paisProcedencia: 'País procedencia'
    }];
    component.formMercancias.patchValue({
      descripcion: '1'
    });

    // Espiar métodos
    const RESET_SPY = jest.spyOn(component.formMercancias, 'reset');
    const GENERAR_ID_SPY = jest.spyOn(MercanciasComponent, 'generarId').mockReturnValue(123);

    // Llamar al método
    component.guardarDetalle();

    // Verificar resultados
    expect(RESET_SPY).toHaveBeenCalled();
    expect(GENERAR_ID_SPY).toHaveBeenCalled();
    expect(component.producto.length).toBe(1);
    expect(component.mapaDetalles.has(123)).toBe(true);
    expect(component.fraccionData).toEqual([]);
    expect(component.mostrarModalMercancias).toBe(false);
    expect(MOCK_STORE.establecerDatos).toHaveBeenCalled();

    // Restaurar el mock
    GENERAR_ID_SPY.mockRestore();
  });

  it('no debería guardar el detalle si no hay datos en fraccionData', () => {
    // Configurar datos vacíos
    component.fraccionData = [];

    // Espiar console.error
    const CONSOLE_SPY = jest.spyOn(console, 'error').mockImplementation();

    // Llamar al método
    component.guardarDetalle();

    // Verificar que no se guardó nada
    expect(CONSOLE_SPY).toHaveBeenCalled();
    expect(component.producto.length).toBe(0);
    expect(MOCK_STORE.establecerDatos).not.toHaveBeenCalled();

    CONSOLE_SPY.mockRestore();
  });

  it('no debería guardar el detalle si no hay descripción seleccionada', () => {
    // Configurar datos con descripción vacía
    component.fraccionData = [{
      fraccionArancelaria: 'Fracción 1',
      cantidad: '10',
      unidadMedida: 'KG',
      nombreCientifico: 'Nombre científico',
      nombreComun: 'Nombre común',
      paisOrigen: 'País origen',
      paisProcedencia: 'País procedencia'
    }];
    component.formMercancias.patchValue({
      descripcion: ''
    });

    // Espiar console.error
    const CONSOLE_SPY = jest.spyOn(console, 'error').mockImplementation();

    // Llamar al método
    component.guardarDetalle();

    // Verificar que no se guardó nada
    expect(CONSOLE_SPY).toHaveBeenCalled();
    expect(component.producto.length).toBe(0);
    expect(MOCK_STORE.establecerDatos).not.toHaveBeenCalled();

    CONSOLE_SPY.mockRestore();
  });

  it('debe abrir el modal de mercancías correctamente con abrirModalMercancias', () => {
    // Espiar el método reset del formulario
    const RESET_SPY = jest.spyOn(component.formMercancias, 'reset');

    // Verificar estado inicial
    expect(component.mostrarModalMercancias).toBe(false);

    // Llamar al método
    component.abrirModalMercancias();

    // Verificar que se abrió el modal y se reseteó el formulario
    expect(component.mostrarModalMercancias).toBe(true);
    expect(RESET_SPY).toHaveBeenCalled();
    expect(component.fraccionData).toEqual([]);

    // Llamar al método de nuevo
    RESET_SPY.mockClear();
    component.abrirModalMercancias();

    // Verificar que se cerró el modal
    expect(component.mostrarModalMercancias).toBe(false);
    expect(RESET_SPY).not.toHaveBeenCalled();
  });

  it('debe generar un ID único con generarId', () => {
    // Llamar al método estático
    const ID1 = MercanciasComponent.generarId();
    const ID2 = MercanciasComponent.generarId();

    // Verificar que los IDs son números y diferentes
    expect(typeof ID1).toBe('number');
    expect(typeof ID2).toBe('number');
    expect(ID1).not.toBe(ID2);
  });

  it('debe suscribirse al estado de la solicitud en ngOnInit', () => {
    // Espiar el método subscribe
    const SUBSCRIBE_SPY = jest.spyOn(MOCK_QUERY.selectTramiteState$, 'subscribe');

    // Reiniciar el componente para llamar a ngOnInit
    component.ngOnInit();

    // Verificar que se llamó al método subscribe
    expect(SUBSCRIBE_SPY).toHaveBeenCalled();
  });

  it('debe inicializar el formulario en ngOnInit', () => {
    // Crear un nuevo componente para probar la inicialización del formulario
    const FIXTURE = TestBed.createComponent(MercanciasComponent);
    const COMPONENT = FIXTURE.componentInstance;

    // Inicializar el componente
    FIXTURE.detectChanges();

    // Verificar que el formulario se inicializó correctamente
    expect(COMPONENT.formMercancias).toBeDefined();
    expect(COMPONENT.formMercancias.get('descripcion')).toBeDefined();
    expect(COMPONENT.formMercancias.get('fraccion')).toBeDefined();
    expect(COMPONENT.formMercancias.get('arancelaria')).toBeDefined();
    expect(COMPONENT.formMercancias.get('cantidad')).toBeDefined();
    expect(COMPONENT.formMercancias.get('medida')).toBeDefined();
    expect(COMPONENT.formMercancias.get('genero')).toBeDefined();
    expect(COMPONENT.formMercancias.get('especie')).toBeDefined();
    expect(COMPONENT.formMercancias.get('comun')).toBeDefined();
    expect(COMPONENT.formMercancias.get('origen')).toBeDefined();
    expect(COMPONENT.formMercancias.get('procedencia')).toBeDefined();
  });

  it('debe limpiar las suscripciones al destruir el componente', () => {
    // Espiar los métodos next y complete del Subject
    const NEXT_SPY = jest.spyOn(component['notificadorDestruccion$'], 'next');
    const COMPLETE_SPY = jest.spyOn(component['notificadorDestruccion$'], 'complete');

    // Llamar a ngOnDestroy
    component.ngOnDestroy();

    // Verificar que se llamaron los métodos
    expect(NEXT_SPY).toHaveBeenCalled();
    expect(COMPLETE_SPY).toHaveBeenCalled();
  });

  it('debe manejar el caso de producto nulo en obtenerDatosAnidados', () => {
    const RESULT = component.obtenerDatosAnidados(null as any);
    expect(RESULT).toEqual([]);
  });

  it('debe manejar el caso de producto sin ID en obtenerDatosAnidados', () => {
    const PRODUCTO = { descripcion: 'Producto sin ID' } as Producto;
    const RESULT = component.obtenerDatosAnidados(PRODUCTO);
    expect(RESULT).toEqual([]);
  });

  it('debe inicializar el formulario con valores del estado', () => {
    // Verificar que el formulario se inicializó con los valores del estado
    expect(component.formMercancias.get('descripcion')?.value).toBe('Descripción de prueba');
    expect(component.formMercancias.get('fraccion')?.value).toBe('Fracción de prueba');
    expect(component.formMercancias.get('cantidad')?.value).toBe('Cantidad de prueba');
    expect(component.formMercancias.get('medida')?.value).toBe('Medida de prueba');
    expect(component.formMercancias.get('genero')?.value).toBe('Género de prueba');
    expect(component.formMercancias.get('especie')?.value).toBe('Especie de prueba');
    expect(component.formMercancias.get('comun')?.value).toBe('Común de prueba');
    expect(component.formMercancias.get('origen')?.value).toBe('Origen de prueba');
    expect(component.formMercancias.get('procedencia')?.value).toBe('Procedencia de prueba');
  });

  it('debe cargar productos desde el estado si existen', () => {
    // Crear un mock con productos
    const MOCK_WITH_PRODUCTS = {
      selectTramiteState$: of({
        productos: [{ id: 123, descripcion: 'Producto desde el estado' }],
        detalles: []
      }),
    };

    // Crear un nuevo componente con el mock
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MercanciasComponent, CommonModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite250103Store, useValue: MOCK_STORE },
        { provide: Tramite250103Query, useValue: MOCK_WITH_PRODUCTS }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    const NEW_FIXTURE = TestBed.createComponent(MercanciasComponent);
    const NEW_COMPONENT = NEW_FIXTURE.componentInstance;
    NEW_FIXTURE.detectChanges();

    // Verificar que se cargaron los productos
    expect(NEW_COMPONENT.producto.length).toBeGreaterThan(0);
    expect(NEW_COMPONENT.producto[0].descripcion).toBe('Producto desde el estado');
  });

  it('debe cargar detalles desde el estado si existen', () => {
    // Crear un mock con detalles
    const DETALLES: [number, Detalle[]][] = [
      [123, [{
        fraccionArancelaria: 'Fracción desde estado',
        cantidad: '50',
        unidadMedida: 'KG',
        nombreCientifico: 'Nombre científico desde estado',
        nombreComun: 'Nombre común desde estado',
        paisOrigen: 'País origen desde estado',
        paisProcedencia: 'País procedencia desde estado'
      }]]
    ];

    const MOCK_WITH_DETAILS = {
      selectTramiteState$: of({
        productos: [],
        detalles: DETALLES
      }),
    };

    // Crear un nuevo componente con el mock
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MercanciasComponent, CommonModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite250103Store, useValue: MOCK_STORE },
        { provide: Tramite250103Query, useValue: MOCK_WITH_DETAILS }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    const NEW_FIXTURE = TestBed.createComponent(MercanciasComponent);
    const NEW_COMPONENT = NEW_FIXTURE.componentInstance;
    NEW_FIXTURE.detectChanges();

    // Verificar que se cargaron los detalles
    expect(NEW_COMPONENT.mapaDetalles.has(123)).toBe(true);
    const LOADED_DETAILS = NEW_COMPONENT.mapaDetalles.get(123);
    expect(LOADED_DETAILS?.length).toBe(1);
    expect(LOADED_DETAILS?.[0].fraccionArancelaria).toBe('Fracción desde estado');
  });
});
