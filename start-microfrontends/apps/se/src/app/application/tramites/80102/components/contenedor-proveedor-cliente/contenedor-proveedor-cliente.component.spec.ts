import { ContenedorProveedorClienteComponent } from "./contenedor-proveedor-cliente.component";


describe('ContenedorProveedorClienteComponent', () => {
  let component: ContenedorProveedorClienteComponent;
  let queryMock: any;

  beforeEach(() => {
    queryMock = {
      selectDatosParaNavegar$: {
        pipe: jest.fn().mockReturnThis(),
        subscribe: jest.fn(),
      },
    };
    component = new ContenedorProveedorClienteComponent(queryMock);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fraccionTablaDatos on ngOnInit', () => {
    const datosParaNavegar = { test: 'value' };
    queryMock.selectDatosParaNavegar$.pipe = jest.fn(() => ({
      subscribe: (cb: any) => cb(datosParaNavegar),
    }));
    component.ngOnInit();
    expect(component.fraccionTablaDatos).toEqual(datosParaNavegar);
  });

  it('should update datosDelProveedor and emit datosActualizadosProveedorClient', () => {
    const emitSpy = jest.spyOn(component.datosActualizadosProveedorClient, 'emit');
    const proveedorData = [{ id: 1, nombre: 'Proveedor' }];
    component.datosActualizadosProveedorCliente(proveedorData as any);
    expect(component.datosDelProveedor).toEqual(proveedorData);
    expect(emitSpy).toHaveBeenCalledWith(proveedorData);
  });

  it('should emit cerrarPopup event', () => {
    const emitSpy = jest.spyOn(component.cerrarPopup, 'emit');
    component.cerrarPopup.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should complete destroyNotifier$ on ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});