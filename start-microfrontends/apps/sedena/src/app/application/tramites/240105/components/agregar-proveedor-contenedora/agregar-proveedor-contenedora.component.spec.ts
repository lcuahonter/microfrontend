import { TestBed } from '@angular/core/testing';
import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240105Store } from '../../estados/tramite240105Store.store';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';
import { of } from 'rxjs';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { DatosSolicitudService } from '../../../240123/services/datos-solicitud.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AgregarProveedorContenedoraComponent', () => {
  let component: AgregarProveedorContenedoraComponent;
  let mockStore: jest.Mocked<Tramite240105Store>;
  let mockQuery: Partial<Tramite240105Query>;

  beforeEach(() => {
    mockStore = {
      updateProveedorTablaDatos: jest.fn(),
      clearTercerosDatos: jest.fn(),
    } as any;

    mockQuery = {
      obtenerTercerosDatos$: of(null),
    };

    TestBed.configureTestingModule({
      imports: [AgregarProveedorContenedoraComponent, HttpClientTestingModule],

      providers: [
        { provide: Tramite240105Store, useValue: mockStore },
        { provide: Tramite240105Query, useValue: mockQuery },
        DatosSolicitudService
      ],
    });

    component = new AgregarProveedorContenedoraComponent(mockStore, mockQuery as Tramite240105Query);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign terechosDatos$ on ngOnInit', () => {
    component.ngOnInit();
    expect(component.terechosDatos$).toBe(mockQuery.obtenerTercerosDatos$);
  });

  it('should call updateProveedorTablaDatos on store and emit cerrar event', () => {
    const emitSpy = jest.spyOn(component.cerrar, 'emit');
    const proveedores: Proveedor[] = [{
      id: 1,
      nombres: 'Proveedor 1',
      nombreRazonSocial: 'Proveedor 1 S.A.',
      rfc: 'RFC123456789',
      curp: 'CURP123456789',
      telefono: '5551234567',
      correoElectronico: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      pais: '',
      colonia: '',
      municipioAlcaldia: '',
      localidad: '',
      entidadFederativa: '',
      estadoLocalidad: '',
      codigoPostal: ''
    }];
    component.updateProveedorTablaDatos(proveedores);
    expect(mockStore.updateProveedorTablaDatos).toHaveBeenCalledWith(proveedores);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should call clearTercerosDatos on cerrarEvent', () => {
    component.cerrarEvent();
    expect(mockStore.clearTercerosDatos).toHaveBeenCalled();
  });

  it('should have idProcedimiento set to ID_PROCEDIMIENTO', () => {
    expect(component.idProcedimiento).toBeDefined();
  });
});
