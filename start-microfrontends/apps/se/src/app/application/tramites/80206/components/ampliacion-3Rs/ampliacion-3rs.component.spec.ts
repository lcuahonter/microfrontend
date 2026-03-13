import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';

import { Ampliacion3RsComponent } from './ampliacion-3rs.component';
import { AmpliacionServiciosService } from '../../services/ampliacion-servicios.service';
import { AmpliacionServiciosQuery } from '../../estados/tramite80206.query';
import { Tramite80206Store } from '../../estados/tramite80206.store';
import { CatalogoServices } from '@ng-mf/data-access-user';
import { SeccionLibStore } from '@ng-mf/data-access-user';

class MockAmpliacionServiciosService {
  obtenerReglaSelectList = jest.fn();
  obtenerSectorSelectList = jest.fn();
  obtenerSectoresImmex = jest.fn();
  enviarDeberiaMostrar = jest.fn();
}

class MockAmpliacionServiciosQuery {
  selectSolicitudTramite$ = of({});
}

class MockTramite80206Store {
  setReglaSeleccionada = jest.fn();
  setSectorDesplegable = jest.fn();
  setDatosSector = jest.fn();
  setIsSelectedRegla = jest.fn();
  setSeleccionarRegla = jest.fn();
  setSector = jest.fn();
}

class MockCatalogoServices {
  seleccionarReglaCatalogo = jest.fn();
  sectoresCatalogo = jest.fn();
}

class MockSeccionLibStore {
  establecerSeccion = jest.fn();
  establecerFormaValida = jest.fn();
}

