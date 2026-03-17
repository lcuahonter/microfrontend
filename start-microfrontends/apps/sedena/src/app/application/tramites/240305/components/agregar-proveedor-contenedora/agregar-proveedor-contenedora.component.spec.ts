import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';

describe('AgregarProveedorContenedoraComponent', () => {
  let component: AgregarProveedorContenedoraComponent;
  let tramite240305Store: Tramite240305Store;

  beforeEach(() => {
    tramite240305Store = {
      updateProveedorTablaDatos: jest.fn(),
    } as unknown as Tramite240305Store;

    component = new AgregarProveedorContenedoraComponent(tramite240305Store);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería actualizar los datos del proveedor en la tienda', () => {
    const mockData: Proveedor[] = [
      {
        nombreRazonSocial: 'Proveedor ABC',
        rfc: 'ABC123456XYZ',
        curp: 'XYZ123456ABC',
        telefono: '1234567890',
        correoElectronico: 'proveedor@example.com',
        calle: 'Calle Principal',
        numeroExterior: '123',
        numeroInterior: '1A',
        pais: 'México',
        colonia: 'Centro',
        municipioAlcaldia: 'Ciudad de México',
        localidad: 'Zona 1',
        entidadFederativa: 'CDMX',
        estadoLocalidad: 'Activo',
        codigoPostal: '54321',
      },
    ];

    component.updateProveedorTablaDatos(mockData);

    expect(tramite240305Store.updateProveedorTablaDatos).toHaveBeenCalledWith(mockData);
  });
});
