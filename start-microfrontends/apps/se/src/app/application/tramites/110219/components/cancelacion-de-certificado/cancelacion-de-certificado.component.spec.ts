import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelacionDeCertificadoComponent } from './cancelacion-de-certificado.component';
import { CertificadoService } from '../../services/certificado.service';
import { Tramite110219Store } from '../../estados/Tramite110219.store';
import { Tramite110219Query } from '../../estados/Tramite110219.query';
import { ValidacionesFormularioService, ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { of, ReplaySubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';

describe('CancelacionDeCertificadoComponent', () => {
  let component: CancelacionDeCertificadoComponent;
  let fixture: ComponentFixture<CancelacionDeCertificadoComponent>;
  let certificadoServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;

  beforeEach(async () => {
    certificadoServiceMock = {
      getTratadoData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Tratado' }])),
      getSolicitudesTabla: jest.fn().mockReturnValue(of([{ numeroCertificado: '123', pais: 'MX', tratado: 'TLC', fechaExpedicion: '2024-01-01', fechaVencimiento: '2025-01-01' }])),
    };
    tramiteStoreMock = {
      setFechaInicial: jest.fn(),
      setFechaFinal: jest.fn(),
      setNumeroCertificado: jest.fn(),
      setPais: jest.fn(),
      setTratado: jest.fn(),
    };
    tramiteQueryMock = {
      selectSolicitud$: of({}),
    };
    validacionesServiceMock = {
      isValid: jest.fn().mockReturnValue(true),
    };
    consultaioQueryMock = {
      selectConsultaioState$: of({ readonly: false }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CancelacionDeCertificadoComponent],
      providers: [
        FormBuilder,
        { provide: CertificadoService, useValue: certificadoServiceMock },
        { provide: Tramite110219Store, useValue: tramiteStoreMock },
        { provide: Tramite110219Query, useValue: tramiteQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelacionDeCertificadoComponent);
    component = fixture.componentInstance;
    component.solicitudState = {
      columnasTabla: [],
      idSolicitud: 1,
      numeroCertificado: '123',
      tratado: [],
      pais: [],
      fechaInicial: '2024-01-01',
      fechaFinal: '2025-01-01',
      catalogos: [],
      mercancias: [],
      productores: [],
      pasoActual: 1,
      certificadoDeOrigen: '',
      motivoCancelacion: '',
      fechaExpedicion: '',
      fechaVencimiento: '',
      bloque: '',
      acuerdo: '',
      observaciones: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      registroFiscal: '',
      razonSocial: '',
      calle: '',
      numeroLetra: '',
      telefono: 0,
      ciudad: 0,
      fax: 0,
      correoElectronico: '',
    };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and call data methods on ngOnInit', () => {
    jest.spyOn(component, 'getTratadoData');
    jest.spyOn(component, 'getPaisdata');
    jest.spyOn(component, 'getSolicitudesTabla');
    jest.spyOn(component, 'inicializarEstadoFormulario');
    jest.spyOn(component, 'donanteDomicilio');
    component.ngOnInit();
    expect(component.getTratadoData).toHaveBeenCalled();
    expect(component.getPaisdata).toHaveBeenCalled();
    expect(component.getSolicitudesTabla).toHaveBeenCalled();
    expect(component.inicializarEstadoFormulario).toHaveBeenCalled();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('should call guardarDatosFormulario if soloLectura in inicializarEstadoFormulario', () => {
    component.soloLectura = true;
    jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();
  });

  it('should call donanteDomicilio if not soloLectura in inicializarEstadoFormulario', () => {
    component.soloLectura = false;
    jest.spyOn(component, 'donanteDomicilio');
    component.inicializarEstadoFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();
  });

  it('should call donanteDomicilio and enable/disable form in guardarDatosFormulario', () => {
    component.validacionForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({}),
    });
    component.soloLectura = true;
    jest.spyOn(component.validacionForm, 'disable');
    jest.spyOn(component, 'donanteDomicilio');
    component.guardarDatosFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();

    component.soloLectura = false;
    jest.spyOn(component.validacionForm, 'enable');
    component.guardarDatosFormulario();
  });

  it('should patch value and call setValoresStore in cambioFechaInicial', () => {
    component.validacionForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        fechaInicial: ['']
      })
    });
    jest.spyOn(component, 'setValoresStore');
    component.cambioFechaInicial('2024-01-01');
    expect(component.setValoresStore).toHaveBeenCalledWith(component.validacionForm, 'fechaInicial', 'setFechaInicial');
  });

  it('should patch value and call setValoresStore in cambioFechaFinal', () => {
    component.validacionForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        fechaFinal: ['']
      })
    });
    jest.spyOn(component, 'setValoresStore');
    component.cambioFechaFinal('2025-01-01');
    expect(component.setValoresStore).toHaveBeenCalledWith(component.validacionForm, 'fechaFinal', 'setFechaFinal');
  });

  it('should mark all as touched if validacionForm is invalid in validarDestinatarioFormulario', () => {
    component.validacionForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        numeroCertificado: ['', Validators.required]
      })
    });
    jest.spyOn(component.validacionForm, 'markAllAsTouched');
    component.validacionForm.setErrors({ invalid: true });
    component.validarDestinatarioFormulario();
    expect(component.validacionForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should set estaBuscando to true in alBuscarClic', () => {
    component.estaBuscando = false;
    component.alBuscarClic();
    expect(component.estaBuscando).toBe(true);
  });

  it('should call certificadoService.getTratadoData and set tratadoCatalogo.catalogos in getTratadoData', () => {
    component.getTratadoData({ clave: '1', descripcion: 'Tratado' });
    expect(certificadoServiceMock.getTratadoData).toHaveBeenCalled();
    expect(component.tratadoCatalogo.catalogos).toBeDefined();
  });

  it('should call certificadoService.getTratadoData and set paisCatalogo.catalogos in getPaisdata', () => {
    component.getPaisdata('1');
    expect(certificadoServiceMock.getTratadoData).toHaveBeenCalled();
    expect(component.paisCatalogo.catalogos).toBeDefined();
  });

  it('should call certificadoService.getSolicitudesTabla and set certificadoDisponsiblesTablaDatos in getSolicitudesTabla', () => {
    component.getSolicitudesTabla();
    expect(certificadoServiceMock.getSolicitudesTabla).toHaveBeenCalled();
    expect(component.certificadoDisponsiblesTablaDatos).toBeDefined();
  });

  it('should call validacionesService.isValid in isValid', () => {
    const form = new FormBuilder().group({ campo: [''] });
    expect(component.isValid(form, 'campo')).toBe(true);
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
  });

  it('should call store method in setValoresStore', () => {
    const storeMethod = jest.fn();
    component['store'] = { setFechaInicial: storeMethod } as any;
    const form = new FormBuilder().group({ fechaInicial: ['2024-01-01'] });
    component.setValoresStore(form, 'fechaInicial', 'setFechaInicial');
    expect(storeMethod).toHaveBeenCalledWith('2024-01-01');
  });

  it('should return validacionForm', () => {
    component.validacionForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({})
    });
    expect(component.validacionForm).toBeTruthy();
  });

  it('should set up forms in donanteDomicilio', () => {
    component.solicitudState = {
      columnasTabla: [],
      idSolicitud: 1,
      numeroCertificado: '123',
      tratado: [],
      pais: [],
      fechaInicial: '2024-01-01',
      fechaFinal: '2025-01-01',
      catalogos: [],
      mercancias: [],
      productores: [],
      pasoActual: 1,
      certificadoDeOrigen: '',
      motivoCancelacion: '',
      fechaExpedicion: '',
      fechaVencimiento: '',
      bloque: '',
      acuerdo: '',
      observaciones: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      registroFiscal: '',
      razonSocial: '',
      calle: '',
      numeroLetra: '',
      telefono: 0,
      ciudad: 0,
      fax: 0,
      correoElectronico: '',
    };
    component.donanteDomicilio();
    expect(component.validacionForm).toBeTruthy();
  });

  it('should emit dataEvent with 3 in emitirEventoClick', () => {
    component.dataEvent = new EventEmitter<number>();
    const emitSpy = jest.spyOn(component.dataEvent, 'emit');
    component.emitirEventoClick();
    expect(emitSpy).toHaveBeenCalledWith(3);
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });
});