describe('Ampliacion3RsComponent (Jest en español)', () => {
  let fixture: ComponentFixture<Ampliacion3RsComponent>;
  let component: Ampliacion3RsComponent;

  let svc: MockAmpliacionServiciosService;
  let query: MockAmpliacionServiciosQuery;
  let store: MockTramite80206Store;
  let catalogoServices: MockCatalogoServices;
  let seccionStore: MockSeccionLibStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [Ampliacion3RsComponent],
      providers: [
        FormBuilder,
        { provide: AmpliacionServiciosService, useClass: MockAmpliacionServiciosService },
        { provide: AmpliacionServiciosQuery, useClass: MockAmpliacionServiciosQuery },
        { provide: Tramite80206Store, useClass: MockTramite80206Store },
        { provide: CatalogoServices, useClass: MockCatalogoServices },
        { provide: SeccionLibStore, useClass: MockSeccionLibStore },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(Ampliacion3RsComponent);
    component = fixture.componentInstance;
  
    svc = TestBed.inject(AmpliacionServiciosService) as any;
    query = TestBed.inject(AmpliacionServiciosQuery) as any;
    store = TestBed.inject(Tramite80206Store) as any;
    catalogoServices = TestBed.inject(CatalogoServices) as any;
    seccionStore = TestBed.inject(SeccionLibStore) as any;
  
    (query as any).selectSolicitudTramite$ = of({
      reglaSeleccionada: [{ clave: '3.2.25', descripcion: 'Regla 3.2.25' }],
      sectorDesplegable: [{ clave: '01', descripcion: 'Sector 01' }],
      datosSector: [],
      isSelectedRegla: false,
      seleccionaLaModalidad: 'Ampliación 3RS',
      seleccionarRegla: '',
      sector: '',
    });
  });

  beforeEach(() => {
    if (!(query as any).selectSolicitudTramite$) {
      (query as any).selectSolicitudTramite$ = of({
        reglaSeleccionada: [{ clave: '3.2.25', descripcion: 'Regla 3.2.25' }],
        sectorDesplegable: [{ clave: '01', descripcion: 'Sector 01' }],
        datosSector: [],
        isSelectedRegla: false,
        seleccionaLaModalidad: 'Ampliación 3RS',
        seleccionarRegla: '',
        sector: '',
      });
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
    fixture.destroy();
  });

  it('debería crearse y tener el formulario inicializado en el constructor', () => {
    expect(component).toBeTruthy();
    expect(component.formularioInfoRegistro).toBeTruthy();
    expect(component.formularioInfoRegistro.get('seleccionaLaModalidad')).toBeTruthy();
    expect(component.formularioInfoRegistro.get('seleccionarRegla')).toBeTruthy();
    expect(component.formularioInfoRegistro.get('sector')).toBeTruthy();
  });

  it('debería inicializar el formulario al invocar inicializarFormularioInfoRegistro()', () => {
    const spy = jest.spyOn((component as any).fb, 'group');
    component.inicializarFormularioInfoRegistro();
    expect(spy).toHaveBeenCalled();
    expect(component.formularioInfoRegistro.get('seleccionaLaModalidad')).toBeTruthy();
  });

  it('debería cargar y propagar datos desde el almacén en inicializarFormularioDesdeAlmacen()', () => {
    (query as any).selectSolicitudTramite$ = of({
      datosSector: [{ descripcion: 'A' }],
      isSelectedRegla: true,
      seleccionaLaModalidad: 'X',
      seleccionarRegla: '2',
      sector: '3',
    });

    const patchSpy = jest.spyOn(component.formularioInfoRegistro, 'patchValue');
    component.inicializarFormularioDesdeAlmacen();

    expect(patchSpy).toHaveBeenCalledWith({
      seleccionaLaModalidad: 'X',
      seleccionarRegla: '2',
      sector: '3',
    });
    expect(component.datosSector).toEqual([{ descripcion: 'A' }]);
    expect(component.isSelectedRegla).toBe(true);
    expect(svc.enviarDeberiaMostrar).toHaveBeenCalledWith(true);
  });

  it('debería obtener reglas y actualizar el store en obtenerReglaSelectList()', () => {
    const mockReglas = [{ clave: '3.2.25', descripcion: 'Regla 3.2.25' }];
    catalogoServices.seleccionarReglaCatalogo.mockReturnValue(of({ datos: mockReglas }));

    component.obtenerReglaSelectList('80206');

    expect(catalogoServices.seleccionarReglaCatalogo).toHaveBeenCalledWith('80206');
    expect(store.setReglaSeleccionada).toHaveBeenCalledWith(mockReglas);
  });

  it('debería obtener sectores y actualizar el store en obtenerSectorSelectList()', () => {
    const mockSectores = [{ clave: '01', descripcion: 'Sector 01' }];
    catalogoServices.sectoresCatalogo.mockReturnValue(of({ datos: mockSectores }));

    component.obtenerSectorSelectList();

    expect(catalogoServices.sectoresCatalogo).toHaveBeenCalledWith('80206');
    expect(store.setSectorDesplegable).toHaveBeenCalledWith(mockSectores);
  });

  it('debería eliminar filas seleccionadas en eliminarServiciosGrid()', () => {
    component.datosSector = [
      { descripcion: 'A', clave: '01' },
      { descripcion: 'B', clave: '02' },
      { descripcion: 'C', clave: '03' },
    ];
    component.domiciliosSeleccionados = [
      { descripcion: 'A', clave: '01' },
      { descripcion: 'C', clave: '03' }
    ];

    component.eliminarServiciosGrid();

    expect(store.setDatosSector).toHaveBeenCalledWith([{ descripcion: 'B', clave: '02' }]);
    expect(component.domiciliosSeleccionados).toEqual([]);
  });

  it('debería marcar selección de domicilios en seleccionarDomicilios()', () => {
    const entrada = [{ descripcion: 'D1', clave: '01' }, { descripcion: 'D2', clave: '02' }];
    component.seleccionarDomicilios(entrada);
    expect(component.domiciliosSeleccionados).toEqual(entrada);
    expect(component.domiciliosSeleccionados).not.toBe(entrada);
  });

  it('debería procesar datos del hijo con regla 3.2.25 (isSelectedRegla=true)', () => {
    component.formularioInfoRegistro.get('seleccionarRegla')?.setValue('3.2.25');

    component.procesarDatosDelHijo();

    expect(component.isSelectedRegla).toBe(true);
    expect(component.mostrarAlerta).toBe(false);
    expect(svc.enviarDeberiaMostrar).toHaveBeenCalledWith(true);
    expect(store.setIsSelectedRegla).toHaveBeenCalledWith(true);
    expect(store.setSeleccionarRegla).toHaveBeenCalledWith('3.2.25');
  });

  it('debería procesar datos del hijo con regla diferente (isSelectedRegla=false) y mostrar alerta', () => {
    component.formularioInfoRegistro.get('seleccionarRegla')?.setValue('3.2.24');

    component.procesarDatosDelHijo();

    expect(component.isSelectedRegla).toBe(false);
    expect(component.mostrarAlerta).toBe(true);
    expect(svc.enviarDeberiaMostrar).toHaveBeenCalledWith(false);
    expect(store.setIsSelectedRegla).toHaveBeenCalledWith(false);
    expect(store.setSeleccionarRegla).toHaveBeenCalledWith('3.2.24');
  });

  it('debería cambiar el sector en cambioDeSector()', () => {
    component.formularioInfoRegistro.get('sector')?.setValue('01');

    component.cambioDeSector();

    expect(store.setSector).toHaveBeenCalledWith('01');
  });

  it('debería activar y cerrar el modal (activarModal / aceptar / cerrarModal)', () => {
    expect(component.mostrarAlerta).toBe(false);
    component.activarModal();
    expect(component.mostrarAlerta).toBe(true);
    component.aceptar();
    expect(component.mostrarAlerta).toBe(false);
    component.activarModal();
    component.cerrarModal();
    expect(component.mostrarAlerta).toBe(false);
  });

  it('debería ejecutar ngOnDestroy limpiando suscripciones y notificando al servicio', () => {
    const notifier = (component as any).destroyNotifier$ as Subject<void>;
    const nextSpy = jest.spyOn(notifier, 'next');
    const completeSpy = jest.spyOn(notifier, 'complete');

    component.ngOnDestroy();

    expect(svc.enviarDeberiaMostrar).toHaveBeenCalledWith(true);
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería mostrar alerta si no hay sector seleccionado en agregarServiciosAmpliacion()', () => {
    component.formularioInfoRegistro.get('sector')?.setValue('');

    component.agregarServiciosAmpliacion();

    expect(component.mostrarAlerta).toBe(true);
    expect(component.mensajeDeAlerta).toBe('Debe seleccionar un sector.');
  });

  it('debería agregar sector exitosamente cuando la API responde correctamente', () => {
    component.formularioInfoRegistro.get('sector')?.setValue('02');
    component.sectorDesplegable = [{
      clave: '02', descripcion: 'Sector 02',
      id: 0
    }];
    component.datosSector = [];

    const mockResponse = {
      codigo: '00',
      datos: { sector: '02' }
    };
    svc.obtenerSectoresImmex.mockReturnValue(of(mockResponse));

    component.agregarServiciosAmpliacion();

    expect(svc.obtenerSectoresImmex).toHaveBeenCalledWith({ sectorImmex: '02' });
    expect(store.setDatosSector).toHaveBeenCalledWith([{ clave: '02', descripcion: 'Sector 02' }]);
    expect(component.formularioInfoRegistro.get('sector')?.value).toBe('');
  });

  it('debería mostrar alerta cuando la API responde con error en agregarServiciosAmpliacion()', () => {
    component.formularioInfoRegistro.get('sector')?.setValue('03');
    component.datosSector = [];

    const mockResponse = {
      codigo: '01',
      error: 'Error del servidor',
      mensaje: 'Sector no encontrado'
    };
    svc.obtenerSectoresImmex.mockReturnValue(of(mockResponse));

    component.agregarServiciosAmpliacion();

    expect(component.mostrarAlerta).toBe(true);
    expect(component.mensajeDeAlerta).toBe('Error del servidor');
  });

  it('debería mostrar alerta cuando la API no devuelve datos en agregarServiciosAmpliacion()', () => {
    component.formularioInfoRegistro.get('sector')?.setValue('04');
    component.datosSector = [];

    const mockResponse = {
      codigo: '00',
      datos: null
    };
    svc.obtenerSectoresImmex.mockReturnValue(of(mockResponse));

    component.agregarServiciosAmpliacion();

    expect(component.mostrarAlerta).toBe(true);
    expect(component.mensajeDeAlerta).toBe('No se encontraron datos para el sector especificado.');
  });

it('debería manejar errores HTTP en agregarServiciosAmpliacion()', () => {
  component.formularioInfoRegistro.get('sector')?.setValue('05');
  component.datosSector = [];

  // This test intentionally triggers a console.error - this is expected behavior
  svc.obtenerSectoresImmex.mockReturnValue(throwError('Error de conexión'));

  component.agregarServiciosAmpliacion();

  expect(component.mostrarAlerta).toBe(true);
  expect(component.mensajeDeAlerta).toBe('Error al conectar con el servidor. Intente nuevamente.');
});

  it('debería retornar false si el formulario no existe en validarFormulario()', () => {
    component.formularioInfoRegistro = null as any;

    const result = component.validarFormulario();

    expect(result).toBe(false);
  });

  it('debería retornar false si seleccionaLaModalidad está vacía en validarFormulario()', () => {
    component.formularioInfoRegistro.get('seleccionaLaModalidad')?.setValue('');

    const result = component.validarFormulario();

    expect(result).toBe(false);
  });

  it('debería retornar false si seleccionarRegla no está seleccionada en validarFormulario()', () => {
    component.formularioInfoRegistro.get('seleccionaLaModalidad')?.setValue('Ampliación 3RS');
    component.formularioInfoRegistro.get('seleccionarRegla')?.setValue('');

    const result = component.validarFormulario();

    expect(result).toBe(false);
  });

  it('debería retornar false si regla es 3.2.25 pero no hay sectores en validarFormulario()', () => {
    component.formularioInfoRegistro.get('seleccionaLaModalidad')?.setValue('Ampliación 3RS');
    component.formularioInfoRegistro.get('seleccionarRegla')?.setValue('3.2.25');
    component.isSelectedRegla = true;
    component.datosSector = [];

    const result = component.validarFormulario();

    expect(result).toBe(false);
  });

  it('debería retornar true si el formulario es válido en validarFormulario()', () => {
    component.formularioInfoRegistro.get('seleccionaLaModalidad')?.setValue('Ampliación 3RS');
    component.formularioInfoRegistro.get('seleccionarRegla')?.setValue('3.2.25');
    component.isSelectedRegla = true;
    component.datosSector = [{ clave: '01', descripcion: 'Sector 01' }];

    const result = component.validarFormulario();

    expect(result).toBe(true);
  });

  it('debería tener las propiedades iniciales correctas', () => {
    expect(component.isSelectedRegla).toBe(false);
    expect(component.tablaSeleccion).toBeDefined();
    expect(component.datosSector).toEqual([]);
    expect(component.domiciliosSeleccionados).toEqual([]);
    expect(component.esFormularioSoloLectura).toBe(false);
    expect(component.mostrarAlerta).toBe(false);
    expect(component.tramiteID).toBe('80206');
    expect(component.mensajeDeAlerta).toBe('');
    expect(component.predeterminado).toBe(-1);
  });

  
});