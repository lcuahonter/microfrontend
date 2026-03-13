import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosContenedoraComponent } from './terceros-relacionados-contenedora.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Tramite240123Store } from '../../estados/tramite240123Store.store';
import { Tramite240123Query } from '../../estados/tramite240123Query.query';
import { Observable, of } from 'rxjs';
import { DATOS_ESTATICOS } from '../../constants/exportacion-sustancias-quimicas.enum';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { Proveedor } from '../../../../shared/models/terceros-relacionados.model';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TercerosRelacionadosContenedoraComponent', () => {
  let component: TercerosRelacionadosContenedoraComponent;
  let fixture: ComponentFixture<TercerosRelacionadosContenedoraComponent>;
  let tramiteStoreMock: Partial<Tramite240123Store>;
  let tramiteQueryMock: Partial<Tramite240123Query>;
  let routerMock: Partial<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  const DESTINATARIOS_FINAL = [
    { nombreRazonSocial: 'Juan Pérez', rfc: 'JUAP123456', telefono: '123456789', correoElectronico: 'juan.perez@example.com' },
    { nombreRazonSocial: 'Carlos Sánchez', rfc: 'CARS987654', telefono: '987654321', correoElectronico: 'carlos.sanchez@example.com' },
  ];

  const PROVEEDORES = [
    { nombreRazonSocial: 'Proveedor 1', rfc: 'PROV123456', telefono: '555123456', correoElectronico: 'proveedor1@example.com' },
    { nombreRazonSocial: 'Proveedor 2', rfc: 'PROV987654', telefono: '555987654', correoElectronico: 'proveedor2@example.com' },
  ];

  beforeEach(async () => {
    tramiteStoreMock = {
      actualizarDatosDestinatario: jest.fn(),
      actualizarDatosProveedor: jest.fn(),
      eliminarDestinatarioFinal: jest.fn(),
      eliminareliminarProveedorFinal: jest.fn(),
    };

    tramiteQueryMock = {
      getDestinatarioFinalTablaDatos$: of(DESTINATARIOS_FINAL) as unknown as Observable<DestinoFinal[]>,
    };

    routerMock = {
      navigate: jest.fn(),
    };

    activatedRouteMock = {};

    await TestBed.configureTestingModule({
      imports: [CommonModule, TercerosRelacionadosComponent, TercerosRelacionadosContenedoraComponent],
      providers: [
        { provide: Tramite240123Store, useValue: tramiteStoreMock },
        { provide: Tramite240123Query, useValue: tramiteQueryMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TercerosRelacionadosContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los datos de destinatarios finales correctamente', () => {
    component.ngOnInit();
    expect(component.destinatarioFinalTablaDatos.length).toBeGreaterThan(0);
    expect(component.destinatarioFinalTablaDatos).toEqual(DESTINATARIOS_FINAL);
  });

  it('debería cargar los datos de proveedores desde los datos estáticos', () => {
    component.ngOnInit();
    expect(component.proveedorTablaDatos.length).toBeGreaterThan(0);
    expect(component.proveedorTablaDatos).toEqual(DATOS_ESTATICOS);
  });

  it('debería actualizar los datos del destinatario final', () => {
    const DESTINATARIO: DestinoFinal = { 
      nombreRazonSocial: 'Juan Pérez', 
      rfc: 'JUAP123456', 
      telefono: '123456789', 
      correoElectronico: 'juan.perez@example.com',
      curp: 'JUAP890123HDFRRL01',
      calle: 'Calle Falsa',
      numeroExterior: '123',
      numeroInterior: 'A',
      colonia: 'Centro',
      municipioAlcaldia: 'Ciudad',
      estadoLocalidad: 'Estado', 
      codigoPostal: '12345',
      pais: 'México',
      localidad: 'Localidad Ejemplo',
      entidadFederativa: 'Entidad Ejemplo'
    };
    component.modificarDestinarioDatos(DESTINATARIO);
    expect(tramiteStoreMock.actualizarDatosDestinatario).toHaveBeenCalledWith(DESTINATARIO);
  });

  it('debería actualizar los datos del proveedor', () => {
    const PROVEEDOR: Proveedor = { 
      nombreRazonSocial: 'Proveedor 1', 
      rfc: 'PROV123456', 
      telefono: '555123456', 
      correoElectronico: 'proveedor1@example.com',
      curp: 'PROV890123HDFRRL01',
      calle: 'Calle Ejemplo',
      numeroExterior: '123',
      numeroInterior: 'B',
      colonia: 'Colonia Ejemplo',
      municipioAlcaldia: 'Municipio Ejemplo',
      estadoLocalidad: 'Estado Ejemplo',
      codigoPostal: '54321',
      pais: 'México',
      localidad: 'Localidad Ejemplo',
      entidadFederativa: 'Entidad Ejemplo'
    };
    component.modificarProveedorDatos(PROVEEDOR);
    expect(tramiteStoreMock.actualizarDatosProveedor).toHaveBeenCalledWith(PROVEEDOR);
  });

  it('debería eliminar el destinatario final', () => {
    const DESTINATARIO: DestinoFinal = { 
      nombreRazonSocial: 'Juan Pérez', 
      rfc: 'JUAP123456', 
      telefono: '123456789', 
      correoElectronico: 'juan.perez@example.com',
      curp: 'JUAP890123HDFRRL01',
      calle: 'Calle Falsa',
      numeroExterior: '123',
      numeroInterior: 'A',
      colonia: 'Centro',
      municipioAlcaldia: 'Ciudad',
      estadoLocalidad: 'Estado', 
      codigoPostal: '12345',
      pais: 'México',
      localidad: 'Localidad Ejemplo',
      entidadFederativa: 'Entidad Ejemplo'
    };
    component.eliminarDestinatarioFinal(DESTINATARIO);
    expect(tramiteStoreMock.eliminarDestinatarioFinal).toHaveBeenCalledWith(DESTINATARIO);
  });

  it('debería eliminar el proveedor', () => {
    const PROVEEDOR: Proveedor = { 
      nombreRazonSocial: 'Proveedor 1', 
      rfc: 'PROV123456', 
      telefono: '555123456', 
      correoElectronico: 'proveedor1@example.com',
      curp: 'PROV890123HDFRRL01',
      calle: 'Calle Ejemplo',
      numeroExterior: '123',
      numeroInterior: 'B',
      colonia: 'Colonia Ejemplo',
      municipioAlcaldia: 'Municipio Ejemplo',
      estadoLocalidad: 'Estado Ejemplo',
      codigoPostal: '54321',
      pais: 'México',
      localidad: 'Localidad Ejemplo',
      entidadFederativa: 'Entidad Ejemplo'
    };
    component.eliminarProveedor(PROVEEDOR);
    expect(tramiteStoreMock.eliminareliminarProveedorFinal).toHaveBeenCalledWith(PROVEEDOR);
  });

  it('debería navegar a la ruta relativa para agregar un destinatario final', () => {
    component.irAAcciones('../agregar-destino-final');
    expect(routerMock.navigate).toHaveBeenCalledWith(['../agregar-destino-final'], { relativeTo: activatedRouteMock });
  });

  it('debería navegar a la ruta relativa para agregar un proveedor', () => {
    component.irAAcciones('../agregar-proveedor');
    expect(routerMock.navigate).toHaveBeenCalledWith(['../agregar-proveedor'], { relativeTo: activatedRouteMock });
  });
});