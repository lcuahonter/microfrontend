import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { ActivatedRoute } from '@angular/router';
import { Destinatario, Fabricante, Facturador, Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosRelacionadosVistaComponent', () => {
  let component: TercerosRelacionadosVistaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TercerosRelacionadosVistaComponent, HttpClientTestingModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {}
          }
        }
      }]

    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fabricantes$ observable on ngOnInit', () => {
    expect(component.fabricanteTablaDatos).toBeDefined();
  });

  it('should initialize destinatarios$ observable on ngOnInit', () => {
    expect(component.destinatarioFinalTablaDatos).toBeDefined();
  });

  it('should initialize proveedores$ observable on ngOnInit', () => {
    expect(component.proveedorTablaDatos).toBeDefined();
  });

  it('should initialize facturadores$ observable on ngOnInit', () => {
    expect(component.facturadorTablaDatos).toBeDefined();
  });

    it('should call addFabricantes and update fabricanteTablaDatos', () => {
      const newFabricantes: Fabricante[] = [{
        id: 1,
        nombreRazonSocial: 'Fabricante 1',
        rfc: 'RFC123456',
        curp: 'CURP123456',
        telefono: '1234567890',
        correoElectronico: 'fabricante1@example.com',
        calle: 'Calle 1',
        numeroExterior: '123',
        numeroInterior: 'A',
        pais: 'México',
        colonia: 'Colonia 1',
        municipioAlcaldia: 'Municipio 1',
        localidad: 'Localidad 1',
        entidadFederativa: 'Entidad 1',
        estadoLocalidad: 'Estado 1',
        codigoPostal: '12345',
        coloniaEquivalente: 'Colonia Equivalente 1',
        nombres: 'Nombre Fabricante',
        primerApellido: 'Apellido 1',
        segundoApellido: 'Apellido 2',
        razonSocial: 'Razon Social Fabricante',
        lada: '123'
      }];
      const updateSpy = jest.spyOn(component['tramiteStore'], 'updateFabricanteTablaDatos');
      component.addFabricantes(newFabricantes);
      expect(updateSpy).toHaveBeenCalledWith(newFabricantes);
    });
  
    it('should call addDestinatarios and update destinatarioFinalTablaDatos', () => {
      const newDestinatarios: Destinatario[] = [{
        id: 1,
        nombreRazonSocial: 'Destinatario 1',
        rfc: 'RFC123456',
        curp: 'CURP123456',
        telefono: '1234567890',
        correoElectronico: 'destinatario1@example.com',
        calle: 'Calle 1',
        numeroExterior: '123',
        numeroInterior: 'A',
        pais: 'México',
        colonia: 'Colonia 1',
        municipioAlcaldia: 'Municipio 1',
        localidad: 'Localidad 1',
        entidadFederativa: 'Entidad 1',
        estadoLocalidad: 'Estado 1',
        codigoPostal: '12345',
        coloniaEquivalente: 'Colonia Equivalente 1',
        nombres: 'Nombre Destinatario',
        primerApellido: 'Apellido 1',
        segundoApellido: 'Apellido 2',
        razonSocial: 'Razon Social Destinatario',
        lada: '123'
      }];
      const updateSpy = jest.spyOn(component['tramiteStore'], 'updateDestinatarioFinalTablaDatos');
      component.addDestinatarios(newDestinatarios);
      expect(updateSpy).toHaveBeenCalledWith(newDestinatarios);
    });
  
    it('should call addProveedores and update proveedorTablaDatos', () => {
      const newProveedores: Proveedor[] = [{
  
        nombreRazonSocial: 'Proveedor 1',
        rfc: 'RFC123456',
        curp: 'CURP123456',
        telefono: '1234567890',
        correoElectronico: 'proveedor1@example.com',
        calle: 'Calle 1',
        numeroExterior: '123',
        numeroInterior: 'A',
        pais: 'México',
        colonia: 'Colonia 1',
        municipioAlcaldia: 'Municipio 1',
        localidad: 'Localidad 1',
        entidadFederativa: 'Entidad 1',
        estadoLocalidad: 'Estado 1',
        codigoPostal: '12345',
        coloniaEquivalente: 'Colonia Equivalente 1',
        nombres: 'Nombre Proveedor',
        primerApellido: 'Apellido 1',
        segundoApellido: 'Apellido 2',
        razonSocial: 'Razon Social Proveedor',
        lada: '123'
      }];
      const updateSpy = jest.spyOn(component['tramiteStore'], 'updateProveedorTablaDatos');
      component.addProveedores(newProveedores);
      expect(updateSpy).toHaveBeenCalledWith(newProveedores);
    });
  
    it('should call addFacturadores and update facturadorTablaDatos', () => {
      const newFacturadores: Facturador[] = [{
  
        nombreRazonSocial: 'Facturador 1',
        rfc: 'RFC123456',
        curp: 'CURP123456',
        telefono: '1234567890',
        correoElectronico: 'facturador1@example.com',
        calle: 'Calle 1',
        numeroExterior: '123',
        numeroInterior: 'A',
        pais: 'México',
        colonia: 'Colonia 1',
        municipioAlcaldia: 'Municipio 1',
        localidad: 'Localidad 1',
        entidadFederativa: 'Entidad 1',
        estadoLocalidad: 'Estado 1',
        codigoPostal: '12345',
        coloniaEquivalente: 'Colonia Equivalente 1',
        nombres: 'Nombre Facturador',
        primerApellido: 'Apellido 1',
        segundoApellido: 'Apellido 2',
        razonSocial: 'Razon Social Facturador',
        lada: '123'
      }];
      const updateSpy = jest.spyOn(component['tramiteStore'], 'updateFacturadorTablaDatos');
      component.addFacturadores(newFacturadores);
      expect(updateSpy).toHaveBeenCalledWith(newFacturadores);
    });
      
});
