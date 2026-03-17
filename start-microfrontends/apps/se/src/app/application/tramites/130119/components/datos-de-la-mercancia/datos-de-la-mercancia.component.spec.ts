import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject } from 'rxjs';
import { DatosDeLaMercanciaComponent } from './datos-de-la-mercancia.component';
import { DatosDeLaSolicitudService } from '../../services/datos-de-la-solicitud/datos-de-la-solicitud.service';
import { Tramite130119Store } from '../../estados/store/tramite130119.store';
import { Tramite130119Query } from '../../estados/queries/tramite130119.query';
import { CatalogoSelectComponent, ConsultaioQuery, InputFechaComponent, TituloComponent } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DatosDeLaMercanciaComponent', () => {
  let component: DatosDeLaMercanciaComponent;
  let fixture: ComponentFixture<DatosDeLaMercanciaComponent>;
  let mockService: jest.Mocked<DatosDeLaSolicitudService>;
  let mockStore: jest.Mocked<Tramite130119Store>;
  let mockQuery: jest.Mocked<Tramite130119Query>;
  let mockConsultaQuery: jest.Mocked<ConsultaioQuery>;

  const mockCatalogo = [
    { id: '1', descripcion: 'Test Catalogo 1' },
    { id: '2', descripcion: 'Test Catalogo 2' }
  ];

  let mockConsultaState$: BehaviorSubject<any>;
  let mockTramiteState$: BehaviorSubject<any>;

  beforeEach(async () => {
    mockConsultaState$ = new BehaviorSubject({ readonly: false });
    mockTramiteState$ = new BehaviorSubject({
      descripcion: 'Test Description',
      fraccionArancelaria: '1',
      umt: 'Pieza',
      cantidad: '100',
      valorFacturaUSD: '1000.50',
      paisOrigen: '1',
      paisExportador: '2',
      numeroFactura: 'FAC123',
      fechaExpedicionFactura: '2023-01-01',
      observaciones: 'Test observations'
    });

    const serviceSpy = {
      getFraccionArancelaria: jest.fn().mockReturnValue(of(mockCatalogo)),
      getUMTCatalogo: jest.fn().mockReturnValue(of([{ descripcion: 'Kilogramo' }])),
      getPais: jest.fn().mockReturnValue(of(mockCatalogo))
    } as any;

    const storeSpy = {
      establecerDatos: jest.fn()
    } as any;

    const querySpy = {
      selectTramite130119$: mockTramiteState$.asObservable()
    } as jest.Mocked<Tramite130119Query>;

    const consultaQuerySpy = {
      selectConsultaioState$: mockConsultaState$.asObservable()
    } as jest.Mocked<ConsultaioQuery>;

    await TestBed.configureTestingModule({
      imports: [
        DatosDeLaMercanciaComponent, 
        ReactiveFormsModule, 
        CommonModule,
        CatalogoSelectComponent,
        TituloComponent,
        InputFechaComponent,
        TooltipModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: DatosDeLaSolicitudService, useValue: serviceSpy },
        { provide: Tramite130119Store, useValue: storeSpy },
        { provide: Tramite130119Query, useValue: querySpy },
        { provide: ConsultaioQuery, useValue: consultaQuerySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaMercanciaComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(DatosDeLaSolicitudService) as jest.Mocked<DatosDeLaSolicitudService>;
    mockStore = TestBed.inject(Tramite130119Store) as jest.Mocked<Tramite130119Store>;
    mockQuery = TestBed.inject(Tramite130119Query) as jest.Mocked<Tramite130119Query>;
    mockConsultaQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.datosDeLaMercanciaForm).toBeDefined();
    expect(mockService.getFraccionArancelaria).toHaveBeenCalled();
    expect(mockService.getPais).toHaveBeenCalled();
  }));

  it('should initialize form with correct validators', () => {
    component.inicializarFormulario();

    const form = component.datosDeLaMercanciaForm;
    expect(form.get('descripcion')?.hasError('required')).toBe(false);
    expect(form.get('fraccionArancelaria')?.hasError('required')).toBe(false);
    expect(form.get('cantidad')?.hasError('required')).toBe(false);
    expect(form.get('valorFacturaUSD')?.hasError('required')).toBe(false);
    expect(form.get('paisOrigen')?.hasError('required')).toBe(false);
    expect(form.get('paisExportador')?.hasError('required')).toBe(false);
    expect(form.get('numeroFactura')?.hasError('required')).toBe(false);
    expect(form.get('fechaExpedicionFactura')?.hasError('required')).toBe(false);
  });

  it('should set default UMT value to "Pieza"', fakeAsync(() => {
    component.inicializarFormulario();
    tick();

    expect(component.datosDeLaMercanciaForm.get('umt')?.value).toBe('Pieza');
    expect(component.datosDeLaMercanciaForm.get('umt')?.disabled).toBe(true);
  }));

  it('should disable form when esSoloLectura is true', () => {
    component.inicializarFormulario();
    component.esSoloLectura = true;
    component.habilitarDeshabilitarFormulario();

    expect(component.datosDeLaMercanciaForm.disabled).toBe(true);
  });

  it('should enable form when esSoloLectura is false', () => {
    component.inicializarFormulario();
    component.esSoloLectura = false;
    component.habilitarDeshabilitarFormulario();

    expect(component.datosDeLaMercanciaForm.enabled).toBe(true);
    expect(component.datosDeLaMercanciaForm.get('umt')?.disabled).toBe(true);
  });

  it('should get fraccion arancelaria options', () => {
    component.getFraccionArancelaria();

    expect(mockService.getFraccionArancelaria).toHaveBeenCalledWith(component.idProcedimiento.toString());
    expect(component.opcionesFraccionArancelaria).toEqual(mockCatalogo);
  });

  it('should get countries options', () => {
    component.getPasises();

    expect(mockService.getPais).toHaveBeenCalledWith(component.idProcedimiento.toString());
    expect(component.pasises).toEqual(mockCatalogo);
  });

  it('should get UMT and update form', () => {
    component.inicializarFormulario();
    component.datosDeLaMercanciaForm.patchValue({ fraccionArancelaria: '123' });

    component.getUMT();

    expect(mockService.getUMTCatalogo).toHaveBeenCalledWith(component.idProcedimiento.toString(), '123');
  });

  it('should handle fraccion arancelaria change', () => {
    component.inicializarFormulario();
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    const getUMTSpy = jest.spyOn(component, 'getUMT');

    component.onFraccionArancelariaChange();

    expect(setValoresStoreSpy).toHaveBeenCalled();
    expect(getUMTSpy).toHaveBeenCalled();
  });

  it('should set values in store', () => {
    component.inicializarFormulario();
    component.datosDeLaMercanciaForm.patchValue({ descripcion: 'Test Value' });

    component.setValoresStore(component.datosDeLaMercanciaForm, 'descripcion');

    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ descripcion: 'Test Value' });
  });

  it('should patch form values from store', () => {
    component.inicializarFormulario();
    const patchValueSpy = jest.spyOn(component.datosDeLaMercanciaForm, 'patchValue');

    component.getValoresStore();

    expect(patchValueSpy).toHaveBeenCalledWith({
      descripcion: 'Test Description',
      fraccionArancelaria: '1',
      umt: 'Pieza',
      cantidad: '100',
      valorFacturaUSD: '1000.50',
      paisOrigen: '1',
      paisExportador: '2',
      numeroFactura: 'FAC123',
      fechaExpedicionFactura: '2023-01-01',
      observaciones: 'Test observations'
    });
  });

  it('should update fecha expedicion factura', () => {
    component.inicializarFormulario();
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');

    component.cambioFechaFinal('2023-12-31');

    expect(component.datosDeLaMercanciaForm.get('fechaExpedicionFactura')?.value).toBe('2023-12-31');
    expect(setValoresStoreSpy).toHaveBeenCalledWith(component.datosDeLaMercanciaForm, 'fechaExpedicionFactura');
  });

  it('should handle readonly state changes', () => {
    component.ngOnInit();
    const habilitarDeshabilitarFormularioSpy = jest.spyOn(component, 'habilitarDeshabilitarFormulario');

    mockConsultaState$.next({ readonly: true });

    expect(component.esSoloLectura).toBe(false);
  });

  it('should complete destroyed$ subject on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});