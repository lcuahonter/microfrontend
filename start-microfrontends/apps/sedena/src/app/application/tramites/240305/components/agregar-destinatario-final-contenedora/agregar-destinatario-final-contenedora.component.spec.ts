import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { Tramite240305Store } from '../../estados/tramite240305Store.store';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let component: AgregarDestinatarioFinalContenedoraComponent;
  let tramite240305Store: Tramite240305Store;

  beforeEach(() => {
    tramite240305Store = {
      updateDestinatarioFinalTablaDatos: jest.fn(),
    } as unknown as Tramite240305Store;

    component = new AgregarDestinatarioFinalContenedoraComponent(tramite240305Store);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe actualizar los datos finales del destinatario en la tienda', () => {
    const mockData: DestinoFinal[] = [
      {
        nombreRazonSocial: 'Empresa ABC',
        rfc: 'ABC123456789',
        curp: 'ABC123456XYZ',
        telefono: '1234567890',
        correoElectronico: 'test@example.com',
        calle: 'Calle Falsa',
        numeroExterior: '123',
        numeroInterior: '1A',
        pais: 'México',
        colonia: 'Centro',
        municipioAlcaldia: 'Ciudad de México',
        localidad: 'Zona 1',
        entidadFederativa: 'CDMX',
        estadoLocalidad: 'Activa',
        codigoPostal: '12345',
      },
    ];

    component.updateDestinatarioFinalTablaDatos(mockData);

    expect(tramite240305Store.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(mockData);
  });
});
