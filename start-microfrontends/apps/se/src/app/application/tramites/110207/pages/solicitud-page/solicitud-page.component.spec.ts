import { TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { Tramite110207Store } from '../../state/Tramite110207.store';
import { Tramite110207Query } from '../../state/Tramite110207.query';
import { RegistroService } from '../../services/registro.service';
import {
  AlertComponent,
  BtnContinuarComponent,
  PasoFirmaComponent,
  WizardComponent,
} from '@ng-mf/data-access-user';
import { PasoUnoComponent } from '../paso-uno/paso-uno.component';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: any;
  let mockStore: any;
  let mockQuery: any;
  let mockRegistroService: any;

  beforeEach(async () => {
    mockStore = {
      setIdSolicitud: jest.fn(() => of()),
      setFormValida: jest.fn(() => of()),
    };
    mockQuery = {
      selectSolicitud$: of({}),
      selectDestinatarioForm$: of({ nombre: 'John', ciudad: 'CDMX' }),
      selectFormDestinatario$: of({ calle: 'Main St', numeroLetra: '123A' }),
      selectFormDatosDelDestinatario$: of(),
      selectSeccionState$: of({}),
      formDatosCertificado$: of({}),
      formCertificado$: of({}),
    };
    mockRegistroService = {
      getAllState: jest.fn().mockReturnValue(of({})),
      guardarDatosPost: jest
        .fn()
        .mockReturnValue(of({ datos: { id_solicitud: 123 } })),
      getCatalogoById: jest.fn().mockReturnValue(of({})),
      getFraccionesArancelarias: jest.fn().mockReturnValue(of([])),
      getPaisesBloques: jest.fn().mockReturnValue(of([])),
      buildMercanciaSeleccionadas: jest.fn().mockReturnValue(['mercancia']),
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        WizardComponent,
        SolicitudPageComponent,
        PasoUnoComponent,
        PasoFirmaComponent,
        ToastrModule.forRoot(),
        BtnContinuarComponent,
        AlertComponent,
        HttpClientTestingModule,
      ],
      providers: [
        ToastrService,
        { provide: Tramite110207Store, useValue: mockStore },
        { provide: Tramite110207Query, useValue: mockQuery },
        { provide: RegistroService, useValue: mockRegistroService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.pasoUnoComponent = {
      validateAll: jest.fn().mockReturnValue(true),
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select tab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should validate forms and call obtenerDatosDelStore if valid', () => {
    jest.spyOn(component, 'obtenerDatosDelStore');
    component.indice = 1;
    component.pasoUnoComponent.validateAll = jest.fn().mockReturnValue(true);
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.esFormaValido).toBe(false);
    expect(component.obtenerDatosDelStore).toHaveBeenCalled();
  });

  it('should set esFormaValido true if form is invalid', () => {
    component.indice = 1;
    component.pasoUnoComponent.validateAll = jest.fn().mockReturnValue(false);
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.esFormaValido).toBe(true);
  });

  it('should call pasoNavegarPor for valid valor', () => {
    jest.spyOn(component, 'pasoNavegarPor');
    component.indice = 1;
    component.pasoUnoComponent = {
      validateAll: jest.fn().mockReturnValue(true),
    } as any;
    component.wizardComponent = {
      siguiente: jest.fn(),
      atras: jest.fn(),
    } as any;
    component.getValorIndice({ accion: 'cont', valor: 2 });
  });

  it('should call guardar in obtenerDatosDelStore', () => {
    jest.spyOn(component, 'guardar');
    component.obtenerDatosDelStore();
    expect(mockRegistroService.getAllState).toHaveBeenCalled();
  });

  it('should resolve and setIdSolicitud if response is valid', async () => {
    const item: any = {
      mercanciaTabla: [],
      formCertificado: {
        pais: 'MX',
        entidadFederativa: 'CDMX',
        bloque: 'NAFTA',
        fraccionArancelariaForm: '1234',
        nombreComercialForm: 'Steel',
        fechaInicioInput: '2024-01-01',
        fechaFinalInput: '2024-12-31',
      },
      formDatosDelDestinatario: {
        nombres: 'Juan',
        primerApellido: 'Perez',
        segundoApellido: 'Lopez',
        numeroDeRegistroFiscal: 'RFC123',
        razonSocial: 'Empresa SA',
      },
      formDestinatario: {
        ciudad: 'Ciudad',
        calle: 'Calle',
        numeroLetra: '1A',
        lada: '55',
        telefono: '12345678',
        fax: '1234',
        correoElectronico: 'test@mail.com',
        paisDestin: 'MX',
      },
      medioDeTransporteSeleccion: { clave: 'TRUCK' },
      formDatosCertificado: {
        observacionesDates: 'Obs',
        precisaDates: 'Precisa',
        idiomaDates: 'ES',
        EntidadFederativaDates: 'CDMX',
        representacionFederalDates: 'RepFed',
      },
    };
    const response = { datos: { id_solicitud: 123 } };
    mockRegistroService.guardarDatosPost.mockReturnValue(of(response));
    const result = await component.guardar(item);
    expect(mockRegistroService.guardarDatosPost).toHaveBeenCalled();
    expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(123);
  });

  it('should setIdSolicitud to 0 if response datos is invalid', async () => {
    const item: any = {
      mercanciaTabla: [],
      formCertificado: {},
      formDatosDelDestinatario: {},
      formDestinatario: {},
      medioDeTransporteSeleccion: {},
      formDatosCertificado: {},
    };
    const response = { datos: { id_solicitud: null } };
    mockRegistroService.guardarDatosPost.mockReturnValue(of(response));
    await component.guardar(item);
    expect(mockStore.setIdSolicitud).toHaveBeenCalledWith(0);
  });

  it('should reject on error', async () => {
    const item: any = {};
    mockRegistroService.guardarDatosPost.mockReturnValue(
      throwError(() => new Error('fail'))
    );
  });

  it('should call wizardComponent.siguiente for accion cont', () => {
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.pasoNavegarPor({ accion: 'cont', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should call wizardComponent.atras for accion atras', () => {
    component.wizardComponent = {
      siguiente: jest.fn(() => of()),
      atras: jest.fn(() => of()),
    } as any;
    component.pasoNavegarPor({ accion: 'atras', valor: 2 });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should not navigate if valor is out of range', () => {
    component.pasoNavegarPor({ accion: 'cont', valor: 0 });
    expect(component.indice).not.toBe(0);
  });

  it('should return true if pasoUnoComponent does not exist', () => {
    component.pasoUnoComponent = undefined as any;
    expect(component['validarTodosFormulariosPasoUno']()).toBe(true);
  });

  it('should return false if validateAll returns false', () => {
    component.pasoUnoComponent.validateAll = jest.fn().mockReturnValue(false);
    expect(component['validarTodosFormulariosPasoUno']()).toBe(false);
  });

  it('should return true if validateAll returns true', () => {
    component.pasoUnoComponent.validateAll = jest.fn().mockReturnValue(true);
    expect(component['validarTodosFormulariosPasoUno']()).toBe(true);
  });

  it('should clean up on ngOnDestroy', () => {
    jest.spyOn(component.destroyNotifier$, 'next');
    jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
});
