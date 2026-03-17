import { TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { CatalogosSelect, ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';
import { CargarDatosIniciales } from '../../models/solicitud-pantallas.model';
import {
  HttpClientTestingModule,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HistorialInspeccionFisicaComponent } from '../../shared/historial-inspeccion-fisica/historial-inspeccion-fisica.component';
import { CarrosDeFerrocarrilComponent } from '../../shared/carros-de-ferrocarril/carros-de-ferrocarril.component';
import { SolicitudDatosComponent } from '../../shared/solicitud-datos/solicitud-datos.component';
import { ResponsableInspeccionEnPuntoComponent } from '../../shared/responsable-inspeccion-en-punto/responsable-inspeccion-en-punto.component';
import { DatosDelTramiteARealizarComponent } from '../../shared/datos-del-tramite-a-realizar/datos-del-tramite-a-realizar.component';
import { MedioTransporteComponent } from '../../shared/medio-transporte/medio-transporte.component';

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: any;
  let mockSolicitudService: jest.Mocked<SolicitudPantallasService>;
  let mockConsultaioQuery: Partial<ConsultaioQuery>;
  let consultaioStateSubject: Subject<any>;

  beforeEach(async () => {
    mockSolicitudService = {
      getData: jest.fn(),
    } as any;
    consultaioStateSubject = new Subject();
    mockConsultaioQuery = {
      selectConsultaioState$: consultaioStateSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [
        SolicitudComponent,
        HttpClientTestingModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        HistorialInspeccionFisicaComponent,
        CarrosDeFerrocarrilComponent,
        SolicitudDatosComponent,
        ResponsableInspeccionEnPuntoComponent,
        DatosDelTramiteARealizarComponent,
        MedioTransporteComponent,
      ],
      providers: [
        FormBuilder,
        { provide: SolicitudPantallasService, useValue: mockSolicitudService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery },
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    (component as any).grupoFormularioPadre = new FormGroup({});
    (component as any).claveDeControl = 'someControl';
    (component as any).grupoFormularioPadre.addControl(
      'someControl',
      new FormControl('')
    );
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    const spy = jest.spyOn(component, 'inicializarEstadoFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if formularioDeshabilitado is true', () => {
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.formularioDeshabilitado = true;
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call crearFormulario and cargarDatosIniciales if formularioDeshabilitado is false', () => {
    const spyCrear = jest.spyOn(component, 'crearFormulario');
    const spyCargar = jest.spyOn(component, 'cargarDatosIniciales');
    component.formularioDeshabilitado = false;
    component.inicializarEstadoFormulario();
    expect(spyCrear).toHaveBeenCalled();
    expect(spyCargar).toHaveBeenCalled();
  });

  it('should disable form if formularioDeshabilitado is true in guardarDatosFormulario', () => {
    const spyDisable = jest.spyOn(FormGroup.prototype, 'disable');
    const spyEnable = jest.spyOn(FormGroup.prototype, 'enable');

    component.formularioDeshabilitado = true;
    component.guardarDatosFormulario();

    expect(spyDisable).toHaveBeenCalled();
    expect(spyEnable).not.toHaveBeenCalled();
  });

  it('should enable form if formularioDeshabilitado is false in guardarDatosFormulario', () => {
    component.formularioDeshabilitado = false;
    component.crearFormulario();
    const spyDisable = jest.spyOn(component.form, 'disable');
    const spyEnable = jest.spyOn(component.form, 'enable');
    component.cargarDatosIniciales = jest.fn();
    component.form.enable = jest.fn();
    component.form.disable = jest.fn();
    component.guardarDatosFormulario();
    expect(spyEnable).toHaveBeenCalled();
  });

  it('should create an empty form group in crearFormulario', () => {
    component.crearFormulario();
    expect(component.form).toBeDefined();
    expect(Object.keys(component.form.controls).length).toBe(0);
  });

  it('should load data in cargarDatosIniciales', () => {
    const mockData: CargarDatosIniciales = {
      hHistorialinspeccion: [],
      dHistorialInspecciones: [],
      dCarrosDeFerrocarril: [],
      hCarroFerrocarril: [],
      hSolicitud: [],
      dSolicitud: [],
      hMerchandise: [],
      dMercancia: [],
      medioDeTransporte: {} as CatalogosSelect,
      mercanciaLista: [],
    };
    mockSolicitudService.getData.mockReturnValue(of(mockData));
    component.cargarDatosIniciales();
    expect(component.hHistorialinspeccion).toEqual(
      mockData.hHistorialinspeccion
    );
    expect(component.dHistorialInspecciones).toEqual(
      mockData.dHistorialInspecciones
    );
    expect(component.dCarrosDeFerrocarril).toEqual(
      mockData.dCarrosDeFerrocarril
    );
    expect(component.hCarroFerrocarril).toEqual(mockData.hCarroFerrocarril);
    expect(component.hSolicitud).toEqual(mockData.hSolicitud);
    expect(component.dSolicitud).toEqual(mockData.dSolicitud);
    expect(component.hMercanciaTabla).toEqual(mockData.hMerchandise);
    expect(component.dMercanciaBody).toEqual(mockData.dMercancia);
    expect(component.mediodetransporte).toEqual(mockData.medioDeTransporte);
  });

  it('should emit certificadosAutorizValor event', () => {
    const spyEmit = jest.spyOn(component.certificadosAutorizValor, 'emit');
    component.certificadosAutorizEmitido(true);
    expect(spyEmit).toHaveBeenCalledWith(true);
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyed$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should update formularioDeshabilitado and isSolicitud on consultaioQuery state change', () => {
    const state = { readonly: true, create: false };
    consultaioStateSubject.next(state);
    expect(component.formularioDeshabilitado).toBe(false);
    expect(component.isSolicitud).toBe(true);
  });
});
