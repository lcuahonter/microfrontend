// pantallas.component.spec.ts
import { of, throwError } from 'rxjs';
import { Subject, from } from 'rxjs';
import { PantallasComponent } from './pantallas.component';
import { Tramite260605Store } from '../../../../estados/tramites/tramite260605.store';
import { Tramite260605Query } from '../../../../estados/queries/tramite260605.query';
import { ToastrService } from 'ngx-toastr';
import { ModificatNoticeService } from '../../services/modificat-notice.service';
import { WizardService, AccionBoton, JSONResponse } from '@ng-mf/data-access-user';

// Mock the external helpers module
jest.mock('@ng-mf/data-access-user', () => {
  const original = jest.requireActual('@ng-mf/data-access-user');
  return {
    ...original,
    esValidObject: jest.fn(() => true),
    doDeepCopy: jest.fn((o: any) => o),
  };
});

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let tramite260605Store: jest.Mocked<Tramite260605Store>;
  let tramite260605Query: jest.Mocked<Tramite260605Query>;
  let toastrService: jest.Mocked<ToastrService>;
  let modificatNoticeSvc: jest.Mocked<ModificatNoticeService>;
  let wizardService: any;

  beforeEach(() => {
    tramite260605Store = {
      setContinuarTriggered: jest.fn(),
      actualizarIdSolicitud: jest.fn(),
    } as any;

    tramite260605Query = {
      selectSolicitud$: of({}) as any
    } as any;

    toastrService = {
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    modificatNoticeSvc = {
      guardarSolicitud: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } } as any))
    } as any;

    wizardService = { cambio_indice: jest.fn() };
    component = new PantallasComponent(
      tramite260605Store,
      tramite260605Query,
      toastrService,
      modificatNoticeSvc,
      wizardService
    );

    // Mock the ViewChild components that would normally be set by Angular
    (component as any).datosComponent = { validarFormularios: jest.fn().mockReturnValue(true) };
    (component as any).wizardComponent = { siguiente: jest.fn(), atras: jest.fn() };

    component.solicitudState = {
      aduanasSeleccionadas: [],
      cstumbresAtuais: '',
      aduanaActual: '',
      rfc: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      numeroDePermiso: '',
      aduanasDisponibles: [],
      cantidadSolicitada: '',
      idSolicitud: 0,
    } as any;
  });

  afterEach(() => {
    // ensure teardown
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe in ngOnInit', () => {
    component.ngOnInit();
    expect(component.solicitudState).toBeDefined();
    // Should not throw
  });

  it('should emit cargarArchivosEvento on onClickCargaArchivos', () => {
    const spy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(spy).toHaveBeenCalled();
  });

  it('should update activarBotonCargaArchivos in manejaEventoCargaDocumentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
    component.manejaEventoCargaDocumentos(false);
    expect(component.activarBotonCargaArchivos).toBe(false);
  });

  it('should update seccionCargarDocumentos in cargaRealizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should update cargaEnProgreso in onCargaEnProgreso', () => {
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('should call destroyNotifier$ on ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  describe('validarFormulariosPasoActual', () => {
    it('should return true when datosComponent.validarFormularios returns true', () => {
      component.indice = 1;
      (component as any).datosComponent.validarFormularios.mockReturnValue(true);
      expect(component.validarFormulariosPasoActual()).toBe(true);
    });

    it('should return false when datosComponent.validarFormularios returns false', () => {
      component.indice = 1;
      (component as any).datosComponent.validarFormularios.mockReturnValue(false);
      expect(component.validarFormulariosPasoActual()).toBe(false);
    });

    it('should return true when indice !== 1 even if datosComponent is invalid', () => {
      component.indice = 2;
      (component as any).datosComponent.validarFormularios.mockReturnValue(false);
      expect(component.validarFormulariosPasoActual()).toBe(true);
    });

    it('should return true if datosComponent is undefined', () => {
      component.indice = 1;
      (component as any).datosComponent = undefined;
      expect(component.validarFormulariosPasoActual()).toBe(true);
    });
  });

  describe('guardar()', () => {
    it('should resolve promise with valid response and set guardarIdSolicitud, call store', async () => {
      const res = await component.guardar();
      expect(res.codigo).toBe('00');
      expect(component.guardarIdSolicitud).toBe(123);
      expect(tramite260605Store.actualizarIdSolicitud).toHaveBeenCalledWith(123);
    });

    it('should reject when guardarSolicitud throws error', async () => {
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(throwError(() => new Error('fail')));
      await expect(component.guardar()).rejects.toThrow('fail');
    });

     it('should resolve with correct object if response is not valid', async () => {
      // Simulate esValidObject returning false
      const { esValidObject } = require('@ng-mf/data-access-user');
      esValidObject.mockReturnValueOnce(false);
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(of({ id: 0, descripcion: '', codigo: '', data: {} } as any));
        await expect(component.guardar()).resolves.toEqual({ id: 0, descripcion: '', codigo: '', data: {} });
    });
  });

  describe('shouldNavigate$()', () => {
    it('should emit true and call toastrService.success for codigo "00"', done => {
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 42 } } as any));
      component.solicitudState = { aduanasSeleccionadas: [] } as any;

      (component as any).shouldNavigate$().subscribe((result:any) => {
        expect(result).toBe(true);
        expect(toastrService.success).toHaveBeenCalledWith('OK');
        done();
      });
    });

    it('should emit false and call toastrService.error for non-"00" code', done => {
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(of({ codigo: '01', mensaje: 'Error', datos: { id_solicitud: 0 } } as any));
      component.solicitudState = { aduanasSeleccionadas: [] } as any;

      (component as any).shouldNavigate$().subscribe((result:any) => {
        expect(result).toBe(false);
        expect(toastrService.error).toHaveBeenCalledWith('Error');
        done();
      });
    });

    it('should emit false and call toastrService.error when guardarSolicitud errors', done => {
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(throwError(() => new Error('failure')));
      component.solicitudState = { aduanasSeleccionadas: [] } as any;

      (component as any).shouldNavigate$().subscribe((result:any) => {
        expect(result).toBe(false);
        expect(toastrService.error).toHaveBeenCalledWith('failure');
        done();
      });
    });

    it('should handle observable completion and error', done => {
      // Simulate observable error and completion
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(throwError(() => new Error('critical')));
      component.solicitudState = { aduanasSeleccionadas: [] } as any;
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (component as any).shouldNavigate$().subscribe({
        next: (result:any) => {
          expect(result).toBe(false);
          expect(toastrService.error).toHaveBeenCalledWith('critical');
        },
        complete: () => {
          spy.mockRestore();
          done();
        }
      });
    });
  });

  describe('getValorIndice()', () => {
    beforeEach(() => {
      component.pantallasPasos = [{} as any, {} as any, {} as any];
      component.indice = 1;
      component.datosPasos = { ...component.datosPasos, indice: 1 };
      (component as any).datosComponent = { validarFormularios: jest.fn().mockReturnValue(true) };
      (component as any).wizardComponent = { siguiente: jest.fn(), atras: jest.fn() };
    });

    it('should set isPeligro true and not advance when validation fails on cont from first step', () => {
      (component as any).datosComponent.validarFormularios.mockReturnValue(false);

      component.getValorIndice({ accion: 'cont', valor: 1 });
      expect(component.isPeligro).toBe(true);
    });

    it('should navigate (wizard.siguiente) when validation passes and guardar succeeds', done => {
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 55 } } as any));
      component.indice = 1;

      component.getValorIndice({ accion: 'cont', valor: 1 });
      // wait async
      setTimeout(() => {
        expect(component.indice).toBe(2);
        expect(component.datosPasos.indice).toBe(2);
        expect((component as any).wizardComponent.siguiente).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should not advance when guardar returns non-00 code', done => {
      modificatNoticeSvc.guardarSolicitud.mockReturnValueOnce(of({ codigo: '99', mensaje: 'Bad', datos: { id_solicitud: 0 } } as any));
      component.indice = 1;

      component.getValorIndice({ accion: 'cont', valor: 1 });
      setTimeout(() => {
        expect(component.indice).toBe(1);
        expect((component as any).wizardComponent.siguiente).not.toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should go to previous step on accion "ant"', () => {
      component.indice = 2;
      component.getValorIndice({ accion: 'ant', valor: 2 });
      expect(component.indice).toBe(1);
      expect(component.datosPasos.indice).toBe(1);
      expect((component as any).wizardComponent.atras).toHaveBeenCalled();
    });

    it('should handle out-of-bounds valor (no change)', () => {
      component.indice = 2;
      component.getValorIndice({ accion: 'cont', valor: 99 });
      expect(component.indice).toBe(2);
    });

    it('should not break on invalid action', () => {
      component.indice = 2;
      component.getValorIndice({ accion: 'invalid' as any, valor: 2 });
      expect(component.indice).toBe(2);
    });
  });
});
