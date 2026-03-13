import { Tramite240122Store, createInitialState } from './tramite240122Store.store';
import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { DestinoFinal, Proveedor } from '../../../shared/models/terceros-relacionados.model';

describe('Tramite240122Store', () => {
  let store: Tramite240122Store;

  beforeEach(() => {
    store = new Tramite240122Store();
  });

  it('should update selected tab', () => {
    store.updateTabSeleccionado(3);
    const state = store.getValue();
    expect(state.tabSeleccionado).toBe(3);
  });


 it('should set modificar destinatario and reset proveedor', () => {
      const mockDestinatariosFinal = [
      {
        nombreRazonSocial: 'Destinatario Ejemplo',
        rfc: 'RFC123456',
        direccion: 'Av. Reforma, 123',
        telefono: '5551234567',
        correoElectronico: 'destinatario@correo.com',
        curp: 'CURP123456789',
        calle: 'Av. Reforma',
        numeroExterior: '123',
        numeroInterior: 'A',
        colonia: 'Centro',
        codigoPostal: '06000',
        entidadFederativa: 'CDMX',
        municipioAlcaldia: 'Cuauhtémoc',
        pais: 'México',
        localidad: 'Ciudad de México',
        estadoLocalidad: 'CDMX',
      }
    ];
    store.actualizarDatosDestinatario(mockDestinatariosFinal[0]);
    const state = store.getValue();
    expect(state.modificarDestinarioDatos).toEqual(mockDestinatariosFinal[0]);
    expect(state.modificarProveedorDatos).toBeNull();
  });
  it('should update datos del tramite', () => {
    const data: DatosDelTramiteFormState = {
      permisoGeneral: 'PG01',
      usoFinal: 'Venta',
      aduanasSeleccionadas: ['Aduana 1'],
      paisDestino: 'México'
    };
    store.updateDatosDelTramiteFormState(data);
    expect(store.getValue().datosDelTramite).toEqual(data);
  });

  it('should add destinatario final', () => {
    const destinatarios: DestinoFinal[] = [];
    store.updateDestinatarioFinalTablaDatos(destinatarios);
  });

  it('should add proveedores', () => {
    const proveedores: Proveedor[] = [];
    store.updateProveedorTablaDatos(proveedores);
  });
it('should update modificarMercanciasDatos', () => {
    const mercancias: any[] = [];
    store.updateMercanciaTablaDatos(mercancias);
    expect(store.getValue().merccancialTablaDatos).toEqual(mercancias);
  });

  it('should update entire state', () => {
    const newState = {
      tabSeleccionado: 5,
      destinatarioFinalTablaDatos: [],
      proveedorTablaDatos: [],
      merccancialTablaDatos: [],
      datosDelTramite: {
        permisoGeneral: 'P1',
        usoFinal: 'Consumo',
        aduanasSeleccionadas: ['A1'],
        paisDestino: 'Argentina',
      },
    };
    store.actualizarTrimateState(newState);
    expect(store.getValue().tabSeleccionado).toBe(5);
  });

    it('should remove a mercancia', () => {
    store.updateMercanciaTablaDatos([]);
    expect(store.getValue().merccancialTablaDatos).toHaveLength(0);
  });
});
