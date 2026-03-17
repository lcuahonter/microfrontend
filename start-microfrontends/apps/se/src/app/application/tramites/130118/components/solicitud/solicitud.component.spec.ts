import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SolicitudComponent } from './solicitud.component';
import { Router } from '@angular/router';


import { of, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Tramite130118Query } from '../../estados/queries/tramite130118.query';
import { Tramite130118Store } from '../../estados/tramites/tramite130118.store';
import { DocumentosQuery } from '@libs/shared/data-access-user/src/core/queries/documentos.query';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [
      ReactiveFormsModule,
      HttpClientTestingModule,

    ],
    declarations: [SolicitudComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [


    ]
  }).compileComponents();
});

describe('SolicitudComponent', () => {
  let component: SolicitudComponent;
  let fixture: ComponentFixture<SolicitudComponent>;

  // Mocks de servicios
  const mockRouter = {
    navigate: jest.fn()
  };

  const mockTramite130118Query = {
    selectSeccionState$: of({
      idSolicitud: 123,
      regimenMercancia: '1',
      clasifiRegimen: '1',
      fraccionArancelaria: '1',
      nico: '1',
      unidadMedidaTarifaria: '1',
      paisOrigen: '1',
      paisDestino: '1',
      estado: '1',
      representacionFederal: '1',
      nombre: 'Test',
      apellidoPaterno: 'User',
      razonSocial: '',
      valorFacturaUSD: 100,
      cantidadTarifaria: 10,
      fechaSalida: '15/05/2023'
    })
  };

  const mockTramite130118Store = {
    setRegimenMercancia: jest.fn(),
    setClasifiRegimen: jest.fn(),
    setFraccionArancelaria: jest.fn(),
    setNico: jest.fn(),
    setUnidadMedidaTarifaria: jest.fn(),
    setPaisOrigen: jest.fn(),
    setPaisDestino: jest.fn(),
    setEstado: jest.fn(),
    setRepresentacionFederal: jest.fn(),
    setPrecioUnitarioUSD: jest.fn(),
    setFechaSalida: jest.fn()
  };

  const mockDocumentosQuery = {
    selectDocumentoState$: of({})
  };

  const mockRegimenService = {
    getRegimenes: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Regimen 1' }] })),
    getRegimenesCve: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Clasificacion 1' }] }))
  };

  const mockFraccionArancelariaService = {
    getFracciones: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Fraccion 1' }] })),
    getNico: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Nico 1' }] })),
    getFraccionesCve: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'UMT 1' }] }))
  };

  const mockPeximService = {
    getPaisOrigenCatalogo: jest.fn().mockReturnValue(of({ data: [{ clave: '1', descripcion: 'Pais Origen 1' }] }))
  };

  const mockPaisesService = {
    getPaisesT130118: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Pais Destino 1' }] }))
  };

  const mockEntidadesFederativasService = {
    getEntidades: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Estado 1' }] })),
    getEntidadesCve: jest.fn().mockReturnValue(of({ datos: [{ clave: '1', descripcion: 'Representacion Federal 1' }] }))
  };

  const mockGuardarService = {
    getCertificadoAntiguedad: jest.fn().mockReturnValue(of({ codigo: '00', datos: '12' }))
  };

  const mockValidacionesService = {
    isValid: jest.fn().mockReturnValue(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [SolicitudComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Tramite130118Query, useValue: mockTramite130118Query },
        { provide: Tramite130118Store, useValue: mockTramite130118Store },
        { provide: DocumentosQuery, useValue: mockDocumentosQuery },
        { provide: 'RegimenService', useValue: mockRegimenService },
        { provide: 'FraccionArancelariaService', useValue: mockFraccionArancelariaService },
        { provide: 'PeximService', useValue: mockPeximService },
        { provide: 'PaisesService', useValue: mockPaisesService },
        { provide: 'EntidadesFederativasService', useValue: mockEntidadesFederativasService },
        { provide: 'GuardarService', useValue: mockGuardarService },
        { provide: 'ValidacionesService', useValue: mockValidacionesService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    

    it('should subscribe to tramite state', () => {
      expect(component.solicitudState.idSolicitud).toBe(123);
    });

    it('should create form with initial values', () => {
      expect(component.FormSolicitud).toBeDefined();
      expect(component.datosRegimen.get('regimenMercancia')?.value).toBe('1');
      expect(component.datosMercancia.get('fraccionArancelaria')?.value).toBe('1');
    });

    it('should call changeRegimen if regimen has value', () => {
      const spy = jest.spyOn(component, 'changeRegimen');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call fraccionArancelariaChange if fraccion has value', () => {
      const spy = jest.spyOn(component, 'fraccionArancelariaChange');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call changeEntidad if estado has value', () => {
      const spy = jest.spyOn(component, 'changeEntidad');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });

    it('should call muestraCamposPersona if nombre or razonSocial exists', () => {
      const spy = jest.spyOn(component, 'muestraCamposPersona');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Form Handling', () => {
    it('should create form with correct structure', () => {
      component.crearFormSolicitud();
      expect(component.FormSolicitud).toBeInstanceOf(FormGroup);
      expect(component.datosRegimen).toBeInstanceOf(FormGroup);
      expect(component.datosMercancia).toBeInstanceOf(FormGroup);
      expect(component.datosProducto).toBeInstanceOf(FormGroup);
      expect(component.registroFederal).toBeInstanceOf(FormGroup);
    });

    it('should validate form fields', () => {
      component.crearFormSolicitud();
      const regimenControl = component.datosRegimen.get('regimenMercancia');
      const fraccionControl = component.datosMercancia.get('fraccionArancelaria');

      expect(regimenControl?.hasError('required')).toBeFalsy();
      expect(fraccionControl?.hasError('required')).toBeFalsy();

      regimenControl?.setValue('');
      fraccionControl?.setValue('');

      expect(regimenControl?.hasError('required')).toBeTruthy();
      expect(fraccionControl?.hasError('required')).toBeTruthy();
    });

    it('should disable/enable form when esFormularioSoloLectura changes', () => {
      component.esFormularioSoloLectura = true;
      component.guardarDatosFormulario();
      expect(component.FormSolicitud.disabled).toBeTruthy();

      component.esFormularioSoloLectura = false;
      component.guardarDatosFormulario();
      expect(component.FormSolicitud.enabled).toBeTruthy();
    });
  });



  describe('Persona Methods', () => {
    it('should show personaFisica fields when nombre exists', () => {
      component.datosProducto.get('nombre')?.setValue('Test');
      component.muestraCamposPersona();

      expect(component.isVisibleFisica).toBeTruthy();
      expect(component.isVisibleMoral).toBeFalsy();
      expect(component.datosProducto.get('nombre')?.enabled).toBeTruthy();
      expect(component.datosProducto.get('razonSocial')?.disabled).toBeTruthy();
    });

    it('should show personaMoral fields when razonSocial exists', () => {
      component.datosProducto.get('razonSocial')?.setValue('Test SA');
      component.muestraCamposPersona();

      expect(component.isVisibleFisica).toBeFalsy();
      expect(component.isVisibleMoral).toBeTruthy();
      expect(component.datosProducto.get('razonSocial')?.enabled).toBeTruthy();
      expect(component.datosProducto.get('nombre')?.disabled).toBeTruthy();
    });
  });

  describe('Calculations', () => {
    it('should calculate precioUnitarioUSD correctly', () => {
      component.datosMercancia.get('cantidadTarifaria')?.setValue(10);
      component.datosMercancia.get('valorFacturaUSD')?.setValue(100);
      component.calcularPrecioUnitarioUSD();

      const precioUnitario = component.datosMercancia.get('precioUnitarioUSD')?.value;
      expect(precioUnitario).toBe(10);
      expect(mockTramite130118Store.setPrecioUnitarioUSD).toHaveBeenCalledWith(10);
    });

    it('should not calculate precioUnitarioUSD when values are invalid', () => {
      component.datosMercancia.get('cantidadTarifaria')?.setValue(null);
      component.datosMercancia.get('valorFacturaUSD')?.setValue(null);
      component.calcularPrecioUnitarioUSD();

      const precioUnitario = component.datosMercancia.get('precioUnitarioUSD')?.value;
      expect(precioUnitario).toBeUndefined();
    });
  });

  describe('Date Handling', () => {
    it('should handle cambioFechaFinal with valid date', () => {
      component.certificadoAntiguedadMaximoMeses = 12;
      const today = new Date();
      const validDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

      component.cambioFechaFinal(validDate);

      expect(component.datosMercancia.get('fechaSalida')?.value).toBe(validDate);
      expect(mockTramite130118Store.setFechaSalida).toHaveBeenCalledWith(validDate);
    });

    it('should reject date older than certificadoAntiguedadMaximoMeses', fakeAsync(() => {
      component.certificadoAntiguedadMaximoMeses = 12;
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 13);
      const invalidDate = `${oldDate.getDate()}/${oldDate.getMonth() + 1}/${oldDate.getFullYear()}`;

      component.cambioFechaFinal(invalidDate);
      tick(); // Espera a que se completen los timeouts

      expect(component.datosMercancia.get('fechaSalida')?.value).toBeNull();
      // ... otras expectativas
    }));

    it('should handle invalid date format', () => {
      component.cambioFechaFinal('invalid-date');
      expect(component.datosMercancia.get('fechaSalida')?.value).toBeNull();
    });
  });

  describe('Validation', () => {
  

    it('should mark all as touched when invalid', () => {
      component.crearFormSolicitud();
      component.datosRegimen.get('regimenMercancia')?.setValue('');
      component.validarFormulario();

      expect(component.datosRegimen.get('regimenMercancia')?.touched).toBeTruthy();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      const spyNext = jest.spyOn(component.destruirNotificador$, 'next');
      const spyComplete = jest.spyOn(component.destruirNotificador$, 'complete');

      component.ngOnDestroy();

      expect(spyNext).toHaveBeenCalled();
      expect(spyComplete).toHaveBeenCalled();
    });
  });
});