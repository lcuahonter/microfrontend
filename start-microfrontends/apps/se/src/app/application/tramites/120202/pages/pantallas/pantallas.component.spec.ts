import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PantallasComponent } from './pantallas.component';
import { Tramite120202Store } from '../../../../estados/tramites/tramite120202.store';
import { ExpedicionCertificadosAsignacionService } from '../../services/expedicion-certificados-asignacion/expedicion-certificados-asignacion.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite120202Query } from '../../../../estados/queries/tramite120202.query';
import { of, Subject } from 'rxjs';
import { WizardComponent } from '@libs/shared/data-access-user/src';
import { DatosComponent } from '../datos/datos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let fixture: ComponentFixture<PantallasComponent>;
  let store: Tramite120202Store;
  let service: ExpedicionCertificadosAsignacionService;
  let toastr: ToastrService;
  let query: Tramite120202Query;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, WizardComponent],
      declarations: [PantallasComponent],
      providers: [
        Tramite120202Store,
        ExpedicionCertificadosAsignacionService,
        Tramite120202Query,
        { provide: ToastrService, useValue: { error: jest.fn() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallasComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite120202Store);
    service = TestBed.inject(ExpedicionCertificadosAsignacionService);
    toastr = TestBed.inject(ToastrService);
    query = TestBed.inject(Tramite120202Query);

    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.datos = { expedicionCertificadosAsignacionDirectaComponent: { validarFormulario: jest.fn().mockReturnValue(true) } } as any;
    component.datosComponent = {} as DatosComponent;
    component.solicitudState = {
      idSolicitud: 1,
      asignacionOficioNumeroForm: {},
      representacionFederalForm: {},
      controlMontosAsignacionForm: {},
      asignacionDatosForm: { idMecanismoAsignacion: 1 },
      cupoDescripcionForm: { descClasificacionProducto: null },
      distribucionSaldoForm: {},
      cuerpoTabla: [],
      mostrarDetalle: false
    };
    component.pantallasPasos = [{}, {}, {}, {}] as any;
    component.datosPasos = {
      nroPasos: 4,
      indice: 1,
      txtBtnAnt: 'Anterior',
      txtBtnSig: 'Continuar'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should set solicitudState', () => {
    component.solicitudState = undefined as any;
    component.ngOnInit();
    expect(component.solicitudState).toBeDefined();
  });

  it('getValorIndice should handle cont action and valid form', () => {
    jest.spyOn(component, 'obtenerDatosDelStore').mockImplementation();
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.obtenerDatosDelStore).toHaveBeenCalled();
  });

  it('getValorIndice should handle cont action and invalid form', () => {
    component.datos.expedicionCertificadosAsignacionDirectaComponent.validarFormulario = jest.fn().mockReturnValue(false);
    component.indice = 1;
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.esValido).toBe(true);
  });

  it('getValorIndice should handle other actions', () => {
    component.indice = 2;
    jest.spyOn(component, 'pasoNavegarPor').mockImplementation();
    component.getValorIndice({ accion: 'cont', valor: 2 });
    expect(component.pasoNavegarPor).toHaveBeenCalled();
  });

  it('obtenerDatosDelStore should call guardar', () => {
    jest.spyOn(service, 'getAllState').mockReturnValue(of({ test: 1 } as any));
    jest.spyOn(component, 'guardar').mockResolvedValue({} as any);
    component.obtenerDatosDelStore();
    expect(service.getAllState).toHaveBeenCalled();
  });

  it('mostrarErrorDirectoEvento should set mostrarError', () => {
    component.mostrarErrorDirectoEvento(true);
    expect(component.mostrarError).toBe(true);
  });

  it('mostrarNumFolioAsignacionErrorEvento should set error and alert', () => {
    component.mostrarNumFolioAsignacionErrorEvento({ mostrarError: true, valor: 'test' });
    expect(component.mostrarNumFolioAsignacionError).toBe(true);
    expect(component.ALERTA_NUM_FOLIO_ASIGNACION_ERROR).toBeDefined();
  });

  it('guardar should resolve and navigate on valid response', async () => {
    jest.spyOn(service, 'buildPayload').mockReturnValue({ test: 1 });
    jest.spyOn(service, 'guardarDatosPost').mockReturnValue(of({ datos: { foo: 1 } }));
    jest.spyOn(store, 'setIdSolicitud').mockImplementation();
    const res = await component.guardar({} as any);
    expect(store.setIdSolicitud).toHaveBeenCalledWith(0);
    expect(res).toBeDefined();
  });

  
  it('guardar should reject on error', async () => {
    jest.spyOn(service, 'buildPayload').mockReturnValue({ test: 1 });
    jest.spyOn(service, 'guardarDatosPost').mockReturnValue({ subscribe: (_s: any, e: any) => e('err') } as any);
    jest.spyOn(toastr, 'error');
    await expect(component.guardar({} as any)).rejects.toBe('err');
    expect(toastr.error).toHaveBeenCalled();
  });

  it('pasoNavegarPor should call wizardComponent.siguiente and set alertaNotificacion', () => {
    component.folioTemporal = 123;
    component.pantallasPasos = [{}, {}, {}, {}] as any;
    component.datosPasos = { indice: 1, nroPasos: 4, txtBtnAnt: '', txtBtnSig: '' };
    component.indice = 1;
    component.pasoNavegarPor({ accion: 'cont', valor: 2 });
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.alertaNotificacion).toBeDefined();
  });

  it('pasoNavegarPor should call wizardComponent.atras', () => {
    component.pasoNavegarPor({ accion: 'ant', valor: 2 });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('mostrarAgregarErrorEvento should set mostrarAgregarError', () => {
    component.mostrarAgregarErrorEvento(true);
    expect(component.mostrarAgregarError).toBe(true);
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});