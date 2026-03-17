import { TestBed } from '@angular/core/testing';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { Tramite240123Store } from '../../estados/tramite240123Store.store';
import { Tramite240123Query } from '../../estados/tramite240123Query.query';

describe('AgregarDestinatarioFinalContenedoraComponent (Jest)', () => {
  let component: AgregarDestinatarioFinalContenedoraComponent;

  const mockTramiteStore = {
    updateDestinatarioFinalTablaDatos: jest.fn(),
  };

  const mockTramiteQuery = {
    obtenerTercerosDatos$: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Tramite240123Store, useValue: mockTramiteStore },
        { provide: Tramite240123Query, useValue: mockTramiteQuery },
      ],
    });

    component = new AgregarDestinatarioFinalContenedoraComponent(
      mockTramiteStore as any,
      mockTramiteQuery as any
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateDestinatarioFinalTablaDatos() with given data', () => {
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

    component.updateDestinatarioFinalTablaDatos(mockDestinatariosFinal);

    expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(mockDestinatariosFinal);
  });
});
