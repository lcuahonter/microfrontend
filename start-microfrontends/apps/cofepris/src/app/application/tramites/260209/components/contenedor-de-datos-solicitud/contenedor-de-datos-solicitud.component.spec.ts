import { ContenedorDeDatosSolicitudComponent } from './contenedor-de-datos-solicitud.component';
import { ChangeDetectorRef } from '@angular/core';

describe('ContenedorDeDatosSolicitudComponent', () => {
  let component: ContenedorDeDatosSolicitudComponent | undefined;
  let tramite260209Query: any;
  let tramite260209Store: any;
  let consultaQuery: any;
  let cdr: any;

  beforeEach(() => {
    tramite260209Query = { selectTramiteState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    tramite260209Store = {
      updateOpcionConfigDatos: jest.fn(),
      updateScianConfigDatos: jest.fn(),
      updateTablaMercanciasConfigDatos: jest.fn(),
      updateDatosSolicitudFormState: jest.fn(),
      update: jest.fn()
    };
    consultaQuery = { selectConsultaioState$: { pipe: jest.fn().mockReturnThis(), subscribe: jest.fn() } };
    cdr = { detectChanges: jest.fn() };
    component = undefined;
  });

  it('should create', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    expect(component).toBeTruthy();
  });

  it('should set esFormularioSoloLectura and call detectChanges in constructor', () => {
    const mockState = { readonly: true };
    let subscriberFn: any;
    consultaQuery.selectConsultaioState$ = { pipe: jest.fn() };
    consultaQuery.selectConsultaioState$.pipe.mockImplementation(() => ({
      subscribe: (subscriber: any) => {
        subscriberFn = subscriber;
      }
    }));
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    if (typeof subscriberFn === 'function') {
      subscriberFn(mockState);
    } else if (subscriberFn && typeof subscriberFn.next === 'function') {
      subscriberFn.next(mockState);
    }
    expect(component.esFormularioSoloLectura).toBe(true);
    expect(cdr.detectChanges).toHaveBeenCalled();
  });

it('should set tramiteState and update configs on ngOnInit', () => {
  const mockState = {
    opcionConfigDatos: [1],
    scianConfigDatos: [2],
    tablaMercanciasConfigDatos: [3]
  };
  let subscriberFn: any;
  tramite260209Query.selectTramiteState$ = { pipe: jest.fn() };
  tramite260209Query.selectTramiteState$.pipe.mockImplementation(() => ({
    subscribe: (subscriber: any) => {
      if (typeof subscriber === 'function') {
        subscriber(mockState);
      } else if (subscriber && typeof subscriber.next === 'function') {
        subscriber.next(mockState);
      }
    }
  }));
  component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
  component.ngOnInit();
  if (typeof subscriberFn === 'function') {
    subscriberFn(mockState);
  } else if (subscriberFn && typeof subscriberFn.next === 'function') {
    subscriberFn.next(mockState);
  }
  expect(component.tramiteState).toEqual(mockState);
  expect(component.opcionConfig.datos).toEqual([1]);
  expect(component.scianConfig.datos).toEqual([2]);
  expect(component.tablaMercanciasConfig.datos).toEqual([3]);
});

  it('should call updateOpcionConfigDatos on opcionSeleccionado', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    const event = [1, 2, 3];
    component.opcionSeleccionado(event as any);
    expect(tramite260209Store.updateOpcionConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateScianConfigDatos on scianSeleccionado', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    const event = [4, 5];
    component.scianSeleccionado(event as any);
    expect(tramite260209Store.updateScianConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateTablaMercanciasConfigDatos on mercanciasSeleccionado', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    const event = [6, 7];
    component.mercanciasSeleccionado(event as any);
    expect(tramite260209Store.updateTablaMercanciasConfigDatos).toHaveBeenCalledWith(event);
  });

  it('should call updateDatosSolicitudFormState on datasolicituActualizar', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    const event = { test: 'data' };
    component.datasolicituActualizar(event as any);
    expect(tramite260209Store.updateDatosSolicitudFormState).toHaveBeenCalledWith(event);
  });

  it('should call update on datosDeTablaSeleccionados', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    const event = {
      opcionSeleccionados: [1],
      scianSeleccionados: [2],
      mercanciasSeleccionados: [3],
      opcionesColapsableState: { collapsed: true }
    };
    component.datosDeTablaSeleccionados(event as any);
    expect(tramite260209Store.update).toHaveBeenCalled();
  });

  it('should validate contenedor using datosDeLaSolicitudComponent', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    component.datosDeLaSolicitudComponent = { formularioSolicitudValidacion: jest.fn().mockReturnValue(true) } as any;
    expect(component.validarContenedor()).toBe(true);
    component.datosDeLaSolicitudComponent = { formularioSolicitudValidacion: jest.fn().mockReturnValue(false) } as any;
    expect(component.validarContenedor()).toBe(false);
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    component = new ContenedorDeDatosSolicitudComponent(tramite260209Query, tramite260209Store, consultaQuery, cdr);
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});