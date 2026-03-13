import { ConsultaioState } from "@libs/shared/data-access-user/src";
import { DatosComplimentos, SociaoAccionistas } from "../../../../shared/models/complimentos.model";
import { AggregarComplimentosComponent } from "./aggregar-complimentos.component";
import { Observable } from "rxjs";



describe('AggregarComplimentosComponent', () => {
  let component: AggregarComplimentosComponent;
  let store: any;
  let tramiteQuery: any;
  let consultaQuery: any;

  const mockSociaoAccionista = { rfc: 'RFC123', nombre: 'Test' } as SociaoAccionistas;
  const mockSociaoAccionistaExtranjero = { nombre: 'Extranjero' } as SociaoAccionistas;
  const mockDatosComplimentos = { accionistas: [] } as unknown as DatosComplimentos;
  const mockConsultaState = { readonly: true } as ConsultaioState;

  beforeEach(() => {
    store = {
      setDatosComplimentos: jest.fn(),
      aggregarTablaDatosComplimentos: jest.fn(),
      aggregarTablaDatosComplimentosExtranjera: jest.fn(),
      eliminarTablaDatosComplimentos: jest.fn(),
      eliminarTablaDatosComplimentosExtranjera: jest.fn(),
      setFormValida: jest.fn(),
    };
    tramiteQuery = {
      selectTablaDatosComplimentos$: new Observable(),
      selectTablaDatosComplimentosExtranjera$: new Observable(),
      selectDatosComplimento$: new Observable(subscriber => {
        subscriber.next(mockDatosComplimentos);
      }),
    };
    consultaQuery = {
      selectConsultaioState$: new Observable(subscriber => {
        subscriber.next(mockConsultaState);
      }),
    };
    component = new AggregarComplimentosComponent(store, tramiteQuery, consultaQuery);
    component.consultaState = mockConsultaState;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set esFormularioSoloLectura from consultaQuery', () => {
    expect(component.esFormularioSoloLectura).toBe(true);
  });

  it('should subscribe to tramiteQuery.selectDatosComplimento$', () => {
    expect(component.datosComplimentos).toEqual(mockDatosComplimentos);
  });

  it('modifierComplimentos should call store.setDatosComplimentos', () => {
    component.modifierComplimentos(mockDatosComplimentos);
    expect(store.setDatosComplimentos).toHaveBeenCalledWith(mockDatosComplimentos);
  });

  it('accionistasAgregados should call aggregarTablaDatosComplimentos for nacional', () => {
    component.accionistasAgregados(mockSociaoAccionista);
    expect(store.aggregarTablaDatosComplimentos).toHaveBeenCalledWith(mockSociaoAccionista);
  });

  it('accionistasAgregados should call aggregarTablaDatosComplimentosExtranjera for extranjero', () => {
    component.accionistasAgregados(mockSociaoAccionistaExtranjero);
    expect(store.aggregarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith(mockSociaoAccionistaExtranjero);
  });

  it('accionistasEliminados should call eliminarTablaDatosComplimentos', () => {
    component.accionistasEliminados([mockSociaoAccionista]);
    expect(store.eliminarTablaDatosComplimentos).toHaveBeenCalledWith([mockSociaoAccionista]);
  });

  it('accionistasExtranjerosEliminado should call eliminarTablaDatosComplimentosExtranjera', () => {
    component.accionistasExtranjerosEliminado([mockSociaoAccionistaExtranjero]);
    expect(store.eliminarTablaDatosComplimentosExtranjera).toHaveBeenCalledWith([mockSociaoAccionistaExtranjero]);
  });

  it('setFormValida should call store.setFormValida', () => {
    component.setFormValida(true);
    expect(store.setFormValida).toHaveBeenCalledWith({ complimentos: true });
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const spy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});