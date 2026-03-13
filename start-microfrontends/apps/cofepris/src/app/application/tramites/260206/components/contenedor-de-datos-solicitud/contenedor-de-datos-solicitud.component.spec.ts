import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260206Query } from '../../estados/queries/tramite260206Query.query';
import { Tramite260206Store } from '../../estados/stores/tramite260206Store.store';
import { CommonModule } from '@angular/common';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDeTablaSeleccionados, DatosSolicitudFormState, TablaMercanciasDatos, TablaOpcionConfig, TablaScianConfig, TablaSeleccion } from '../../../../shared/models/datos-solicitud.model';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SeccionLibQuery, SeccionLibStore } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let fixture: ComponentFixture<ContenedorDeDatosSolicitudComponent>;
  let mockTramite260206Query: jest.Mocked<Tramite260206Query>;
  let mockTramite260206Store: jest.Mocked<Tramite260206Store>;
  let mockSeccionLibQuery: jest.Mocked<SeccionLibQuery>;
  let mockSeccionLibStore: jest.Mocked<SeccionLibStore>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  beforeEach(() => {
    mockTramite260206Query = {
      selectTramiteState$: of({
        opcionConfigDatos: [],
        scianConfigDatos: [],
        tablaMercanciasConfigDatos: [],
        datosSolicitudFormState: {
          rfcSanitario: 'test-rfc'
        },
        seleccionadoopcionDatos: [],
        seleccionadoScianDatos: [],
        seleccionadoTablaMercanciasDatos: [],
        opcionesColapsableState: false
      }) as any,
    } as unknown as jest.Mocked<Tramite260206Query>;

    mockTramite260206Store = {
      updateOpcionConfigDatos: jest.fn() as any,
      updateScianConfigDatos: jest.fn() as any,
      updateTablaMercanciasConfigDatos: jest.fn() as any,
      updateDatosSolicitudFormState: jest.fn() as any,
      update: jest.fn() as any,
    } as unknown as jest.Mocked<Tramite260206Store>;

    mockSeccionLibQuery = {
      selectSeccionState$: of({
        formaValida: [false, false, false],
      }) as any,
    } as unknown as jest.Mocked<SeccionLibQuery>;

    mockSeccionLibStore = {
      establecerFormaValida: jest.fn() as any,
    } as unknown as jest.Mocked<SeccionLibStore>;

    mockConsultaioQuery = {
      selectConsultaioState$: of({
        create: false,
        readonly: true,
        procedureId: '260206'
      }) as any,
    } as unknown as jest.Mocked<ConsultaioQuery>;

    TestBed.configureTestingModule({
      declarations: [],
      imports: [CommonModule, DatosDeLaSolicitudComponent, ContenedorDeDatosSolicitudComponent, HttpClientTestingModule],
      providers: [
        { provide: Tramite260206Query, useValue: mockTramite260206Query },
        { provide: Tramite260206Store, useValue: mockTramite260206Store },
        { provide: SeccionLibQuery, useValue: mockSeccionLibQuery },
        { provide: SeccionLibStore, useValue: mockSeccionLibStore },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties correctly', () => {
    expect(component.idProcedimiento).toBe(260206);
    expect(component.opcionConfig.configuracionTabla).toBeDefined();
    expect(component.scianConfig.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
    expect(component.tablaMercanciasConfig.tipoSeleccionTabla).toBe(TablaSeleccion.CHECKBOX);
    expect(component.elementosRequeridos).toBeDefined();
  });

  it('should not set esFormularioSoloLectura when create is true', () => {
    // Reset the mock to return create: true
    mockConsultaioQuery.selectConsultaioState$ = of({
      create: true,
      readonly: false,
      procedureId: '260206'
    }) as any;

    // Create a new component instance
    const newFixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    const newComponent = newFixture.componentInstance;

    expect(newComponent.esFormularioSoloLectura).toBeUndefined();
  });

  it('should not set esFormularioSoloLectura when procedureId is not 260206', () => {
    // Reset the mock to return different procedureId
    mockConsultaioQuery.selectConsultaioState$ = of({
      create: false,
      readonly: true,
      procedureId: '123456'
    }) as any;

    // Create a new component instance
    const newFixture = TestBed.createComponent(ContenedorDeDatosSolicitudComponent);
    const newComponent = newFixture.componentInstance;

    expect(newComponent.esFormularioSoloLectura).toBeUndefined();
  });

  it('should initialize tramiteState and config data on ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.tramiteState).toBeDefined();
    expect(component.opcionConfig.datos).toEqual([]);
    expect(component.scianConfig.datos).toEqual([]);
    expect(component.tablaMercanciasConfig.datos).toEqual([]);
  });

  it('opcionSeleccionado should call updateOpcionConfigDatos on the store', () => {
    const mockEvent: TablaOpcionConfig[] = [{ fechaCreacion: 'test', mercancia: 'test', cantidad: 'test', proveedor: 'test' }];
    component.opcionSeleccionado(mockEvent);
    expect(mockTramite260206Store.updateOpcionConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('scianSeleccionado should call updateScianConfigDatos on the store', () => {
    const mockEvent: TablaScianConfig[] = [{ descripcion: 'test', clave: 'testClave'}];
    component.scianSeleccionado(mockEvent);
    expect(mockTramite260206Store.updateScianConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('mercanciasSeleccionado should call updateTablaMercanciasConfigDatos on the store', () => {
    const mockEvent: TablaMercanciasDatos[] = [{
      clasificacionProducto: 'test',
      especificarClasificacionProducto: '',
      denominacionEspecificaProducto: '',
      denominacionDistintiva: '',
      denominacionComun: '',
      formaFarmaceutica: '',
      estadoFisico: '',
      fraccionArancelaria: '',
      descripcionFraccion: '',
      unidadMedidaComercializacion: '',
      cantidadUMC: '',
      unidadMedidaTarifa: '',
      cantidadUMT: '',
      presentacion: '',
      numeroRegistroSanitario: '',
      paisOrigen: '',
      paisProcedencia: '',
      tipoProducto: '',
      usoEspecifico: ''
    }];
    component.mercanciasSeleccionado(mockEvent);
    expect(mockTramite260206Store.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(mockEvent);
  });

  it('datosDeTablaSeleccionados should call update on the store with correct data', () => {
    const mockEvent: DatosDeTablaSeleccionados = {
      opcionSeleccionados: [{ fechaCreacion: 'test', mercancia: 'test', cantidad: 'test', proveedor: 'test' }],
      scianSeleccionados: [{ descripcion: 'test', clave: 'num test' }],
      mercanciasSeleccionados: [{
        clasificacionProducto: 'test',
        especificarClasificacionProducto: '',
        denominacionEspecificaProducto: '',
        denominacionDistintiva: '',
        denominacionComun: '',
        formaFarmaceutica: '',
        estadoFisico: '',
        fraccionArancelaria: '',
        descripcionFraccion: '',
        unidadMedidaComercializacion: '',
        cantidadUMC: '',
        unidadMedidaTarifa: '',
        cantidadUMT: '',
        presentacion: '',
        numeroRegistroSanitario: '',
        paisOrigen: '',
        paisProcedencia: '',
        tipoProducto: '',
        usoEspecifico: ''
      }],
      opcionesColapsableState: false
    };
    component.datosDeTablaSeleccionados(mockEvent);
    expect(mockTramite260206Store.update).toHaveBeenCalled();
  });

  it('should test datasolicituActualizar method when form is valid', () => {
    const mockEvent: DatosSolicitudFormState = {
      rfcSanitario: 'test-rfc',
      // Add other required properties based on your model
    } as DatosSolicitudFormState;

    // Set up the tramiteState with valid form data
    component.tramiteState = {
      datosSolicitudFormState: {
        rfcSanitario: 'test-rfc'
      }
    } as any;

    // Set up seccion with initial form validation state
    component['seccion'] = {
      formaValida: [false, false, false]
    } as any;

    component.datasolicituActualizar(mockEvent);

    expect(mockTramite260206Store.updateDatosSolicitudFormState).toHaveBeenCalledWith(mockEvent);
    expect(mockSeccionLibStore.establecerFormaValida).toHaveBeenCalledWith([false, true, false]);
  });

  it('should test datasolicituActualizar method when form is invalid', () => {
    const mockEvent: DatosSolicitudFormState = {
      rfcSanitario: '',
      // Add other required properties based on your model
    } as DatosSolicitudFormState;

    // Set up the tramiteState with invalid form data
    component.tramiteState = {
      datosSolicitudFormState: {
        rfcSanitario: ''
      }
    } as any;

    // Set up seccion with initial form validation state
    component['seccion'] = {
      formaValida: [false, false, false]
    } as any;

    component.datasolicituActualizar(mockEvent);

    expect(mockTramite260206Store.updateDatosSolicitudFormState).toHaveBeenCalledWith(mockEvent);
    expect(mockSeccionLibStore.establecerFormaValida).toHaveBeenCalledWith([false, false, false]);
  });

  it('should test esFormValido method returns true when rfcSanitario exists', () => {
    component.tramiteState = {
      datosSolicitudFormState: {
        rfcSanitario: 'test-rfc'
      }
    } as any;

    const result = component.esFormValido();
    expect(result).toBe(true);
  });

  it('should test esFormValido method returns false when rfcSanitario is empty', () => {
    component.tramiteState = {
      datosSolicitudFormState: {
        rfcSanitario: ''
      }
    } as any;

    const result = component.esFormValido();
    expect(result).toBe(false);
  });

  it('should test esFormValido method returns false when rfcSanitario is null or undefined', () => {
    component.tramiteState = {
      datosSolicitudFormState: {
        rfcSanitario: null
      }
    } as any;

    let result = component.esFormValido();
    expect(result).toBe(false);

    component.tramiteState = {
      datosSolicitudFormState: {
        rfcSanitario: undefined
      }
    } as any;

    result = component.esFormValido();
    expect(result).toBe(false);
  });

  it('ngOnDestroy should emit and complete destroyNotifier$', () => {
    const destroyNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeNotifierSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroyNotifierSpy).toHaveBeenCalledTimes(1);
    expect(completeNotifierSpy).toHaveBeenCalledTimes(1);
  });
});