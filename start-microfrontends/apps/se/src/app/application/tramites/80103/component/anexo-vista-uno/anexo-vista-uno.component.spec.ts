import { AnexoVistaUnoComponent } from './anexo-vista-uno.component';

describe('AnexoVistaUnoComponent', () => {
  let component: any;
  let mockRouter: any;
  let mockActivatedRoute: any;
  let mockStore: any;
  let mockQuery: any;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    mockActivatedRoute = {};
    mockStore = {
      setImportarDatosTabla: jest.fn(),
      setExportarDatosTabla: jest.fn(),
      setAnnexoUnoSeccionActiva: jest.fn(),
      setDatosParaNavegar: jest.fn(),
      setProyectoImmexTablaLista: jest.fn(),
      setProveedorClienteDatosTablaUno: jest.fn(),
      setProveedorClienteDatosTablaDos: jest.fn(),
    };
    mockQuery = {
      selectImportarTablsDatos$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      },
      selectExportarTablsDatos$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      },
    };
    component = new AnexoVistaUnoComponent(mockRouter, mockActivatedRoute, mockStore, mockQuery);
  });

  it('should initialize anexoUnoConfig and anexoImportacionConfig', () => {
    expect(component.anexoUnoConfig).toBeDefined();
    expect(component.anexoImportacionConfig).toBeDefined();
  });

  it('should initialize anexoUnoTablaLista and anexoDosTablaLista as empty arrays', () => {
    expect(Array.isArray(component.anexoUnoTablaLista)).toBe(true);
    expect(Array.isArray(component.anexoDosTablaLista)).toBe(true);
    expect(component.anexoUnoTablaLista.length).toBe(0);
    expect(component.anexoDosTablaLista.length).toBe(0);
  });

  it('should subscribe to selectImportarTablsDatos$ and update anexoUnoTablaLista', () => {
    const mockData = [{ id: 1 }];
    mockQuery.selectImportarTablsDatos$.subscribe.mockImplementation((cb: any) => cb(mockData));
    component.ngOnInit();
    expect(component.anexoUnoTablaLista).toEqual(mockData);
  });

  it('should not update anexoUnoTablaLista if selectImportarTablsDatos$ returns empty', () => {
    mockQuery.selectImportarTablsDatos$.subscribe.mockImplementation((cb: any) => cb([]));
    component.ngOnInit();
    expect(component.anexoUnoTablaLista).toEqual([]);
  });

  it('should subscribe to selectExportarTablsDatos$ and update anexoDosTablaLista', () => {
    const mockData = [{ id: 2 }];
    mockQuery.selectExportarTablsDatos$.subscribe.mockImplementation((cb: any) => cb(mockData));
    component.ngOnInit();
    expect(component.anexoDosTablaLista).toEqual(mockData);
  });

  it('should not update anexoDosTablaLista if selectExportarTablsDatos$ returns empty', () => {
    mockQuery.selectExportarTablsDatos$.subscribe.mockImplementation((cb: any) => cb([]));
    component.ngOnInit();
    expect(component.anexoDosTablaLista).toEqual([]);
  });

  it('obtenerAnexoUnoDevolverLaLlamada should update anexoUnoTablaLista and call setImportarDatosTabla', () => {
    const event = [{ id: 3 }];
    component.obtenerAnexoUnoDevolverLaLlamada(event);
    expect(component.anexoUnoTablaLista).toEqual(event);
    expect(mockStore.setImportarDatosTabla).toHaveBeenCalledWith(event);
  });

  it('obtenerAnexoUnoDevolverLaLlamada should set empty array if event is undefined', () => {
    component.obtenerAnexoUnoDevolverLaLlamada(undefined);
    expect(component.anexoUnoTablaLista).toEqual([]);
    expect(mockStore.setImportarDatosTabla).toHaveBeenCalledWith([]);
  });

  it('obtenerAnexoDosDevolverLaLlamada should update anexoDosTablaLista and call setExportarDatosTabla', () => {
    const event = [{ id: 4 }];
    component.obtenerAnexoDosDevolverLaLlamada(event);
    expect(component.anexoDosTablaLista).toEqual(event);
    expect(mockStore.setExportarDatosTabla).toHaveBeenCalledWith(event);
  });

  it('obtenerAnexoDosDevolverLaLlamada should set empty array if event is undefined', () => {
    component.obtenerAnexoDosDevolverLaLlamada(undefined);
    expect(component.anexoDosTablaLista).toEqual([]);
    expect(mockStore.setExportarDatosTabla).toHaveBeenCalledWith([]);
  });

  it('rutaLaFraccionDeComplemento should call store and router.navigate if event is valid', () => {
    const event = { catagoria: 'cat', id: 'id', datos: { foo: 'bar' } };
    component.rutaLaFraccionDeComplemento(event);
    expect(mockStore.setAnnexoUnoSeccionActiva).toHaveBeenCalledWith('id');
    expect(mockStore.setDatosParaNavegar).toHaveBeenCalledWith({ foo: 'bar' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['../cat'], { relativeTo: mockActivatedRoute });
  });

  it('rutaLaFraccionDeComplemento should not call store or router if event is invalid', () => {
    component.rutaLaFraccionDeComplemento({});
    expect(mockStore.setAnnexoUnoSeccionActiva).not.toHaveBeenCalled();
    expect(mockStore.setDatosParaNavegar).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('setProyectoImmex should call setProyectoImmexTablaLista', () => {
    const event = [{ id: 5 }];
    component.setProyectoImmex(event);
    expect(mockStore.setProyectoImmexTablaLista).toHaveBeenCalledWith(event);
  });

  it('obtenerProveedorCliente should call setProveedorClienteDatosTablaUno if id is cliente', () => {
    const event = { data: [{ id: 6 }], id: 'cliente' };
    component.obtenerProveedorCliente(event);
    expect(mockStore.setProveedorClienteDatosTablaUno).toHaveBeenCalledWith(event.data);
    expect(mockStore.setProveedorClienteDatosTablaDos).not.toHaveBeenCalled();
  });

  it('obtenerProveedorCliente should call setProveedorClienteDatosTablaDos if id is not cliente', () => {
    const event = { data: [{ id: 7 }], id: 'proveedor' };
    component.obtenerProveedorCliente(event);
    expect(mockStore.setProveedorClienteDatosTablaDos).toHaveBeenCalledWith(event.data);
    expect(mockStore.setProveedorClienteDatosTablaUno).not.toHaveBeenCalled();
  });

  it('obtenerProveedorCliente should call setProveedorClienteDatosTablaDos if id is undefined', () => {
    const event = { data: [{ id: 8 }] };
    component.obtenerProveedorCliente(event);
    expect(mockStore.setProveedorClienteDatosTablaDos).toHaveBeenCalledWith(event.data);
    expect(mockStore.setProveedorClienteDatosTablaUno).not.toHaveBeenCalled();
  });

  it('ngOnDestroy should complete destroyNotifier$', () => {
    const nextSpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});