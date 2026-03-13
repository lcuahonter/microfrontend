import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { DomicilioComponent } from './domicilio-establecimiento.component';
import { DatosDomicilioLegalStore } from '../../estados/stores/datos-domicilio-legal.store';
import { DatosDomicilioLegalQuery } from '../../estados/queries/datos-domicilio-legal.query';
import { DatosDomicilioLegalService } from '../../services/datos-domicilio-legal.service';
import {
  CatalogoSelectComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';

describe('DomicilioComponent', () => {
  let component: DomicilioComponent;
  let fixture: ComponentFixture<DomicilioComponent>;
  let store: DatosDomicilioLegalStore;
  let query: DatosDomicilioLegalQuery;
  let service: any;

  beforeEach(async () => {
    const mockQuery = {
      selectSolicitud$: of({
        codigoPostal: '12345',
        estado: 'TestEstado',
        muncipio: 'TestMunicipio',
        localidad: 'TestLocalidad',
        colonia: 'TestColonia',
        calle: 'TestCalle',
        lada: '123',
        telefono: '9876543210',
        avisoCheckbox: true,
        licenciaSanitaria: 'TestLicencia',
      }),
    };

    const mockStore = {
      setCodigoPostal: jest.fn(),
      setEstado: jest.fn(),
      setMuncipio: jest.fn(),
      setLocalidad: jest.fn(),
      setColonia: jest.fn(),
      setCalle: jest.fn(),
      setLada: jest.fn(),
      setTelefono: jest.fn(),
      setAvisoCheckbox: jest.fn(),
      setLicenciaSanitaria: jest.fn(),
      setPaisDeOriginDatos: jest.fn(), // <-- Add this line
    };

    const mockService = {
      getObtenerEstadoList: jest
        .fn()
        .mockReturnValue(of({ data: [{ id: 1, descripcion: 'Estado 1' }] })),
      getObtenerScianTablaDatos: jest.fn().mockReturnValue(of({ data: [] })),
      getObtenerDataMercanciasDatos: jest.fn().mockReturnValue(of({ data: [] })),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        DomicilioComponent, // Import the standalone component
        TituloComponent,
        CatalogoSelectComponent,
        TablaDinamicaComponent,
      ],
      providers: [
        FormBuilder,
        { provide: DatosDomicilioLegalQuery, useValue: mockQuery },
        { provide: DatosDomicilioLegalStore, useValue: mockStore },
        { provide: DatosDomicilioLegalService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioComponent);
    component = fixture.componentInstance;

    store = TestBed.inject(DatosDomicilioLegalStore);
    query = TestBed.inject(DatosDomicilioLegalQuery);
    service = TestBed.inject(DatosDomicilioLegalService);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.domicilio).toBeDefined();
    expect(component.domicilio.get('codigoPostal')?.value).toBe('12345');
    expect(component.domicilio.get('estado')?.value).toBe('TestEstado');
    expect(component.domicilio.get('telefono')?.value).toBe('9876543210');
  });

  it('should fetch estado list on initialization', () => {
    expect(service.getObtenerEstadoList).toHaveBeenCalled();
    expect(component.estado).toEqual([{ id: 1, descripcion: 'Estado 1' }]);
  });

  it('should fetch table data on initialization', () => {
    expect(component.nicoTablaDatos).toEqual([]);
  });

  it('should fetch mercancias data on initialization', () => {
    expect(component.mercanciasTablaDatos).toEqual([]);
  });

  it('should disable licenciaSanitaria when avisoCheckbox is checked', () => {
    const checkbox = { target: { checked: true } } as unknown as Event;
    component.onAvisoCheckboxChange(checkbox);
    expect(component.domicilio.get('licenciaSanitaria')?.disabled).toBe(true);
  });

  it('should enable licenciaSanitaria when avisoCheckbox is unchecked', () => {
    const checkbox = { target: { checked: false } } as unknown as Event;
    component.onAvisoCheckboxChange(checkbox);
    expect(component.domicilio.get('licenciaSanitaria')?.enabled).toBe(true);
  });

  it('should toggle colapsable state', () => {
    expect(component.colapsable).toBe(false);
    component.mostrar_colapsable();
    expect(component.colapsable).toBe(true);
  });

  it('should call mostrar_colapsableDuos and toggle colapsableDuos', () => {
    expect(component.colapsableDuos).toBe(false);
    component.mostrar_colapsableDuos();
    expect(component.colapsableDuos).toBe(true);
  });

  it('should call mostrar_colapsableTres and toggle colapsableTres', () => {
    expect(component.colapsableTres).toBe(false);
    component.mostrar_colapsableTres();
    expect(component.colapsableTres).toBe(true);
  });

  it('should set values in the store when setValoresStore is called', () => {
    component.domicilio.get('codigoPostal')?.setValue('54321');
    component.setValoresStore(
      component.domicilio,
      'codigoPostal',
      'setCodigoPostal'
    );
    expect(store.setCodigoPostal).toHaveBeenCalledWith('54321');
  });

  it('should unsubscribe from destroyNotifier$ on destroy', () => {
    jest.spyOn(component['destroyNotifier$'], 'next');
    jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroyNotifier$'].next).toHaveBeenCalled();
    expect(component['destroyNotifier$'].complete).toHaveBeenCalled();
  });

  it('should handle null solicitudState gracefully', () => {
    component.solicitudState = null as any;
    component.ngOnInit();
    expect(component.domicilio).toBeDefined();
  });

  it('should handle destroyNotifier$ being called multiple times', () => {
    jest.spyOn(component['destroyNotifier$'], 'next');
    jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();
    component.ngOnDestroy(); // Call again to ensure no errors occur

    // Both should be called twice
    expect(component['destroyNotifier$'].next).toHaveBeenCalledTimes(2);
    expect(component['destroyNotifier$'].complete).toHaveBeenCalledTimes(2);
  });

  it('should fetch table data on initialization when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.ngOnInit();
    expect(service.getObtenerScianTablaDatos).toHaveBeenCalled();
  });

  it('should fetch mercancias data from service when esFormularioSoloLectura is true', () => {
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(service.getObtenerDataMercanciasDatos).toHaveBeenCalled();
  });

  it('should call mostrarModeloClave and not throw', () => {
    component.modalInstance = { show: jest.fn() } as any;
    expect(() => component.mostrarModeloClave()).not.toThrow();
    expect(component.modalInstance.show).toHaveBeenCalled();
  });

  it('should call cerrarModalScian and not throw', () => {
    component.modalInstance = { hide: jest.fn() } as any;
    expect(() => component.cerrarModalScian()).not.toThrow();
    expect(component.modalInstance.hide).toHaveBeenCalled();
  });

  it('should call limpiarScianForm and reset formAgente', () => {
    component.formAgente = component.fb.group({
      claveScianModal: ['test'],
      claveDescripcionModal: ['desc'],
    });
    const spy = jest.spyOn(component.formAgente, 'reset');
    component.limpiarScianForm();
    expect(spy).toHaveBeenCalled();
  });

  it('should not add mercancia if form is invalid', () => {
    // Re-initialize the form with validators as in the component
    component.ngOnInit();
    // Set all required fields to empty to make the form invalid
    component.formMercancias.reset();
    component.listaMercancias = [];
    // Mark all controls as touched to trigger validation
    Object.values(component.formMercancias.controls).forEach(control => control.markAsTouched());
    component.agregarMercancia();
    expect(component.listaMercancias.length).toBe(0);
  });

  it('should add mercancia if form is valid', () => {
    component.formMercancias = component.fb.group({
      nombreComercial: ['Merc', []],
      nombreComun: ['Com', []],
      nombreCientifico: ['Cien', []],
      usoEspecifico: ['Uso', []],
      fraccionArancelaria: ['12345678', []],
      descripcionFraccion: ['Desc', []],
      cantidadUMT: ['1', []],
      UMT: ['UMT', []],
      cantidadUMC: ['1', []],
      UMC: ['UMC', []],
      porcentajeConcentracion: ['10', []],
      numeroRegistro: ['Reg', []],
      clasificacionToxicologica: ['Tox', []],
      objetoImportacion: ['Obj', []],
    });
    component.listaMercancias = [];
    jest.spyOn(component.formMercancias, 'valid', 'get').mockReturnValue(true);
    component.agregarMercancia();
    expect(component.listaMercancias.length).toBe(1);
  });

  it('should patch descripcionFraccion on fraccionArancelaria value change in guardarScian', () => {
    component.formAgente = component.fb.group({
      claveScianModal: ['clave'],
      claveDescripcionModal: ['desc'],
    });
    component.formMercancias = component.fb.group({
      fraccionArancelaria: ['0101.21.01'],
      descripcionFraccion: [''],
    });
    component.fraccionesCatalogo = [
      { fraccion: '0101.21.01', descripcion: 'Caballos de carrera' },
    ];
    jest.spyOn(component.formAgente, 'valid', 'get').mockReturnValue(true);

    // Mock modalInstance to prevent TypeError
    component.modalInstance = { hide: jest.fn() } as any;

    component.guardarScian();
    component.formMercancias.get('fraccionArancelaria')?.setValue('0101.21.01');
    expect(component.formMercancias.get('descripcionFraccion')?.value).toBe(
      'Caballos de carrera'
    );
  });

  it('should update seleccionadasAduanasEntradaDatos and patch value on aduanasEntradaSeleccionadasChange', () => {
    const spy = jest.spyOn(component.domicilio, 'patchValue');
    component.aduanasEntradaSeleccionadasChange(['Aduana1', 'Aduana2']);
    expect(component.seleccionadasAduanasEntradaDatos).toEqual(['Aduana1', 'Aduana2']);
    expect(spy).toHaveBeenCalledWith({ paisDeOriginDatos: ['Aduana1', 'Aduana2'] });
  });

  it('should patch claveDescripcionModal on onClaveScianChange', () => {
    component.estado = [{ id: 1, descripcion: 'desc1' }];
    component.formAgente = component.fb.group({
      claveScianModal: [''],
      claveDescripcionModal: [''],
    });
    const event = { target: { value: '1' } } as any;
    component.onClaveScianChange(event);
    expect(component.formAgente.get('claveDescripcionModal')?.value).toBe('desc1');
  });

  it('should update establecimientoBodyData on actualizarPaginacion', () => {
    // Force the property to any[] for test assignment
    (component.fullEstablecimientoBodyData as any) = [1, 2, 3, 4, 5, 6];
    component.elementosPorPagina = 2;
    component.paginaActual = 2;
    component.actualizarPaginacion();
    expect(component.establecimientoBodyData).toEqual([3, 4]);
  });

  it('should update paginaActual and call actualizarPaginacion on onCambioDePagina', () => {
    const spy = jest.spyOn(component, 'actualizarPaginacion');
    component.onCambioDePagina(3);
    expect(component.paginaActual).toBe(3);
    expect(spy).toHaveBeenCalled();
  });

  it('should update elementosPorPagina and call actualizarPaginacion on onCambioElementosPorPagina', () => {
    const spy = jest.spyOn(component, 'actualizarPaginacion');
    component.onCambioElementosPorPagina(10);
    expect(component.elementosPorPagina).toBe(10);
    expect(component.paginaActual).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should reset the given form in limpiar', () => {
    const form = component.fb.group({ test: ['value'] });
    form.get('test')?.setValue('changed');
    component.limpiar(form);
    expect(form.get('test')?.value).toBeNull();
  });
});
