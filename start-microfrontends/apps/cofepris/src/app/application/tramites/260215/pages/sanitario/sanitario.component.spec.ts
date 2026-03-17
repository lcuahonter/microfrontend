import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { SanitarioComponent } from './sanitario.component';
import { RegistroSolicitudService } from '@libs/shared/data-access-user/src/core/services/shared/registro-solicitud.service';
import { Tramite260215Query } from '../../estados/queries/tramite260215.query';
import { Tramite260215Store } from '../../estados/tramites/tramite260215.store';
import { ServiciosPermisoSanitarioService } from '../../services/servicios-permiso-sanitario.service';
import { ToastrService } from 'ngx-toastr';

// Minimal stubs for child components and services used by SanitarioComponent
class MockPasoUnoComponent {
  pagoDeDerechosContenedoraComponent = { validarContenedor: () => false };
  contenedorDeDatosSolicitudComponent = { validarContenedor: () => true };
  tercerosRelacionadosVistaComponent = { validarContenedor: () => true };
  validarPasoUno(): boolean {
    return true;
  }
}

const mockRegistroService = {
  postGuardarDatos: (_id: string, _payload: unknown) => of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } }),
};

const mockQuery = {
  selectTramiteState$: of({}),
};

const mockStore = {
  setIdSolicitud: (_: number) => {},
};

describe('SanitarioComponent (behavior test)', () => {
  let component: SanitarioComponent;
  let fixture: ComponentFixture<SanitarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SanitarioComponent, MockPasoUnoComponent as any],
      providers: [
        { provide: Tramite260215Query, useValue: mockQuery },
        { provide: Tramite260215Store, useValue: mockStore },
        { provide: RegistroSolicitudService, useValue: mockRegistroService },
        { provide: ServiciosPermisoSanitarioService, useValue: {} },
        { provide: ToastrService, useValue: { success: () => {}, error: () => {} } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SanitarioComponent);
    component = fixture.componentInstance;

    // attach a mock child instance for pasoUnoComponent
    component.pasoUnoComponent = new MockPasoUnoComponent() as any;
  });

  it('should set mostrarAlerta true when pagoDeDerechos validation fails and requiresPaymentData is false', (done) => {
    component.requiresPaymentData = false;

    // call the method with continue action
    component.getValorIndice({ accion: 'cont', valor: 2 });

    // postGuardarDatos is async (observable), wait a tick
    setTimeout(() => {
      try {
        expect(component.mostrarAlerta).toBe(true);
        expect(component.seleccionarFilaNotificacion).toBeDefined();
        expect(component.seleccionarFilaNotificacion.txtBtnAceptar).toBe('SI');
        expect(component.seleccionarFilaNotificacion.txtBtnCancelar).toBe('NO');
        done();
      } catch (err) {
        done(err as any);
      }
    }, 10);
  });
});
import { SanitarioComponent } from './sanitario.component';

describe('SanitarioComponent', () => {
  let component: SanitarioComponent;
  let query: any;
  let registroSolicitudService: any;
  let serviciosPermisoSanitarioService: any;

  beforeEach(() => {
    query = { selectTramiteState$: { pipe: jest.fn().mockReturnThis() } };
    registroSolicitudService = {
      postGuardarDatos: jest.fn().mockReturnValue({ pipe: jest.fn().mockReturnThis() })
    };
    serviciosPermisoSanitarioService = {};
    component = new SanitarioComponent(query, registroSolicitudService, serviciosPermisoSanitarioService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cargarArchivosEvento on onClickCargaArchivos', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('should set activarBotonCargaArchivos on manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('should set seccionCargarDocumentos on cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should set cargaEnProgreso on onCargaEnProgreso', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should update seccionCargarDocumentos on actualizarSeccionCargarDocumentos', () => {
    component.indice = 2;
    (component as any).actualizarSeccionCargarDocumentos();
    expect(component.seccionCargarDocumentos).toBe(true);
    component.indice = 1;
    (component as any).actualizarSeccionCargarDocumentos();
    expect(component.seccionCargarDocumentos).toBe(false);
  });

  it('should go to next step on continuarDespuesDeCarga', () => {
    component.wizardComponent = { siguiente: jest.fn() } as any;
    component.continuarDespuesDeCarga();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should go to next step on siguiente', () => {
    component.wizardComponent = { siguiente: jest.fn() } as any;
    component.siguiente();
    expect(component.indice).toBe(3);
    expect(component.datosPasos.indice).toBe(3);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
  });

  it('should go to previous step on anterior', () => {
    component.wizardComponent = { atras: jest.fn() } as any;
    component.indice = 2;
    component.anterior();
    expect(component.indice).toBe(1);
    expect(component.datosPasos.indice).toBe(1);
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should call registroSolicitudService.postGuardarDatos in guardarDatosAPI', () => {
    const pipeMock = jest.fn().mockReturnValue({ subscribe: jest.fn() });
    query.selectTramiteState$.pipe = jest.fn(() => ({
      subscribe: (fn: any) => fn({})
    }));
    registroSolicitudService.postGuardarDatos = jest.fn();
    component.guardarDatosAPI();
    expect(registroSolicitudService.postGuardarDatos).toHaveBeenCalled();
  });

  it('should call registroSolicitudService.postGuardarDatos in onGuardar', () => {
    query.selectTramiteState$.pipe = jest.fn(() => ({
      subscribe: (fn: any) => fn({})
    }));
    registroSolicitudService.postGuardarDatos = jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        subscribe: jest.fn()
      })
    });
    component.onGuardar();
    expect(registroSolicitudService.postGuardarDatos).toHaveBeenCalled();
  });
});