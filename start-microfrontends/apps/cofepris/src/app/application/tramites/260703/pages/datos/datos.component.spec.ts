import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosComponent } from './datos.component';
import { Solicitud260702Store } from '../../../../shared/estados/stores/shared2607/tramites260702.store';
import { Solicitud260702Query } from '../../../../shared/estados/queries/shared2607/tramites260702.query';
import { Shared2607Service } from '../../../../shared/services/shared2607/shared2607.service';
import { RegistrarSolicitudMcpService } from '../../../../shared/services/shared2607/registrar-solicitud-mcp.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';

describe('DatosComponent', () => {
  let component: DatosComponent;
  let fixture: ComponentFixture<DatosComponent>;
  let store: Solicitud260702Store;
  let query: Solicitud260702Query;
  let sharedSvc: Shared2607Service;
  let registrarSvc: RegistrarSolicitudMcpService;
  let toastr: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Solicitud260702Store, useValue: { setContinuarTriggered: jest.fn(), setIdSolicitud: jest.fn() } },
        { provide: Solicitud260702Query, useValue: { selectSolicitud$: of({ continuarTriggered: false }) } },
        { provide: Shared2607Service, useValue: { getAllState: jest.fn().mockReturnValue(of({})), buildPayload: jest.fn().mockReturnValue({}) } },
        { provide: RegistrarSolicitudMcpService, useValue: { guardarDatosPost: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } })) } },
        { provide: ToastrService, useValue: { success: jest.fn(), error: jest.fn() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Solicitud260702Store);
    query = TestBed.inject(Solicitud260702Query);
    sharedSvc = TestBed.inject(Shared2607Service);
    registrarSvc = TestBed.inject(RegistrarSolicitudMcpService);
    toastr = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado correctamente en ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudState).toBeDefined();
    expect(component.isContinuarTriggered).toBe(false);
  });

  it('debería emitir el evento cargarArchivosEvento al llamar onClickCargaArchivos', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('debería actualizar activarBotonCargaArchivos al llamar manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('debería actualizar seccionCargarDocumentos al llamar cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('debería actualizar cargaEnProgreso al llamar onCargaEnProgreso', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });

  it('debería validar los formularios del paso actual correctamente', () => {
    component.indice = 1;
    component.pasoUnoComponent = { validarFormularios: () => true } as any;
    expect(component.validarFormulariosPasoActual()).toBe(true);

    component.pasoUnoComponent = { validarFormularios: () => false } as any;
    expect(component.validarFormulariosPasoActual()).toBe(false);

    component.indice = 2;
    expect(component.validarFormulariosPasoActual()).toBe(true);
  });

  it('debería manejar getValorIndice correctamente para avanzar', (done) => {
    component.indice = 1;
    component.pasoUnoComponent = { validarFormularios: () => true } as any;
    const spyStore = jest.spyOn(store, 'setContinuarTriggered');
    const spyWizard = { siguiente: jest.fn() };
    component.wizardComponent = spyWizard as any;
    component.wizardService = { cambio_indice: jest.fn() } as any;

    component.getValorIndice({ accion: 'cont', valor: 1 });
    setTimeout(() => {
      expect(spyStore).toHaveBeenCalledWith(true);
      done();
    }, 0);
  });

  it('debería no avanzar si el formulario no es válido en getValorIndice', () => {
    component.indice = 1;
    component.pasoUnoComponent = { validarFormularios: () => false } as any;
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(component.isPeligro).toBe(true);
  });

  it('debería retroceder correctamente en getValorIndice', () => {
    component.indice = 2;
    const spyWizard = { atras: jest.fn() };
    component.wizardComponent = spyWizard as any;
    component.getValorIndice({ accion: 'ant', valor: 2 });
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(spyWizard.atras).toHaveBeenCalled();
  });

  it('debería guardar correctamente y actualizar guardarIdSolicitud', async () => {
    const data = { test: 'valor' };
    const spySetId = jest.spyOn(store, 'setIdSolicitud');
    await component.guardar(data);
    expect(component.guardarIdSolicitud).toBe(123);
    expect(spySetId).toHaveBeenCalledWith(123);
  });

  it('debería manejar error en guardar', async () => {
    (registrarSvc.guardarDatosPost as any).mockReturnValueOnce({
      subscribe: ({ error }: any) => error('error')
    });
    await expect(component.guardar({})).rejects.toBe('error');
  });

  it('shouldNavigate$ debe emitir true si el código es 00', (done) => {
    (sharedSvc.getAllState as any).mockReturnValueOnce(of({}));
    (registrarSvc.guardarDatosPost as any).mockReturnValueOnce(of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 1 } }));
    component['shouldNavigate$']().subscribe((result) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('shouldNavigate$ debe emitir false si el código no es 00', (done) => {
    (sharedSvc.getAllState as any).mockReturnValueOnce(of({}));
    (registrarSvc.guardarDatosPost as any).mockReturnValueOnce(of({ codigo: '01', mensaje: 'Error', datos: {} }));
    component['shouldNavigate$']().subscribe((result) => {
      expect(result).toBe(false);
      done();
    });
  });

  it('debería inicializar datosPasos correctamente', () => {
    expect(component.datosPasos.nroPasos).toBe(component.pasos.length);
    expect(component.datosPasos.indice).toBe(component.indice);
    expect(component.datosPasos.txtBtnAnt).toBe('Anterior');
    expect(component.datosPasos.txtBtnSig).toBe('Continuar');
  });

  it('debería mostrar el mensaje de alerta de privacidad', () => {
    expect(component.mensajeAlertaAvisoPrivacidad).toBeDefined();
  });

  it('debería tener pasos y pantallasPasos definidos', () => {
    expect(component.pasos).toBeDefined();
    expect(component.pantallasPasos).toBeDefined();
  });
});