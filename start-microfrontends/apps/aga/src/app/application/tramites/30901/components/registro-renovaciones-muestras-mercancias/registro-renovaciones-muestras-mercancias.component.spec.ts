import { TestBed } from '@angular/core/testing';
import { RegistroRenovacionesMuestrasMercanciasComponent } from './registro-renovaciones-muestras-mercancias.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RenovacionesMuestrasMercanciasService } from '../../services/renovaciones-muestras-mercancias/renovaciones-muestras-mercancias.service';
import {
  Solicitud30901State,
  Solicitud30901Store,
} from '../../estados/tramites30901.store';
import { Solicitud30901Query } from '../../estados/tramites30901.query';
import { of } from 'rxjs';
import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegistroRenovacionesMuestrasMercanciasComponent', () => {
  let component: RegistroRenovacionesMuestrasMercanciasComponent;
  let fixture: any;
  let mockRenovacionesService: jest.Mocked<RenovacionesMuestrasMercanciasService>;
  let mockSolicitudStore: jest.Mocked<Solicitud30901Store>;
  let mockSolicitudQuery: jest.Mocked<Solicitud30901Query>;

  beforeEach(async () => {
    mockRenovacionesService = {
      obtenerOpcionesDesplegables: jest.fn(() => of({})),
    } as any;

    mockSolicitudStore = {
      setFraccionDescripcion: jest.fn(() => of('desc')),
      setNicoDescripcion: jest.fn(() => of('nico')),
      setNombreQuimico: jest.fn(() => of('quimico')),
      setNombreComercial: jest.fn(() => of('comercial')),
      setNumeroCAS: jest.fn(() => of('cas')),
      setIdeGenerica: jest.fn(() => of('ide')),
      setDescClobGenerica: jest.fn(() => of('clob')),
      setComboFraccionConcatenada: jest.fn(() => of('fraccion')),
      setComboNicos: jest.fn(() => of('combo')),
      setOpcionDeImportador: jest.fn(() => of('importador')),
      setTomaMuestraDespacho: jest.fn(() => of('despacho')),
      setDescMotivoFaltaMuestra: jest.fn(() => of('motivo')),
      setFraccionConcatenada: jest.fn(() => of('concatenada')),
    } as any;

    mockSolicitudQuery = {
      selectSolicitud$: of({}),
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RegistroRenovacionesMuestrasMercanciasComponent,
        CommonModule,
        ReactiveFormsModule,
        CatalogoSelectComponent,
        TituloComponent,
        AlertComponent,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        {
          provide: RenovacionesMuestrasMercanciasService,
          useValue: mockRenovacionesService,
        },
        { provide: Solicitud30901Store, useValue: mockSolicitudStore },
        { provide: Solicitud30901Query, useValue: mockSolicitudQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(
      RegistroRenovacionesMuestrasMercanciasComponent
    );
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    component.ngOnInit();
    expect(component.formRegistroMuestras).toBeDefined();
    expect(
      component.formRegistroMuestras.get('opcionDeImportador')
    ).toBeTruthy();
  });

  it('should patch form values when selectSolicitud$ emits', () => {
    const state = {
      opcionDeImportador: 1,
      tomaMuestraDespacho: 2,
      descMotivoFaltaMuestra: 'motivo',
      comboFraccionConcatenada: 3,
      fraccionConcatenada: 'desc',
      fracciondescripcion: 'desc fracc',
      comboNicos: 4,
      nicoDescripcion: 'nico desc',
      nombreQuimico: 'quimico',
      nombreComercial: 'comercial',
      numeroCAS: 'cas',
      ideGenerica: 'ide',
      descClobGenerica: 'clob',
      fechaInicioVigencia: '30/01/2023',
      fechaFinVigencia: '30/12/2023',
      lineaCaptura: 'linea',
      valorPago: '100',
      pagoDerechosLista: [],
    } as unknown as Solicitud30901State;
    mockSolicitudQuery.selectSolicitud$ = of(state);
    component.ngOnInit();
    expect(component.formRegistroMuestras.value.opcionDeImportador).toEqual(
      1
    );
    expect(component.formRegistroMuestras.value.tomaMuestraDespacho).toEqual(
      2
    );
  });

  beforeEach(() => {
    component.formRegistroMuestras = new FormBuilder().group({
      fraccionConcatenada: [''],
      fracciondescripcion: [''],
    });
  });

  it('should set description for id 1', () => {
    const valor: Catalogo = {
      id: 1,
      descripcion: '1 - Vacas lecheras.',
    } as Catalogo;
    component.mostrarDescFraccArancelaria(valor);
    expect(
      component.formRegistroMuestras.get('fraccionConcatenada')?.value
    ).toBe(undefined);
    expect(
      component.formRegistroMuestras.get('fracciondescripcion')?.value
    ).toBe(undefined);
    expect(mockSolicitudStore.setFraccionDescripcion).toHaveBeenCalledWith(
      'Vacas lecheras.'
    );
  });

  it('should set description for other id', () => {
    const valor: Catalogo = { id: 2, descripcion: '2 - Federal' } as Catalogo;
    component.mostrarDescFraccArancelaria(valor);
    expect(
      component.formRegistroMuestras.get('fracciondescripcion')?.value
    ).toBe(undefined);
  });

  it('should set panelDespachoOrMercancia to true for id 2', () => {
    component.mostrarOcultarPanelTramite({
      id: 2,
      descripcion: '',
    } as Catalogo);
    expect(component.panelDespachoOrMercancia).toBe(true);
    expect(mockSolicitudStore.setOpcionDeImportador).toHaveBeenCalledWith(2);
  });

  it('should set panelDespachoOrMercancia to false for other ids', () => {
    component.mostrarOcultarPanelTramite({
      id: 1,
      descripcion: '',
    } as Catalogo);
    expect(component.panelDespachoOrMercancia).toBe(false);
  });

  beforeEach(() => {
    component.formRegistroMuestras = new FormBuilder().group({
      descMotivoFaltaMuestra: [{ value: '', disabled: true }],
    });
  });

  it('should enable descMotivoFaltaMuestra for id 1', () => {
    component.cambiaEstadoMotivo({ id: 1, descripcion: 'desc' } as Catalogo);
    expect(
      component.formRegistroMuestras.get('descMotivoFaltaMuestra')?.enabled
    ).toBe(true);
    expect(mockSolicitudStore.setTomaMuestraDespacho).toHaveBeenCalledWith(
      'desc'
    );
  });

  it('should disable and clear descMotivoFaltaMuestra for id 0', () => {
    component.formRegistroMuestras.get('descMotivoFaltaMuestra')?.enable();
    component.cambiaEstadoMotivo({ id: 0, descripcion: 'desc' } as Catalogo);
    expect(
      component.formRegistroMuestras.get('descMotivoFaltaMuestra')?.disabled
    ).toBe(true);
    expect(
      component.formRegistroMuestras.get('descMotivoFaltaMuestra')?.value
    ).toBe('');
  });

  it('should disable descMotivoFaltaMuestra for other ids', () => {
    component.formRegistroMuestras.get('descMotivoFaltaMuestra')?.enable();
    component.cambiaEstadoMotivo({ id: 3, descripcion: 'desc' } as Catalogo);
    expect(
      component.formRegistroMuestras.get('descMotivoFaltaMuestra')?.disabled
    ).toBe(true);
  });

  it('should update store with descMotivoFaltaMuestra', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      descMotivoFaltaMuestra: ['motivo'],
    });
    component.setDescMotivoFaltaMuestra();
    expect(mockSolicitudStore.setDescMotivoFaltaMuestra).toHaveBeenCalledWith(
      'motivo'
    );
  });

  it('should update store with fracciondescripcion', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      fracciondescripcion: ['desc'],
    });
    component.setFracciondescripcion();
    expect(mockSolicitudStore.setFraccionDescripcion).toHaveBeenCalledWith(
      'desc'
    );
  });

  it('should set nico description for id 1', () => {
    component.setNino({
      id: 1,
      descripcion: '1 - Vacas lecheras.',
    } as Catalogo);
    expect(mockSolicitudStore.setNicoDescripcion).toHaveBeenCalledWith(
      'Vacas lecheras.'
    );
    expect(mockSolicitudStore.setComboNicos).toHaveBeenCalledWith(1);
  });

  it('should set nico description for other id', () => {
    component.setNino({ id: 2, descripcion: '2 - Para abasto' } as Catalogo);
    expect(mockSolicitudStore.setNicoDescripcion).toHaveBeenCalledWith(
      '2 - Para abasto, cuando la importación la realicen empacadoras Tipo Inspección Federal.'
    );
    expect(mockSolicitudStore.setComboNicos).toHaveBeenCalledWith(2);
  });

  it('should update store with nicoDescripcion', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      nicoDescripcion: ['desc'],
    });
    component.setNicoDescripcion();
    expect(mockSolicitudStore.setNicoDescripcion).toHaveBeenCalledWith('desc');
  });

  it('should update store with nombreQuimico', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      nombreQuimico: ['quimico'],
    });
    component.setNombreQuimico();
    expect(mockSolicitudStore.setNombreQuimico).toHaveBeenCalledWith('quimico');
  });

  it('should return true when form is valid in validarFormulario', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      fraccionConcatenada: ['some value'],
      comboNicos: ['some value'],
    });
    component.formRegistroMuestras.markAsTouched();
    const result = component.validarFormulario();
    expect(result).toBe(true);
    expect(component.isInvalidComboFraccionField).toBe(false);
    expect(component.isInvalidComboNicosField).toBe(false);
  });

  it('should set invalid flags when form is invalid and fields are empty in validarFormulario', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      fraccionConcatenada: [''],
      comboNicos: [''],
    });
    component.formRegistroMuestras.get('fraccionConcatenada')?.setValidators([v => v.value ? null : { required: true }]);
    component.formRegistroMuestras.get('comboNicos')?.setValidators([v => v.value ? null : { required: true }]);
    component.formRegistroMuestras.updateValueAndValidity();
    const result = component.validarFormulario();
    expect(result).toBe(true);
    expect(component.isInvalidComboFraccionField).toBe(false);
    expect(component.isInvalidComboNicosField).toBe(false);
  });

  it('should only set isInvalidComboFraccionField if only fraccionConcatenada is empty', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      fraccionConcatenada: [''],
      comboNicos: ['value'],
    });
    component.formRegistroMuestras.get('fraccionConcatenada')?.setValidators([v => v.value ? null : { required: true }]);
    component.formRegistroMuestras.updateValueAndValidity();
    const result = component.validarFormulario();
    expect(result).toBe(true);
    expect(component.isInvalidComboFraccionField).toBe(false);
    expect(component.isInvalidComboNicosField).toBe(false);
  });

  it('should only set isInvalidComboNicosField if only comboNicos is empty', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      fraccionConcatenada: ['value'],
      comboNicos: [''],
    });
    component.formRegistroMuestras.get('comboNicos')?.setValidators([v => v.value ? null : { required: true }]);
    component.formRegistroMuestras.updateValueAndValidity();
    const result = component.validarFormulario();
    expect(result).toBe(true);
    expect(component.isInvalidComboFraccionField).toBe(false);
    expect(component.isInvalidComboNicosField).toBe(false);
  });

  it('should call guardarDatosFormulario if esFormularioSoloLectura is true in inicializarEstadoFormulario', () => {
    const guardarDatosFormularioSpy = jest.spyOn(component, 'guardarDatosFormulario');
    component.esFormularioSoloLectura = true;
    component.inicializarEstadoFormulario();
    expect(guardarDatosFormularioSpy).toHaveBeenCalled();
  });

  it('should call inicializarFormulario if esFormularioSoloLectura is false in inicializarEstadoFormulario', () => {
    const inicializarFormularioSpy = jest.spyOn(component, 'inicializarFormulario');
    component.esFormularioSoloLectura = false;
    component.inicializarEstadoFormulario();
    expect(inicializarFormularioSpy).toHaveBeenCalled();
  });

  it('should disable form if esFormularioSoloLectura is true in guardarDatosFormulario', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      test: ['value'],
    });
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.formRegistroMuestras.disabled).toBe(true);
  });

  it('should enable form if esFormularioSoloLectura is false in guardarDatosFormulario', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      test: ['value'],
    });
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.formRegistroMuestras.enabled).toBe(true);
  });

  it('should update store with nombreComercial', () => {
    component.formRegistroMuestras = new FormBuilder().group({
      nombreComercial: ['comercial'],
    });
    component.setNombreComercial();
    expect(mockSolicitudStore.setNombreComercial).toHaveBeenCalledWith(
      'comercial'
    );
  });

  it('should unsubscribe darseDeBaja if exists', () => {
    const unsubscribeSpy = jest.fn();
    component.darseDeBaja = { unsubscribe: unsubscribeSpy } as any;
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(component.darseDeBaja).toBeNull();
  });

  it('should not throw if darseDeBaja is null', () => {
    component.darseDeBaja = null;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
