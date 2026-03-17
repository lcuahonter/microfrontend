import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { Tramite260207Query } from '../../estados/tramite260207Query.query';
import { Tramite260207Store } from '../../estados/tramite260207Store.store';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent } from '../../../../shared/components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { TablaOpcionConfig, TablaScianConfig, TablaMercanciasDatos, DatosSolicitudFormState, DatosDeTablaSeleccionados } from '../../../../shared/models/datos-solicitud.model';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let tramiteQuery: any;
  let tramiteStore: any;
  let consultaQuery: any;

  beforeEach(() => {
    tramiteQuery = { selectTramiteState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    tramiteStore = {
      updateOpcionConfigDatos: jest.fn(),
      updateScianConfigDatos: jest.fn(),
      updateTablaMercanciasConfigDatos: jest.fn(),
      updateDatosSolicitudFormState: jest.fn(),
      update: jest.fn()
    };
    consultaQuery = { selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };

    component = new ContenedorDeDatosSolicitudComponent(tramiteQuery, tramiteStore, consultaQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateOpcionConfigDatos when opcionSeleccionado is called', () => {
    const event: TablaOpcionConfig[] = [];
    component.opcionSeleccionado(event);
    expect(tramiteStore.updateOpcionConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateScianConfigDatos when scianSeleccionado is called', () => {
    const event: TablaScianConfig[] = [];
    component.scianSeleccionado(event);
    expect(tramiteStore.updateScianConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateTablaMercanciasConfigDatos when mercanciasSeleccionado is called', () => {
    const event: TablaMercanciasDatos[] = [];
    component.mercanciasSeleccionado(event);
    expect(tramiteStore.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateDatosSolicitudFormState when datasolicituActualizar is called', () => {
    const event: DatosSolicitudFormState = {} as any;
    component.datasolicituActualizar(event);
    expect(tramiteStore.updateDatosSolicitudFormState).toHaveBeenCalledWith(event);
  });

  it('should validate contenedor using datosDeLaSolicitudComponent', () => {
    component.datosDeLaSolicitudComponent = { formularioSolicitudValidacion: jest.fn().mockReturnValue(true) } as any;
    expect(component.validarContenedor()).toBe(true);
    component.datosDeLaSolicitudComponent = { formularioSolicitudValidacion: jest.fn().mockReturnValue(false) } as any;
    expect(component.validarContenedor()).toBe(false);
  });

  it('should update store with datosDeTablaSeleccionados', () => {
    const event: DatosDeTablaSeleccionados = {
      opcionSeleccionados: [],
      scianSeleccionados: [],
      mercanciasSeleccionados: [],
      opcionesColapsableState: false
    };
    component.tramiteState = {} as any;
    component.datosDeTablaSeleccionados(event);
    expect(tramiteStore.update).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});