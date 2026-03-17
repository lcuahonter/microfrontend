import { Tramite240112Store, createInitialState } from './tramite240112Store.store';
import { DatosDelTramiteFormState } from '../../../shared/models/datos-del-tramite.model';
import { PagoDerechosFormState } from '../../../shared/models/pago-de-derechos.model';
import { DestinoFinal, Proveedor } from '../../../shared/models/terceros-relacionados.model';

describe('Tramite240112Store', () => {
  let store: Tramite240112Store;

  beforeEach(() => {
    store = new Tramite240112Store();
  });

  it('should update selected tab', () => {
    store.updateTabSeleccionado(2);
    expect(store.getValue().tabSeleccionado).toBe(2);
  });

  it('should update datos del tramite', () => {
    const datos: DatosDelTramiteFormState = {
      permisoGeneral: 'PERM1',
      usoFinal: 'Consumo',
      aduanasSeleccionadas: ['Aduana 1'],
      paisDestino: 'Chile'
    };
    store.updateDatosDelTramiteFormState(datos);
    expect(store.getValue().datosDelTramite).toEqual(datos);
  });

  it('should update pago de derechos', () => {
    const pago: PagoDerechosFormState = {
      claveReferencia: '123',
      cadenaDependencia: 'XYZ',
      banco: 'BancoTest',
      llavePago: 'LLP456',
      fechaPago: '2025-06-20',
      importePago: '1000'
    };
    store.updatePagoDerechosFormState(pago);
    expect(store.getValue().pagoDerechos).toEqual(pago);
  });

  it('should add destinatarios finales', () => {
    const destinatarios: DestinoFinal[] = [];
    store.updateDestinatarioFinalTablaDatos(destinatarios);
    expect(store.getValue().destinatarioFinalTablaDatos).toEqual(destinatarios);
    
  });

  it('should add proveedores', () => {
    const proveedores: Proveedor[] = [];
    store.updateProveedorTablaDatos(proveedores);
    expect(store.getValue().proveedorTablaDatos).toEqual(proveedores);
  });

  it('should update modificarDestinarioDatos and reset proveedor', () => {
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
    const state = store.getValue();
  
  });

});
