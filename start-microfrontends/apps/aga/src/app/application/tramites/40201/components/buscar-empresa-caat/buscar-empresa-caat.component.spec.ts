import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuscarEmpresaCaatComponent } from './buscar-empresa-caat.component';
import { Tramite40201Store } from '../../../../core/estados/tramites/tramite40201.store';
import { Tramite40201Query } from '../../../../core/queries/tramite40201.query';
import { TransportacionMaritimaService } from '../../services/transportacion-maritima/transportacion-maritima.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';

import { TransportacionMaritima40201State } from '../../../../core/estados/tramites/tramite40201.store';

describe('BuscarEmpresaCaatComponent', () => {
  let component: BuscarEmpresaCaatComponent;
  let fixture: ComponentFixture<BuscarEmpresaCaatComponent>;
  let mockTramite40201Store: jest.Mocked<Tramite40201Store>;
  let mockTramite40201Query: jest.Mocked<Tramite40201Query>;
  let mockTransportacionMaritimaService: jest.Mocked<TransportacionMaritimaService>;
  let mockConsultaioQuery: jest.Mocked<ConsultaioQuery>;
  let formBuilder: FormBuilder;

  const mockState: Partial<TransportacionMaritima40201State> = {
    tipoDeEmpresaOpcion: 'Nacional',
    buscarPorRFCNa: 'ABCD123456789',
    buscarPorDenominacionNa: 'Empresa Nacional SA',
    folioCaatBusquedaNa: 'CAAT123',
    buscarPorDenominacionEx: 'Foreign Company Inc',
    folioCaatBusquedaEx: 'CAAT456',
    caatRegistradoEmpresaTabla: []
  };

  const mockCaatResponse = {
    data: [
      {
        rfc: 'ABCD123456789',
        nombreDenominacionRazonSocial: 'Empresa Nacional SA',
        caat: 'CAAT123',
        perfilCaat: 'Perfil A',
        inicioVigencia: '2023-01-01',
        finVigencia: '2024-12-31',
        pais: 'México'
      }
    ]
  };

  beforeEach(waitForAsync(() => {
    mockTramite40201Store = {
      setTramite40201State: jest.fn(),
      update: jest.fn()
    } as any;

    mockTramite40201Query = {
      selectSeccionState$: new BehaviorSubject(mockState)
    } as any;

    mockTransportacionMaritimaService = {
      obtenerBuscarEmpresaCaat: jest.fn().mockReturnValue(of(mockCaatResponse))
    } as any;

    mockConsultaioQuery = {
      selectConsultaioState$: new BehaviorSubject({ readonly: false })
    } as any;

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BuscarEmpresaCaatComponent
      ],
      providers: [
        FormBuilder,
        { provide: Tramite40201Store, useValue: mockTramite40201Store },
        { provide: Tramite40201Query, useValue: mockTramite40201Query },
        { provide: TransportacionMaritimaService, useValue: mockTransportacionMaritimaService },
        { provide: ConsultaioQuery, useValue: mockConsultaioQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarEmpresaCaatComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize state and subscribe to state changes on ngOnInit', waitForAsync(() => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.transportacionMaritimaState).toEqual(mockState);
      expect(component.caatRegistradoEmpresaTabla).toEqual(mockState.caatRegistradoEmpresaTabla);
    });
  }));

  it('should create the buscarEmpresaForm with correct controls', () => {
    component.crearTipoDeEmpresaForm();
    const form = component.buscarEmpresaForm;
    expect(form).toBeDefined();
    expect(form.get('tipoDeEmpresa.tipoDeEmpresaOpcion')).toBeDefined();
    expect(form.get('tipoDeEmpresaNacional.buscarPorRFCNa')).toBeDefined();
    expect(form.get('tipoDeEmpresaNacional.buscarPorDenominacionNa')).toBeDefined();
    expect(form.get('tipoDeEmpresaNacional.folioCaatBusquedaNa')).toBeDefined();
    expect(form.get('tipoDeEmpresaExtranjera.buscarPorDenominacionEx')).toBeDefined();
    expect(form.get('tipoDeEmpresaExtranjera.folioCaatBusquedaEx')).toBeDefined();
  });

  it('should initialize form with state values', () => {
    component.transportacionMaritimaState = {
      tipoDeEmpresaOpcion: 'Nacional',
      buscarPorRFCNa: 'ABCD123456789',
      buscarPorDenominacionNa: 'Empresa Nacional SA',
      folioCaatBusquedaNa: 'CAAT123',
      buscarPorDenominacionEx: 'Foreign Company Inc',
      folioCaatBusquedaEx: 'CAAT456',
      caatRegistradoEmpresaTabla: [],
      buscarRfcPFN: '',
      rfcPFN: '',
      nombrePFN: '',
      apellidoPaternoPFN: '',
      apellidoMaternoPFN: '',
      paisPFN: '',
    } as TransportacionMaritima40201State;
    component.crearTipoDeEmpresaForm();
    const expectedFormValue = {
      tipoDeEmpresa: {
        tipoDeEmpresaOpcion: 'Nacional'
      },
      tipoDeEmpresaNacional: {
        buscarPorRFCNa: 'ABCD123456789',
        buscarPorDenominacionNa: 'Empresa Nacional SA',
        folioCaatBusquedaNa: 'CAAT123'
      },
      tipoDeEmpresaExtranjera: {
        buscarPorDenominacionEx: 'Foreign Company Inc',
        folioCaatBusquedaEx: 'CAAT456'
      }
    };
    expect(component.buscarEmpresaForm.value).toEqual(expectedFormValue);
  });

  it('should initialize form based on esFormularioSoloLectura', () => {
    component.esFormularioSoloLectura = true;
    jest.spyOn(component, 'guardarDatosFormulario');
    component.inicializarEstadoFormulario();
    expect(component.guardarDatosFormulario).toHaveBeenCalled();

    component.esFormularioSoloLectura = false;
    jest.spyOn(component, 'crearTipoDeEmpresaForm');
    component.inicializarEstadoFormulario();
    expect(component.crearTipoDeEmpresaForm).toHaveBeenCalled();
  });

  it('should disable form when esFormularioSoloLectura is true', () => {
    component.crearTipoDeEmpresaForm();
    component.esFormularioSoloLectura = true;
    component.buscarEmpresaForm.enable(); 
  });

  it('should enable form when esFormularioSoloLectura is false', () => {
    component.crearTipoDeEmpresaForm();
    component.esFormularioSoloLectura = false;
    component.buscarEmpresaForm.disable(); 
  });

  it('should update vista and store on enCambioDeValor', () => {
    component.crearTipoDeEmpresaForm();
    const valor = 'Extranjera';
    component.enCambioDeValor(valor);
    expect(component.vista).toBe(valor);
    expect(component.tipoDeEmpresa.get('tipoDeEmpresaOpcion')?.value).toBe(valor);
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ tipoDeEmpresaOpcion: valor });
  });

  it('should call limpiarCampos and obtenerBuscarEmpresaCaat on buscarEmpresa', () => {
    jest.spyOn(component, 'limpiarCampos');
    jest.spyOn(component, 'obtenerBuscarEmpresaCaat');
    component.buscarEmpresa();
    expect(component.limpiarCampos).toHaveBeenCalled();
    expect(component.obtenerBuscarEmpresaCaat).toHaveBeenCalled();
  });

  it('should clear form fields and reset store on limpiarCampos', () => {
    component.crearTipoDeEmpresaForm();
    component.limpiarCampos();
    expect(component.tipoDeEmpresaNacional.value).toEqual({
      buscarPorRFCNa: '',
      buscarPorDenominacionNa: '',
      folioCaatBusquedaNa: ''
    });
    expect(component.tipoDeEmpresaExtranjera.value).toEqual({
      buscarPorDenominacionEx: '',
      folioCaatBusquedaEx: ''
    });
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({
      caatRegistradoEmpresaTabla: [],
      buscarPorDenominacionEx: '',
      folioCaatBusquedaEx: '',
      buscarPorRFCNa: '',
      buscarPorDenominacionNa: '',
      folioCaatBusquedaNa: ''
    });
  });

  it('should fetch CAAT enterprises and update table on obtenerBuscarEmpresaCaat', waitForAsync(() => {
    component.obtenerBuscarEmpresaCaat();
    fixture.whenStable().then(() => {
      expect(mockTransportacionMaritimaService.obtenerBuscarEmpresaCaat).toHaveBeenCalled();
      const expectedTable = [
        {
          rfc: 'ABCD123456789',
          nombreDenominacionRazonSocial: 'Empresa Nacional SA',
          caat: 'CAAT123',
          perfilCaat: 'Perfil A',
          inicioVigencia: '2023-01-01',
          finVigencia: '2024-12-31',
          pais: 'México'
        }
      ];
      expect(component.caatRegistradoEmpresaTabla).toEqual(expectedTable);
      expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({
        caatRegistradoEmpresaTabla: expectedTable
      });
    });
  }));

  it('should set store values with setValoresStore', () => {
    component.crearTipoDeEmpresaForm();
    component.tipoDeEmpresa.patchValue({ tipoDeEmpresaOpcion: 'Nacional' });
    component.setValoresStore(component.tipoDeEmpresa, 'tipoDeEmpresaOpcion');
    expect(mockTramite40201Store.setTramite40201State).toHaveBeenCalledWith({ tipoDeEmpresaOpcion: 'Nacional' });
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destruirNotificador$'], 'next');
    const completeSpy = jest.spyOn(component['destruirNotificador$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    component.crearTipoDeEmpresaForm();
    const form = component.buscarEmpresaForm;

    form.patchValue({
      tipoDeEmpresa: { tipoDeEmpresaOpcion: '' },
      tipoDeEmpresaNacional: {
        buscarPorRFCNa: 'A'.repeat(21),
        buscarPorDenominacionNa: 'A'.repeat(51),
        folioCaatBusquedaNa: 'A'.repeat(51)
      },
      tipoDeEmpresaExtranjera: {
        buscarPorDenominacionEx: 'A'.repeat(51),
        folioCaatBusquedaEx: 'A'.repeat(51)
      }
    });

    expect(form.get('tipoDeEmpresaNacional.buscarPorRFCNa')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('tipoDeEmpresaNacional.buscarPorDenominacionNa')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('tipoDeEmpresaNacional.folioCaatBusquedaNa')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('tipoDeEmpresaExtranjera.buscarPorDenominacionEx')?.hasError('maxlength')).toBeTruthy();
    expect(form.get('tipoDeEmpresaExtranjera.folioCaatBusquedaEx')?.hasError('maxlength')).toBeTruthy();
  });

  it('should have correct getters for form groups', () => {
    component.crearTipoDeEmpresaForm();
    expect(component.tipoDeEmpresa).toBe(component.buscarEmpresaForm.get('tipoDeEmpresa'));
    expect(component.tipoDeEmpresaNacional).toBe(component.buscarEmpresaForm.get('tipoDeEmpresaNacional'));
    expect(component.tipoDeEmpresaExtranjera).toBe(component.buscarEmpresaForm.get('tipoDeEmpresaExtranjera'));
  });
});