import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosComponent } from './pago-de-derechos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatosSolicitudService } from '../../services/datos-solicitud.service';
import { PagoDerechosStore } from '../../estados/stores/pago-de-derechos.store';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagoDerechosQuery } from '../../estados/queries/pago-derechos.query';

describe('PagoDeDerechosComponent', () => {
  let component: PagoDeDerechosComponent;
  let fixture: ComponentFixture<PagoDeDerechosComponent>;
  let mockDatosSolicitudService: jest.Mocked<DatosSolicitudService>;
  let mockPagoDerechosStore: jest.Mocked<PagoDerechosStore>;
  let mockPagoDerechosQuery: jest.Mocked<PagoDerechosQuery>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;

  const mockEstadosDatos = [
    { id: 1, descripcion: 'Estado 1', clave: 'E1' },
    { id: 2, descripcion: 'Estado 2', clave: 'E2' }
  ];

  const mockBancoDatos = [
    { id: 1, descripcion: 'Banco 1', clave: 'B1' },
    { id: 2, descripcion: 'Banco 2', clave: 'B2' }
  ];

  const mockSolicitudState = {
    claveReferencia: 'REF123',
    cadenaDependencia: 'CADENA123',
    estado: 'E1',
    banco: 'B1',
    llavePago: 'LLAVE123',
    fechaPago: '15/12/2023',
    importePago: '1000.50'
  };

  beforeEach(async () => {
    const datosSolicitudServiceSpy = {
      obtenerListaEstados: jest.fn().mockReturnValue(of(mockEstadosDatos)),
      getBancoDatos: jest.fn().mockReturnValue(of(mockBancoDatos))
    };

    const pagoDerechosStoreSpy = {
      setFechaPago: jest.fn(),
      setImportePago: jest.fn(),
      setLlavePago: jest.fn(),
      setClaveReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setEstado: jest.fn(),
      setBanco: jest.fn()
    };

    const pagoDerechosQuerySpy = {
      selectSolicitud$: of(mockSolicitudState)
    };

    const consultaioQuerySpy = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [
        PagoDeDerechosComponent, 
        HttpClientTestingModule, 
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: DatosSolicitudService, useValue: datosSolicitudServiceSpy },
        { provide: PagoDerechosStore, useValue: pagoDerechosStoreSpy },
        { provide: PagoDerechosQuery, useValue: pagoDerechosQuerySpy },
        { provide: ConsultaioQuery, useValue: consultaioQuerySpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosComponent);
    component = fixture.componentInstance;
    
    mockDatosSolicitudService = TestBed.inject(DatosSolicitudService) as jest.Mocked<DatosSolicitudService>;
    mockPagoDerechosStore = TestBed.inject(PagoDerechosStore) as jest.Mocked<PagoDerechosStore>;
    mockPagoDerechosQuery = TestBed.inject(PagoDerechosQuery) as jest.Mocked<PagoDerechosQuery>;
    mockConsultaioQuery = TestBed.inject(ConsultaioQuery) as jest.Mocked<ConsultaioQuery>;

    // Set up component inputs
    component.pagoDerechoFormState = {
      claveReferencia: 'REF123',
      cadenaDependencia: 'CADENA123', 
      estado: 'E1',
      llavePago: 'LLAVE123',
      fechaPago: '15/12/2023',
      importePago: '1000.50'
    };
    component.idProcedimiento = 1;
    component.formularioDeshabilitado = false;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should run #ngOnInit()', async () => {
    component.pagoDerechoFormState = component.pagoDerechoFormState || {};
    component.pagoDerechoFormState.claveReferencia = 'claveReferencia';
    component.pagoDerechoFormState.cadenaDependencia = 'cadenaDependencia';
    component.pagoDerechoFormState.estado = 'estado';
    component.pagoDerechoFormState.llavePago = 'llavePago';
    component.pagoDerechoFormState.fechaPago = 'fechaPago';
    component.pagoDerechoFormState.importePago = 'importePago';
    component.updatePagoDerechos = component.updatePagoDerechos || {};
    component.updatePagoDerechos.emit = jest.fn();
    component.cargarDatos = jest.fn();
    component.ngOnInit();
  });

  it('should run #alReiniciar()', async () => {
    component.pagoDerechosForm = component.pagoDerechosForm || {};
    component.pagoDerechosForm.reset = jest.fn();
    component.alReiniciar();
    expect(component.pagoDerechosForm.reset).toHaveBeenCalled();
  });

  it('should initialize form correctly in ngOnInit', () => {
    component.solicitudState = mockSolicitudState;
    component.ngOnInit();
    
    expect(component.pagoDerechosForm).toBeDefined();
    expect(component.pagoDerechosForm.get('claveReferencia')?.value).toBe('REF123');
    expect(component.pagoDerechosForm.get('cadenaDependencia')?.value).toBe('CADENA123');
    expect(component.pagoDerechosForm.get('estado')?.value).toBe('E1');
    expect(component.pagoDerechosForm.get('banco')?.value).toBe('B1');
    expect(component.pagoDerechosForm.get('llavePago')?.value).toBe('LLAVE123');
    expect(component.pagoDerechosForm.get('fechaPago')?.value).toBe('15/12/2023');
    expect(component.pagoDerechosForm.get('importePago')?.value).toBe('1000.50');
  });

  it('should disable form when formularioDeshabilitado is true', () => {
    component.formularioDeshabilitado = true;
    component.solicitudState = mockSolicitudState;
    component.ngOnInit();
    
    expect(component.pagoDerechosForm.disabled).toBe(true);
  });

  it('should set mostrarBanco based on idProcedimiento', () => {
    // Test when idProcedimiento is in BANCO array
    component.idProcedimiento = 260208; // Valid ID from BANCO array
    component.solicitudState = mockSolicitudState;
    component.ngOnInit();
    expect(component.mostrarBanco).toBeTruthy();
    
    // Test when idProcedimiento is NOT in BANCO array
    component.idProcedimiento = 1; // Invalid ID not in BANCO array
    component.ngOnInit();
    expect(component.mostrarBanco).toBeFalsy();
  });

  it('should emit updatePagoDerechos when form values change', () => {
    const emitSpy = jest.spyOn(component.updatePagoDerechos, 'emit');
    component.solicitudState = mockSolicitudState;
    component.ngOnInit();
    
    component.pagoDerechosForm.patchValue({ claveReferencia: 'NEW_REF' });
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should load estados data in cargarDatos', () => {
    component.ngOnInit();
    component.cargarDatos();
    
    expect(mockDatosSolicitudService.obtenerListaEstados).toHaveBeenCalled();
    expect(component.estadosDatos).toEqual(mockEstadosDatos);
  });

  it('should load banco data in getBancoDatos', () => {
    component.ngOnInit();
    component.getBancoDatos();
    
    expect(mockDatosSolicitudService.getBancoDatos).toHaveBeenCalled();
    expect(component.bancoDatos).toEqual(mockBancoDatos);
  });

  it('should update fechaPago when onFechaCambiada is called', () => {
    component.ngOnInit();
    const setValoresStoreSpy = jest.spyOn(component, 'setValoresStore');
    
    component.onFechaCambiada('20/12/2023');
    
    expect(component.pagoDerechosForm.get('fechaPago')?.value).toBe('20/12/2023');
    expect(setValoresStoreSpy).toHaveBeenCalledWith(
      component.pagoDerechosForm,
      'fechaPago',
      'setFechaPago'
    );
  });

  it('should validate control correctly in esInvalido', () => {
    component.ngOnInit();
    const control = component.pagoDerechosForm.get('claveReferencia');
    
    // Test invalid and touched control
    control?.setValue('');
    control?.markAsTouched();
    expect(component.esInvalido('claveReferencia')).toBe(true);
    
    // Test valid control
    control?.setValue('VALID_REF');
    expect(component.esInvalido('claveReferencia')).toBe(false);
  });

  it('should handle fechaPago validation in esInvalido', () => {
    component.ngOnInit();
    const fechaControl = component.pagoDerechosForm.get('fechaPago');
    
    // Test with valid past date
    fechaControl?.setValue('15/12/2020');
    const result = component.esInvalido('fechaPago');
    expect(component.esFechaValida).toBe(true);
    expect(result).toBe(false);
    
    // Test with future date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureDateStr = `${futureDate.getDate().toString().padStart(2, '0')}/${(futureDate.getMonth() + 1).toString().padStart(2, '0')}/${futureDate.getFullYear()}`;
    fechaControl?.setValue(futureDateStr);
    const futureResult = component.esInvalido('fechaPago');
    expect(component.esFechaValida).toBe(false);
    expect(futureResult).toBe(true);
  });

  it('should validate date correctly in esFechaPasada', () => {
    // Test with empty string
    component.esFechaPasada('');
    expect(component.esFechaValida).toBe(false);
    
    // Test with invalid date format
    component.esFechaPasada('invalid-date');
    expect(component.esFechaValida).toBe(false);
    
    // Test with past date
    component.esFechaPasada('15/12/2020');
    expect(component.esFechaValida).toBe(true);
    
    // Test with today's date
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    component.esFechaPasada(todayStr);
    expect(component.esFechaValida).toBe(true);
  });

  it('should handle setValoresStore method', () => {
    component.ngOnInit();
    
    component.setValoresStore(component.pagoDerechosForm, 'fechaPago', 'setFechaPago');
    expect(mockPagoDerechosStore.setFechaPago).toHaveBeenCalled();
    
    component.setValoresStore(component.pagoDerechosForm, 'importePago', 'setImportePago');
    expect(mockPagoDerechosStore.setImportePago).toHaveBeenCalled();
  });

  it('should handle esInvalido with non-existent control', () => {
    component.ngOnInit();
    const result = component.esInvalido('nonExistentControl');
    expect(result).toBe(false);
  });

  it('should handle fechaPago validation when value is null', () => {
    component.ngOnInit();
    const fechaControl = component.pagoDerechosForm.get('fechaPago');
    fechaControl?.setValue(null);
    
    const result = component.esInvalido('fechaPago');
    expect(result).toBe(false);
  });

  it('should handle fechaPago validation when value is empty string', () => {
    component.ngOnInit();
    const fechaControl = component.pagoDerechosForm.get('fechaPago');
    fechaControl?.setValue('');
    
    const result = component.esInvalido('fechaPago');
    expect(result).toBe(false);
  });

  it('should unsubscribe on destroy', () => {
    // Create a mock Subject to avoid interfering with RxJS internals
    const mockUnsubscribe$ = {
      next: jest.fn(),
      unsubscribe: jest.fn()
    };
    
    // Replace the component's unsubscribe$ with our mock
    component['unsubscribe$'] = mockUnsubscribe$ as any;
    
    component.ngOnDestroy();
    
    expect(mockUnsubscribe$.next).toHaveBeenCalled();
    expect(mockUnsubscribe$.unsubscribe).toHaveBeenCalled();
  });

  it('should patch form values when cargarDatos loads estado data', () => {
    component.ngOnInit();
    const patchValueSpy = jest.spyOn(component.pagoDerechosForm, 'patchValue');
    
    component.cargarDatos();
    
    expect(patchValueSpy).toHaveBeenCalledWith({
      estado: component.pagoDerechoFormState?.estado || ''
    });
  });

  it('should patch form values when getBancoDatos loads banco data', () => {
    component.ngOnInit();
    const patchValueSpy = jest.spyOn(component.pagoDerechosForm, 'patchValue');
    
    component.getBancoDatos();
    
    expect(patchValueSpy).toHaveBeenCalledWith({
      banco: component.solicitudState?.banco || '',
      estado: component.solicitudState?.estado || ''
    });
  });
});
