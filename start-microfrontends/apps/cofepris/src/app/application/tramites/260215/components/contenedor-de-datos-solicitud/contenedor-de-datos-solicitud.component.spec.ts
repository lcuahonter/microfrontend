import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent;
  let tramiteQuery: any;
  let tramiteStore: any;

  beforeEach(() => {
    tramiteQuery = {
      selectTramiteState$: {
        pipe: jest.fn(function () {
          return {
            subscribe: jest.fn()
          };
        })
      }
    };
    tramiteStore = {
      updateOpcionConfigDatos: jest.fn(),
      updateScianConfigDatos: jest.fn(),
      updateTablaMercanciasConfigDatos: jest.fn(),
      updateDatosSolicitudFormState: jest.fn(),
      update: jest.fn()
    };

    component = new ContenedorDeDatosSolicitudComponent(tramiteQuery, tramiteStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 it('should set tramiteState and update configs on ngOnInit', () => {
  const mockState = {
    opcionConfigDatos: [1],
    scianConfigDatos: [2],
    tablaMercanciasConfigDatos: [3]
  };
  // Mock pipe to return an object with a subscribe method that calls the observer's next method
  tramiteQuery.selectTramiteState$.pipe = jest.fn(() => ({
    subscribe: (observer: any) => {
      if (typeof observer === 'function') {
        observer(mockState);
      } else if (observer && typeof observer.next === 'function') {
        observer.next(mockState);
      }
    }
  }));
  component.ngOnInit();
  expect(component.tramiteState).toEqual(mockState);
  expect(component.opcionConfig.datos).toEqual([1]);
  expect(component.scianConfig.datos).toEqual([2]);
  expect(component.tablaMercanciasConfig.datos).toEqual([3]);
});

  it('should call updateOpcionConfigDatos on opcionSeleccionado', () => {
    const event = [1, 2, 3];
    component.opcionSeleccionado(event as any);
    expect(tramiteStore.updateOpcionConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateScianConfigDatos on scianSeleccionado', () => {
    const event = [4, 5];
    component.scianSeleccionado(event as any);
    expect(tramiteStore.updateScianConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateTablaMercanciasConfigDatos on mercanciasSeleccionado', () => {
    const event = [6, 7];
    component.mercanciasSeleccionado(event as any);
    expect(tramiteStore.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateDatosSolicitudFormState on datasolicituActualizar', () => {
    const event = { test: 'data' };
    component.datasolicituActualizar(event as any);
    expect(tramiteStore.updateDatosSolicitudFormState).toHaveBeenCalledWith(event);
  });

  it('should call update on datosDeTablaSeleccionados', () => {
    const event = {
      opcionSeleccionados: [1],
      scianSeleccionados: [2],
      mercanciasSeleccionados: [3],
      opcionesColapsableState: { collapsed: true }
    };
    component.datosDeTablaSeleccionados(event as any);
    expect(tramiteStore.update).toHaveBeenCalled();
  });

  it('should validate contenedor using datosDeLaSolicitudComponent', () => {
    component.datosDeLaSolicitudComponent = { formularioSolicitudValidacion: jest.fn().mockReturnValue(true) } as any;
    expect(component.validarContenedor()).toBe(true);
    component.datosDeLaSolicitudComponent = { formularioSolicitudValidacion: jest.fn().mockReturnValue(false) } as any;
    expect(component.validarContenedor()).toBe(false);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});