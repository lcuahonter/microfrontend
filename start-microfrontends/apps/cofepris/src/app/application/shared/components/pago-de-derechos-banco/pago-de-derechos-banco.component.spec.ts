import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoDeDerechosBancoComponent } from './pago-de-derechos-banco.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TramitePagoBancoStore } from '../../estados/stores/pago-banco.store';
import { TramitePagoBancoQuery } from '../../estados/queries/pago-banco.query';
import { PagoBancoService } from '../../services/pago-banco.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

describe('PagoDeDerechosBancoComponent', () => {
  let component: PagoDeDerechosBancoComponent;
  let fixture: ComponentFixture<PagoDeDerechosBancoComponent>;
  let mockTramitePagoBancoStore: any;
  let mockTramitePagoBancoQuery: any;
  let mockPagoBancoService: any;
  let mockConsultaioQuery: any;

  const solicitudStateMock = {
    claveDeReferencia: '123456789',
    cadenaDependencia: 'ABCDEFGHIJKLMN',
    banco: 'BANCO1',
    llaveDePago: 'LLAVE1234567890',
    fechaPago: '2024-06-01',
    importePago: '1000'
  };

  beforeEach(async () => {
    mockTramitePagoBancoStore = {
      setClaveDeReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setllaveDePago: jest.fn(),
      setFechaPago: jest.fn(),
      setImportePago: jest.fn(),
    };

    mockTramitePagoBancoQuery = {
      selectSolicitud$: of(solicitudStateMock)
    };

    mockPagoBancoService = {
      consultarDatosBanco: jest.fn().mockReturnValue(of([{ id: 1, nombre: 'Banco 1' }]))
    };

    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PagoDeDerechosBancoComponent],
      providers: [
        FormBuilder,
        { provide: TramitePagoBancoStore, useValue: mockTramitePagoBancoStore },
        { provide: TramitePagoBancoQuery, useValue: mockTramitePagoBancoQuery },
        { provide: PagoBancoService, useValue: mockPagoBancoService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagoDeDerechosBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize bancoCatalogo', () => {
    expect(component.bancoCatalogo.labelNombre).toBe('Banco');
    expect(component.bancoCatalogo.required).toBe(true);
    expect(component.bancoCatalogo.catalogos.length).toBe(1);
  });

  it('should initialize formSolicitud with correct values', () => {
    expect(component.formSolicitud).toBeDefined();
    expect(component.datosImportadorExportador.value.claveDeReferencia).toBe('123456789');
    expect(component.datosImportadorExportador.value.cadenaDependencia).toBe('ABCDEFGHIJKLMN');
    expect(component.datosImportadorExportador.value.banco).toBe('BANCO1');
    expect(component.datosImportadorExportador.value.llaveDePago).toBe('LLAVE1234567890');
    expect(component.datosImportadorExportador.value.fechaPago).toBe('2024-06-01');
    expect(component.datosImportadorExportador.value.importePago).toBe('1000');
  });

  it('should call setValoresStore and update store', () => {
    component.setValoresStore(component.datosImportadorExportador, 'claveDeReferencia', 'setClaveDeReferencia');
    expect(mockTramitePagoBancoStore.setClaveDeReferencia).toHaveBeenCalledWith('123456789');
  });

  it('should patch fechaPago and update store on cambioFechaPago', () => {
    const spy = jest.spyOn(component.datosImportadorExportador, 'patchValue');
    component.cambioFechaPago('2024-06-10');
    expect(spy).toHaveBeenCalledWith({ fechaPago: '2024-06-10' });
    expect(mockTramitePagoBancoStore.setFechaPago).toHaveBeenCalledWith('2024-06-10');
  });

  it('should disable form on guardarDatosFormulario if readonly', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.formSolicitud.disabled).toBe(true);
  });

  it('should enable form on guardarDatosFormulario if not readonly', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.formSolicitud.enabled).toBe(true);
  });

  it('should reset datosImportadorExportador on borrarDatos', () => {
    const spy = jest.spyOn(component.datosImportadorExportador, 'reset');
    component.borrarDatos();
    expect(spy).toHaveBeenCalled();
  });

  it('should clean up on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spy2 = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  describe('validarNumeroDecimal', () => {
    it('should return null for integer', () => {
      const control = { value: '123' } as any;
      expect(PagoDeDerechosBancoComponent.validarNumeroDecimal(control)).toBeNull();
    });
    it('should return null for decimal with up to 2 places', () => {
      const control = { value: '123.45' } as any;
      expect(PagoDeDerechosBancoComponent.validarNumeroDecimal(control)).toBeNull();
    });
    it('should return null for decimal with 1 place', () => {
      const control = { value: '123.5' } as any;
      expect(PagoDeDerechosBancoComponent.validarNumeroDecimal(control)).toBeNull();
    });
    it('should return error for more than 2 decimal places', () => {
      const control = { value: '123.456' } as any;
      expect(PagoDeDerechosBancoComponent.validarNumeroDecimal(control)).toEqual({ invalidDecimal: true });
    });
    it('should return error for non-numeric input', () => {
      const control = { value: 'abc' } as any;
      expect(PagoDeDerechosBancoComponent.validarNumeroDecimal(control)).toEqual({ invalidDecimal: true });
    });
    it('should return null for empty', () => {
      const control = { value: '' } as any;
      expect(PagoDeDerechosBancoComponent.validarNumeroDecimal(control)).toBeNull();
    });
  });

  describe('validarFechaNoFutura', () => {
    it('should return null for today', () => {
      const today = new Date();
      const control = { value: today.toISOString().split('T')[0] } as any;
      expect(PagoDeDerechosBancoComponent.validarFechaNoFutura(control)).toBeNull();
    });
    it('should return error for future date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const control = { value: future.toISOString().split('T')[0] } as any;
      expect(PagoDeDerechosBancoComponent.validarFechaNoFutura(control)).toEqual({ fechaFuturaInvalida: true });
    });
  });

  it('should call obtenerDatosBanco and update bancoCatalogo', () => {
    const service = TestBed.inject(PagoBancoService);
    jest.spyOn(service, 'consultarDatosBanco').mockReturnValue(of([{ id: 2, nombre: 'Banco 2', descripcion: 'Banco 2' }]));
    component.obtenerDatosBanco();
    expect(component.bancoCatalogo.catalogos).toEqual([{ id: 2, nombre: 'Banco 2', descripcion: 'Banco 2' }]);
  });

  it('should call inicializarEstadoFormulario and call guardarDatosFormulario if readonly', () => {
    component.esFormularioSoloLectura = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call inicializarEstadoFormulario and call inicializarFormulario if not readonly', () => {
    component.esFormularioSoloLectura = false;
    const spy = jest.spyOn(component, 'inicializarFormulario');
    component.inicializarEstadoFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call configurarFormularioPagoBanco in inicializarFormulario', () => {
    const spy = jest.spyOn(component, 'configurarFormularioPagoBanco');
    component.inicializarFormulario();
    expect(spy).toHaveBeenCalled();
  });

  it('should call configurarFormularioPagoBanco in ngOnInit', () => {
    const spy = jest.spyOn(component, 'configurarFormularioPagoBanco');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});