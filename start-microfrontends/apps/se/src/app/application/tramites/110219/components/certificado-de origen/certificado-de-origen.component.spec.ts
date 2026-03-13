import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadoDeOrigenComponent } from './certificado-de-origen.component';
import { CertificadoService } from '../../services/certificado.service';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { Tramite110219Store } from '../../estados/Tramite110219.store';
import { Tramite110219Query } from '../../estados/Tramite110219.query';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { of, ReplaySubject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

describe('CertificadoDeOrigenComponent', () => {
  let component: CertificadoDeOrigenComponent;
  let fixture: ComponentFixture<CertificadoDeOrigenComponent>;
  let certificadoServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;
  let validacionesServiceMock: any;
  let consultaioQueryMock: any;
   const toastrServiceMock = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
};

  beforeEach(async () => {
    certificadoServiceMock = {
      getMercanciaCertificadoTabla: jest.fn().mockReturnValue(of([])),
    };
    tramiteStoreMock = {
      setFraccionArancelaria: jest.fn(),
      setFraccionRegla: jest.fn(),
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
      imports: [ReactiveFormsModule, CertificadoDeOrigenComponent],
      providers: [
        FormBuilder,
        { provide: CertificadoService, useValue: certificadoServiceMock },
        { provide: Tramite110219Store, useValue: tramiteStoreMock },
        { provide: Tramite110219Query, useValue: tramiteQueryMock },
        { provide: ValidacionesFormularioService, useValue: validacionesServiceMock },
        { provide: ConsultaioQuery, useValue: consultaioQueryMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificadoDeOrigenComponent);
    component = fixture.componentInstance;
    component.solicitudState = {
      motivoCancelacion: 'motivo',
      fechaExpedicion: '2024-01-01',
      fechaVencimiento: '2025-01-01',
      certificadoDeOrigen: 'cert',
      bloque: 'bloque',
      acuerdo: 'acuerdo',
      observaciones: 'obs',
      nombre: 'nombre',
      primerApellido: 'apellido1',
      segundoApellido: 'apellido2',
      registroFiscal: 'regFiscal',
      razonSocial: 'razon',
      calle: 'calle',
      numeroLetra: '123',
      telefono: 1234567890,
      ciudad: 1,
      fax: 1234567890,
      correoElectronico: 'test@mail.com',
      catalogos: [],
      mercancias: [],
      productores: [],
      pasoActual: 1,
      numeroCertificado: '',
      pais: [],
      tratado: [],
      fechaInicial: '',
      fechaFinal: ''
    };
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and call data methods on ngOnInit', () => {
    jest.spyOn(component, 'getMercanciaCertificadoTabla');
    jest.spyOn(component, 'inicializarEstadoFormulario');
    jest.spyOn(component, 'donanteDomicilio');
    component.ngOnInit();
    expect(component.getMercanciaCertificadoTabla).toHaveBeenCalled();
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
    component.cancelacionForm = new FormBuilder().group({
      motivoCancelacion: ['', Validators.required]
    });
    component.soloLectura = true;
    jest.spyOn(component.cancelacionForm, 'disable');
    jest.spyOn(component, 'donanteDomicilio');
    component.guardarDatosFormulario();
    expect(component.donanteDomicilio).toHaveBeenCalled();

    component.soloLectura = false;
    jest.spyOn(component.cancelacionForm, 'enable');
    component.guardarDatosFormulario();
  });

  it('should mark all as touched if validacionForm is invalid in emitirEventoClick', () => {
    component.cancelacionForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({
        motivoCancelacion: ['', Validators.required]
      })
    });
    const validacionForm = component.cancelacionForm.get('validacionForm') as FormGroup;
    jest.spyOn(validacionForm, 'markAllAsTouched');
    jest.spyOn(component.dataEventContinuar, 'emit');
    jest.spyOn(component.isDataEventContinuar, 'emit');
    
    component.emitirEventoClick();
    expect(validacionForm.markAllAsTouched).toHaveBeenCalled();
    expect(component.mostrarErroresValidacion).toBe(true);
  });

  it('should call certificadoService.getMercanciaCertificadoTabla and set mercanciaCertificadoTablaDatos in getMercanciaCertificadoTabla', () => {
    component.getMercanciaCertificadoTabla();
    expect(certificadoServiceMock.getMercanciaCertificadoTabla).toHaveBeenCalled();
    expect(component.mercanciaCertificadoTablaDatos).toBeDefined();
  });

  it('should call validacionesService.isValid in isValid', () => {
    const form = new FormBuilder().group({ campo: [''] });
    expect(component.isValid(form, 'campo')).toBe(true);
    expect(validacionesServiceMock.isValid).toHaveBeenCalled();
  });

 it('should call store method in setValoresStore', () => {
  const storeMethod = jest.fn();
  component.store = { setNumeroCertificado: storeMethod } as any;
  const form = new FormBuilder().group({ numeroCertificado: ['valor'] });
  component.setValoresStore(form, 'numeroCertificado', 'setNumeroCertificado');
  expect(storeMethod).toHaveBeenCalledWith('valor');
});


  it('should return validacionForm', () => {
    component.cancelacionForm = new FormBuilder().group({
      validacionForm: new FormBuilder().group({})
    });
    expect(component.validacionForm).toBeTruthy();
  });

  it('should set up forms in donanteDomicilio', () => {
    component.solicitudState = {
      motivoCancelacion: 'motivo',
      fechaExpedicion: '2024-01-01',
      fechaVencimiento: '2025-01-01',
      certificadoDeOrigen: 'cert',
      bloque: 'bloque',
      acuerdo: 'acuerdo',
      observaciones: 'obs',
      nombre: 'nombre',
      primerApellido: 'apellido1',
      segundoApellido: 'apellido2',
      registroFiscal: 'regFiscal',
      razonSocial: 'razon',
      calle: 'calle',
      numeroLetra: '123',
      telefono: 1234567890,
      ciudad: 1,
      fax: 1234567890,
      correoElectronico: 'test@mail.com',
      catalogos: [],
      mercancias: [],
      productores: [],
      pasoActual: 1,
      numeroCertificado: '',
      pais: [],
      tratado: [],
      fechaInicial: '',
      fechaFinal: ''
    };
    component.donanteDomicilio();
    expect(component.cancelacionForm).toBeTruthy();
  });

  it('should complete destroyed$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyed$'], 'next');
    const completeSpy = jest.spyOn(component['destroyed$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalledWith(true);
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should have correct table headers configuration', () => {
    expect(component.encabezadosMercancias.length).toBe(17);
    expect(component.encabezadosMercancias[0].encabezado).toBe('Número de Orden');
    expect(component.encabezadosMercancias[1].encabezado).toBe('Fracción Arancelaria');
    expect(component.encabezadosMercancias[2].encabezado).toBe('Nombre Técnico');
    expect(component.encabezadosMercancias[3].encabezado).toBe('Nombre Comercial');
    expect(component.encabezadosMercancias[4].encabezado).toBe('Nombre en Inglés');
    expect(component.encabezadosMercancias[5].encabezado).toBe('Complemento de la descripción');
    expect(component.encabezadosMercancias[6].encabezado).toBe('Marca');
    expect(component.encabezadosMercancias[7].encabezado).toBe('Criterio para conferir origen');
    expect(component.encabezadosMercancias[8].encabezado).toBe('Norma');
    expect(component.encabezadosMercancias[9].encabezado).toBe('Cantidad a Exportar');
    expect(component.encabezadosMercancias[10].encabezado).toBe('Unidad de medida de comercialización (Cantidad a Exportar)');

    expect(component.encabezadosProductores.length).toBe(6);
    expect(component.encabezadosProductores[0].encabezado).toBe('Nombre del productor');
    expect(component.encabezadosProductores[1].encabezado).toBe('Número de registro fiscal');
    expect(component.encabezadosProductores[2].encabezado).toBe('Dirección');
    expect(component.encabezadosProductores[3].encabezado).toBe('Correo Electrónico');
    expect(component.encabezadosProductores[4].encabezado).toBe('Teléfono');
    expect(component.encabezadosProductores[5].encabezado).toBe('Fax');
  });

  it('should correctly extract values through clave functions', () => {
    const mockMercancia: any = {
      numeroOrden: '1',
      fraccionArancelaria: '1234',
      nombreTecnico: 'Test Tech',
      nombreComercial: 'Test Comm',
      nombreIngles: 'Test Eng',
      complementoDescripcion: 'Test Desc',
      marca: 'MARCA-123',
      criterio: 'A',
      norma: 'NORMA-1',
      cantidadExportar: '100',
      unidad: 'KG'
    };

    const mockProductor: any = {
      nombreProductor: 'John Doe',
      numeroRegistroFiscal: 'TAX123',
      direccion: '123 Main St',
      correoElectronico: 'john@example.com',
      telefono: '555-1234',
      fax: '555-4321'
    };

    expect(component.encabezadosMercancias[0].clave(mockMercancia)).toBe('1');
    expect(component.encabezadosMercancias[1].clave(mockMercancia)).toBe('1234');
    expect(component.encabezadosMercancias[2].clave(mockMercancia)).toBe('Test Tech');
    expect(component.encabezadosMercancias[3].clave(mockMercancia)).toBe('Test Comm');
    expect(component.encabezadosMercancias[4].clave(mockMercancia)).toBe('Test Eng');
    expect(component.encabezadosMercancias[5].clave(mockMercancia)).toBe('Test Desc');
    expect(component.encabezadosMercancias[6].clave(mockMercancia)).toBe('MARCA-123');
    expect(component.encabezadosMercancias[7].clave(mockMercancia)).toBe('A');
    expect(component.encabezadosMercancias[8].clave(mockMercancia)).toBe('NORMA-1');
    expect(component.encabezadosMercancias[9].clave(mockMercancia)).toBe('100');
    expect(component.encabezadosMercancias[10].clave(mockMercancia)).toBe('KG');

    expect(component.encabezadosProductores[0].clave(mockProductor)).toBe('John Doe');
    expect(component.encabezadosProductores[1].clave(mockProductor)).toBe('TAX123');
    expect(component.encabezadosProductores[2].clave(mockProductor)).toBe('123 Main St');
    expect(component.encabezadosProductores[3].clave(mockProductor)).toBe('john@example.com');
    expect(component.encabezadosProductores[4].clave(mockProductor)).toBe('555-1234');
    expect(component.encabezadosProductores[5].clave(mockProductor)).toBe('555-4321');
  });
});