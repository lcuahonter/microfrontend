import { PantallasComponent } from './pantallas.component';
import { of, throwError } from 'rxjs';
import { Tramite130103State } from '../../../../estados/tramites/tramite130103.store';

describe('PantallasComponent', () => {
  let component: PantallasComponent;
  let consultaQuery: any;
  let importacionDefinitivaService: any;
  let tramite130103Store: any;
  let toastrService: any;
  const mockState: Tramite130103State = {
    producto: '', descripcion: '', fraccion: '', cantidad: '', valorPartidaUSD: '', unidadMedida: '', solicitud: '', defaultSelect: '', defaultProducto: '', regimen: '', clasificacion: '', filaSeleccionada: [], cantidadPartidasDeLaMercancia: '', fraccionTigiePartidasDeLaMercancia: '', fraccionDescripcionPartidasDeLaMercancia: '', valorPartidaUSDPartidasDeLaMercancia: '', descripcionPartidasDeLaMercancia: '', valorFacturaUSD: '', bloque: '', usoEspecifico: '', justificacionImportacionExportacion: '', observaciones: '', entidad: '', representacion: '', mostrarTabla: false, mostrarPartidas: [], modificarPartidasDelaMercanciaForm: { cantidadPartidasDeLaMercancia: '', valorPartidaUSDPartidasDeLaMercancia: '', descripcionPartidasDeLaMercancia: '', fraccionTigiePartidasDeLaMercancia: '', fraccionDescripcionPartidasDeLaMercancia: '' }, cantidadTotal: '', valorTotalUSD: '', fechasSeleccionadas: [], tableBodyData: [], unidadesMedida: '', fraccionArancelariaProsec: '', criterioDictamen: '', mercanciaEsquema: '', descripcionFraccionProsec: '', idSolicitud: 1 };

  beforeEach(() => {
    consultaQuery = { selectConsultaioState$: of({ readonly: false }) };
    importacionDefinitivaService = {
      getAllState: jest.fn(() => of(mockState)),
      guardarPayloadDatos: jest.fn(() => ({})),
      guardarDatosPost: jest.fn(() => of({ codigo: '00', mensaje: 'ok', datos: { idSolicitud: 1 } }))
    };
    tramite130103Store = { actualizarEstado: jest.fn() };
    toastrService = { success: jest.fn(), error: jest.fn() };
    component = new PantallasComponent(
      consultaQuery,
      importacionDefinitivaService,
      tramite130103Store,
      toastrService
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set activarBotonCargaArchivos true in manejaEventoCargaDocumentos', () => {
    component.activarBotonCargaArchivos = false;
    component.manejaEventoCargaDocumentos(true);
    expect(component.activarBotonCargaArchivos).toBe(true);
  });

  it('should set seccionCargarDocumentos false in cargaRealizada', () => {
    component.seccionCargarDocumentos = true;
    component.cargaRealizada(true);
    expect(component.seccionCargarDocumentos).toBe(false);
  });

  it('should set seccionCargarDocumentos true in cargaRealizada', () => {
    component.seccionCargarDocumentos = false;
    component.cargaRealizada(false);
    expect(component.seccionCargarDocumentos).toBe(true);
  });

  it('should set cargaEnProgreso in onCargaEnProgreso', () => {
    component.cargaEnProgreso = false;
    component.onCargaEnProgreso(true);
    expect(component.cargaEnProgreso).toBe(true);
  });

  it('should set indiceDePestanaSeleccionada in pestanaCambiado', () => {
    component.indiceDePestanaSeleccionada = 1;
    component.pestanaCambiado(2);
    expect(component.indiceDePestanaSeleccionada).toBe(2);
    component.pestanaCambiado(undefined as any);
    expect(component.indiceDePestanaSeleccionada).toBe(1);
  });

  it('should call pasoNavegarPor in getValorIndice', () => {
    const spy = jest.spyOn(component, 'pasoNavegarPor');
    component.indice = 2;
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.getValorIndice({ valor: 2, accion: 'cont' });
    expect(spy).toHaveBeenCalledWith({ valor: 2, accion: 'cont' });
  });

  it('should set esFormaValido true if pasoUnoComponent.solicitudComponent.validarFormulario returns false', () => {
    component.indice = 1;
    (component as any).pasoUnoComponent = { solicitudComponent: { validarFormulario: () => false } };
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(component.esFormaValido).toBe(true);
  });

  it('should call obtenerDatosDelStore if pasoUnoComponent.solicitudComponent.validarFormulario returns true', () => {
    component.indice = 1;
    (component as any).pasoUnoComponent = { solicitudComponent: { validarFormulario: () => true } };
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    const spy = jest.spyOn(component, 'obtenerDatosDelStore');
    component.getValorIndice({ valor: 1, accion: 'cont' });
    expect(spy).toHaveBeenCalledWith({ valor: 1, accion: 'cont' });
  });

  it('should set indice and call wizardComponent.siguiente in pasoNavegarPor', () => {
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.indice = 1;
    component.pasoNavegarPor({ valor: 2, accion: 'cont' });
    expect(component.indice).toBe(2);
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    component.pasoNavegarPor({ valor: 2, accion: 'back' });
    expect(component.wizardComponent.atras).toHaveBeenCalled();
  });

  it('should call guardar in obtenerDatosDelStore', () => {
    const spy = jest.spyOn(component, 'guardar');
    importacionDefinitivaService.getAllState.mockReturnValue(of(mockState));
    component.wizardComponent = { siguiente: jest.fn(), atras: jest.fn() } as any;
    component.obtenerDatosDelStore({ valor: 1, accion: 'cont' });
    expect(spy).toHaveBeenCalled();
  });

  it('should reject guardar promise on error', async () => {
    importacionDefinitivaService.guardarDatosPost.mockReturnValue(throwError(() => new Error('fail')));
    await expect(component.guardar(mockState, { valor: 2, accion: 'cont' })).rejects.toThrow('fail');
  });

  it('should call destroyNotifier$ next and complete in ngOnDestroy', () => {
    const spyNext = jest.spyOn((component as any).destroyNotifier$, 'next');
    const spyComplete = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spyNext).toHaveBeenCalled();
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should subscribe in ngOnInit', () => {
    component.ngOnInit();
    expect(component.consultaState).toEqual({ readonly: false });
  });
});
