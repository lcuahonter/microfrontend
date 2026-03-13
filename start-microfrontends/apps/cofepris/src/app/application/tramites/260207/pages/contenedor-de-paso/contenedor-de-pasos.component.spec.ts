import { ContenedorDePasosComponent } from './contenedor-de-pasos.component';
import { ToastrService } from 'ngx-toastr';
import { RegistroSolicitudService } from '@ng-mf/data-access-user';
import { Tramite260207Query } from '../../estados/tramite260207Query.query';
import { Tramite260207Store } from '../../estados/tramite260207Store.store';

describe('ContenedorDePasosComponent', () => {
  let component: ContenedorDePasosComponent;
  let toastrService: any;
  let registroSolicitudService: any;
  let tramiteQuery: any;
  let tramiteStore: any;

  beforeEach(() => {
    toastrService = { success: jest.fn(), error: jest.fn() };
    registroSolicitudService = { postGuardarDatos: jest.fn().mockReturnValue({ subscribe: jest.fn() }) };
    tramiteQuery = { selectTramiteState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    tramiteStore = { setIdSolicitud: jest.fn() };

    component = new ContenedorDePasosComponent(tramiteQuery, tramiteStore, registroSolicitudService, toastrService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set storeData on ngOnInit', () => {
    const mockData = { test: 'value' };
    tramiteQuery.selectTramiteState$.pipe = jest.fn(() => ({
      subscribe: (fn: any) => fn(mockData)
    }));
    component.ngOnInit();
    expect(component.storeData).toEqual(mockData);
  });

  it('should change indice on seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
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

  it('should call wizardComponent.atras and update indices on anterior', () => {
    component.wizardComponent = { atras: jest.fn(), indiceActual: 1 } as any;
    component.anterior();
    expect(component.wizardComponent.atras).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should call wizardComponent.siguiente and update indices on siguiente', () => {
    component.wizardComponent = { siguiente: jest.fn(), indiceActual: 1 } as any;
    component.siguiente();
    expect(component.wizardComponent.siguiente).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(component.datosPasos.indice).toBe(2);
  });

  it('should return correct title from obtenerNombreDelTítulo', () => {
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(1)).toBe(component.tituloMensaje);
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(2)).toBe('Cargar archivos');
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(3)).toBe('Firmar');
    expect(ContenedorDePasosComponent.obtenerNombreDelTítulo(99)).toBe(component.tituloMensaje);
  });

  it('should generate error alert HTML', () => {
    const html = ContenedorDePasosComponent.generarAlertaDeError('Error!');
    expect(html).toContain('Corrija los siguientes errores:');
    expect(html).toContain('Error!');
  });
});