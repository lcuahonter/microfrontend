import { TestBed } from '@angular/core/testing';
import { SolicitudService } from './solicitud.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Solicitud32512Store } from '../estados/solicitud32512.store';
import { of } from 'rxjs';
import { SolicitudModel } from '../models/solicitud.model';

describe('SolicitudService', () => {
  let service: SolicitudService;
  let httpMock: HttpTestingController;
  let solicitud32512Store: jest.Mocked<Solicitud32512Store>;

  const mockCatalogos: Catalogo[] = [
    { id: 1, descripcion: 'Catálogo 1' },
    { id: 2, descripcion: 'Catálogo 2' },
  ];

  const mockData: SolicitudModel = {
    nombreComercial: 'Empresa ABC',
    entidadFederativa: 1,
    municipio: 2,
    colonia: 3,
    calle: 'Av. Reforma',
    numeroExterior: '123',
    numeroInterior: '456',
    codigoPostal: '12345',
    lugarEntidadFederativa: 4,
    lugarMunicipioAlcaldia: 5,
    lugarColonia: 6,
    lugarCalle: 'Calle destrucción',
    lugarNumeroExterior: '789',
    lugarNumeroInterior: '101',
    lugarCodigoPostal: '67890',
    generico1: 'GEN1',
    generico2: 'GEN2',
    archivoDestruccion: new File(['contenido'], 'archivo.pdf'),
  };

  beforeEach(() => {
    solicitud32512Store = {
      actualizarNombreComercial: jest.fn(() => of()),
      actualizarEntidadFederativa: jest.fn(() => of()),
      actualizarMunicipio: jest.fn(() => of()),
      actualizarColonia: jest.fn(() => of()),
      actualizarCalle: jest.fn(() => of()),
      actualizarNumeroExterior: jest.fn(() => of()),
      actualizarNumeroInterior: jest.fn(() => of()),
      actualizarCodigoPostal: jest.fn(() => of()),
      actualizarLugarEntidadFederativa: jest.fn(() => of()),
      actualizarLugarMunicipioAlcaldia: jest.fn(() => of()),
      actualizarLugarColonia: jest.fn(() => of()),
      actualizarLugarCalle: jest.fn(() => of()),
      actualizarLugarNumeroExterior: jest.fn(() => of()),
      actualizarLugarNumeroInterior: jest.fn(() => of()),
      actualizarLugarCodigoPostal: jest.fn(() => of()),
      actualizarGenerico1: jest.fn(() => of()),
      actualizarGenerico2: jest.fn(() => of()),
      actualizarArchivoDestruccion: jest.fn(() => of()),
    } as unknown as jest.Mocked<Solicitud32512Store>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SolicitudService,
        { provide: Solicitud32512Store, useValue: solicitud32512Store },
      ],
    });

    service = TestBed.inject(SolicitudService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch entidad federativa catalog', () => {
    service.conseguirEntidadFederativa().subscribe((res) => {
      expect(res).toEqual(mockCatalogos);
    });

    const req = httpMock.expectOne(
      'assets/json/32512/entidad-federativa-catalogo.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalogos);
  });

  it('should fetch municipio alcaldia catalog', () => {
    service.conseguirMunicipioAlcaldia().subscribe((res) => {
      expect(res).toEqual(mockCatalogos);
    });

    const req = httpMock.expectOne(
      'assets/json/32512/municipio-alcaldia-catalogo.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalogos);
  });

  it('should fetch colonia catalog', () => {
    service.conseguirColonia().subscribe((res) => {
      expect(res).toEqual(mockCatalogos);
    });

    const req = httpMock.expectOne('assets/json/32512/colonia-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockCatalogos);
  });

  it('debe obtener los datos del formulario desde un archivo JSON local', () => {
    const mockSolicitud: SolicitudModel = {
      nombreComercial: 'Empresa ABC',
      entidadFederativa: 1,
      municipio: 2,
      colonia: 3,
      calle: 'Av. Reforma',
      numeroExterior: '123',
      numeroInterior: '456',
      codigoPostal: '12345',
      lugarEntidadFederativa: 4,
      lugarMunicipioAlcaldia: 5,
      lugarColonia: 6,
      lugarCalle: 'Calle destrucción',
      lugarNumeroExterior: '789',
      lugarNumeroInterior: '101',
      lugarCodigoPostal: '67890',
      generico1: 'GEN1',
      generico2: 'GEN2',
      archivoDestruccion: new File(['contenido'], 'archivo.pdf'),
    };

    service.guardarDatosFormulario().subscribe((res) => {
      expect(res).toEqual(mockSolicitud);
    });

    const req = httpMock.expectOne('assets/json/32512/solicitud-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSolicitud);
  });

  it('debe actualizar correctamente todos los campos del store', () => {
    service.actualizarEstadoFormulario(mockData);
    expect(solicitud32512Store.actualizarNombreComercial).toHaveBeenCalledWith(
      mockData.nombreComercial
    );
    expect(
      solicitud32512Store.actualizarEntidadFederativa
    ).toHaveBeenCalledWith(mockData.entidadFederativa);
    expect(solicitud32512Store.actualizarMunicipio).toHaveBeenCalledWith(
      mockData.municipio
    );
    expect(solicitud32512Store.actualizarColonia).toHaveBeenCalledWith(
      mockData.colonia
    );
    expect(solicitud32512Store.actualizarCalle).toHaveBeenCalledWith(
      mockData.calle
    );
    expect(solicitud32512Store.actualizarNumeroExterior).toHaveBeenCalledWith(
      mockData.numeroExterior
    );
    expect(solicitud32512Store.actualizarNumeroInterior).toHaveBeenCalledWith(
      mockData.numeroInterior
    );
    expect(solicitud32512Store.actualizarCodigoPostal).toHaveBeenCalledWith(
      mockData.codigoPostal
    );
    expect(
      solicitud32512Store.actualizarLugarEntidadFederativa
    ).toHaveBeenCalledWith(mockData.lugarEntidadFederativa);
    expect(
      solicitud32512Store.actualizarLugarMunicipioAlcaldia
    ).toHaveBeenCalledWith(mockData.lugarMunicipioAlcaldia);
    expect(solicitud32512Store.actualizarLugarColonia).toHaveBeenCalledWith(
      mockData.lugarColonia
    );
    expect(solicitud32512Store.actualizarLugarCalle).toHaveBeenCalledWith(
      mockData.lugarCalle
    );
    expect(
      solicitud32512Store.actualizarLugarNumeroExterior
    ).toHaveBeenCalledWith(mockData.lugarNumeroExterior);
    expect(
      solicitud32512Store.actualizarLugarNumeroInterior
    ).toHaveBeenCalledWith(mockData.lugarNumeroInterior);
    expect(
      solicitud32512Store.actualizarLugarCodigoPostal
    ).toHaveBeenCalledWith(mockData.lugarCodigoPostal);
    expect(solicitud32512Store.actualizarGenerico1).toHaveBeenCalledWith(
      mockData.generico1
    );
    expect(solicitud32512Store.actualizarGenerico2).toHaveBeenCalledWith(
      mockData.generico2
    );
    expect(
      solicitud32512Store.actualizarArchivoDestruccion
    ).toHaveBeenCalledWith(mockData.archivoDestruccion);
  });
});
