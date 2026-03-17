// @ts-nocheck
import { Tramite240101Store } from './tramite240101Store.store';

describe('Tramite240101Store', () => {
  let obj!: any;

  beforeEach(() => {
    obj = new Tramite240101Store();
  });

  it('should run #updateTabSeleccionado()', async () => {
    obj.update = jest.fn().mockReturnValue([
      null
    ]);
    obj.updateTabSeleccionado({});
    expect(obj.update).toHaveBeenCalled();
  });

  it('should run #updateDatosDelTramiteFormState()', async () => {
    obj.update = jest.fn().mockReturnValue([
      null
    ]);
    obj.updateDatosDelTramiteFormState({});
    expect(obj.update).toHaveBeenCalled();
  });

  it('should run #updatePagoDerechosFormState()', async () => {
    obj.update = jest.fn().mockReturnValue([
      null
    ]);
    obj.updatePagoDerechosFormState({});
    expect(obj.update).toHaveBeenCalled();
  });

  it('should run #updateDestinatarioFinalTablaDatos()', async () => {
    obj.update = jest.fn().mockReturnValue([
      {
        "destinatarioFinalTablaDatos": {}
      }
    ]);
    obj.updateDestinatarioFinalTablaDatos({});
    expect(obj.update).toHaveBeenCalled();
  });

  it('should run #updateProveedorTablaDatos()', async () => {
    obj.update = jest.fn().mockReturnValue([
      {
        "proveedorTablaDatos": {}
      }
    ]);
    obj.updateProveedorTablaDatos({});
    expect(obj.update).toHaveBeenCalled();
  });

  it('should run #updateMercanciaTablaDatos()', async () => {
    obj.update = jest.fn().mockReturnValue([
      {
        "merccancialTablaDatos": {}
      }
    ]);
    obj.updateMercanciaTablaDatos({});
    expect(obj.update).toHaveBeenCalled();
  });

});