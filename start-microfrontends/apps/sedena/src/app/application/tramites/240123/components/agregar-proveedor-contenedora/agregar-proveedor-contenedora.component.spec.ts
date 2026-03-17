import { TestBed } from '@angular/core/testing';
import { Tramite240123Store } from '../../estados/tramite240123Store.store';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';


describe('AgregarProveedorContenedoraComponent (Jest)', () => {
  let component: AgregarProveedorContenedoraComponent;

  const mockTramiteStore = {
    updateProveedorTablaDatos: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Tramite240123Store, useValue: mockTramiteStore },
      ],
    });

    component = new AgregarProveedorContenedoraComponent(
      mockTramiteStore as any
    );
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateProveedorTablaDatos() with given data', () => {
    const mockProveedores: Proveedor[] = [
      {
        nombreRazonSocial: 'Proveedor Ejemplo',
        curp: 'PEJD800101HDFABC01',
        telefono: '5551234567',
        correoElectronico: 'proveedor@correo.com',
        rfc: 'PEJD800101AAA',
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

    component.updateProveedorTablaDatos(mockProveedores);

    expect(mockTramiteStore.updateProveedorTablaDatos).toHaveBeenCalledWith(mockProveedores);
  });
});