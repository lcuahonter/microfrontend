import { AsignciondirectaPageComponent } from './asignciondirecta-page.component';
import { Tramite120403Store } from '../../estados/store/tramite120403.store';
import { Tramite120403Query } from '../../estados/queries/tramite120403.query';
import { SolicitudService } from '../../services/solicitud.service';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';

describe('AsignciondirectaPageComponent', () => {
  let component: AsignciondirectaPageComponent;
  let store: Tramite120403Store;
  let query: Tramite120403Query;
  let solicitudService: SolicitudService;
  let toastrService: ToastrService;

  beforeEach(() => {
    store = {
      setContinuarTriggered: jest.fn(),
      setIdSolicitud: jest.fn(),
    } as any;
    query = {
      selectTramite120403$: of({ isContinuarTriggered: false }),
    } as any;
    solicitudService = {
      getAllState: jest.fn().mockReturnValue(of({})),
      buildPayload: jest.fn().mockReturnValue({}),
      guardarDatosPost: jest.fn().mockReturnValue(of({ codigo: '00', mensaje: 'OK', datos: { id_solicitud: 123 } })),
    } as any;
    toastrService = {
      success: jest.fn(),
      error: jest.fn(),
    } as any;

    component = new AsignciondirectaPageComponent(store, query, solicitudService, toastrService);
    component.solicitanteAsigncionComponent = { validarFormularios: jest.fn().mockReturnValue(true) } as any;
  });

  it('debe inicializar correctamente', () => {
    component.ngOnInit();
    expect(component.solicitudState).toBeDefined();
  });

  it('debe manejar el evento de búsqueda', () => {
    component.onBuscarIntento({ submitted: true, invalid: true, numTramite: '123' });
    expect(component.showBuscarError).toBe(true);
    expect(component.numTramite).toBe('123');
  });

  it('debe manejar la validación del formulario', () => {
    component.onFormValidation({ isValid: false, errors: ['Error'] });
    expect(component.showValidationError).toBe(true);
    expect(component.validationErrors).toContain('Error');
  });

  it('debe validar el paso actual correctamente', () => {
    component.indice = 1;
    component.numTramite = '123';
    expect(component.validateCurrentStep()).toBe(true);
    component.numTramite = '';
    expect(component.validateCurrentStep()).toBe(false);
    expect(component.validationErrors).toContain('El número de trámite es requerido.');
  });

  it('debe validar el paso 1 correctamente', () => {
    component.numTramite = '';
    expect(component['validateStep1']()).toBe(false);
    component.numTramite = '456';
    expect(component['validateStep1']()).toBe(true);
  });

  it('debe validar el paso 2 y 3 correctamente', () => {
    expect(component['validateStep2']()).toBe(true);
    expect(component['validateStep3']()).toBe(true);
  });

  it('debe emitir evento de carga de archivos', () => {
    const emitSpy = jest.spyOn(component.cargarArchivosEvento, 'emit');
    component.onClickCargaArchivos();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('debe manejar la activación del botón de carga de documentos', () => {
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('debe manejar la carga realizada', () => {
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('debe actualizar carga en progreso', () => {
    component.onCargaEnProgreso(false);
    expect(component.cargaEnProgreso).toBe(false);
  });

  it('debe manejar el evento de campo obligatorio en blanco', () => {
    component.onBlancoObligatoria(true);
    expect(component.isSaltar).toBe(true);
  });

  it('debe destruir correctamente el componente', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debe manejar la acción del botón de navegación', async () => {
    component.indice = 1;
    const shouldNavigateSpy = jest.spyOn(component, 'shouldNavigate$').mockReturnValue(of(true));
    component.getValorIndice({ accion: 'cont', valor: 1 });
    expect(store.setContinuarTriggered).toHaveBeenCalledWith(true);
    expect(component.isPeligro).toBe(false);
  });

  it('debe validar formularios del paso actual', () => {
    component.indice = 1;
    expect(component.validarFormulariosPasoActual()).toBe(true);
    component.indice = 2;
    expect(component.validarFormulariosPasoActual()).toBe(true);
  });

  it('debe guardar datos correctamente', async () => {
    const response = await component.guardar({});
    expect(response).toBeDefined();
    expect(store.setIdSolicitud).toHaveBeenCalledWith(123);
    expect(component.guardarIdSolicitud).toBe(123);
  });

  it('debe mostrar el texto de alerta de búsqueda', () => {
    component.numTramite = '789';
    expect(component.buscarAlertText).toContain('789');
  });

  it('debe navegar al paso anterior y siguiente', () => {
    component.wizardComponent = { atras: jest.fn(), siguiente: jest.fn(), indiceActual: 0 } as any;
    component.anterior();
    expect(component.indice).toBe(1);
    component.siguiente();
    expect(component.indice).toBe(1);
  });
});