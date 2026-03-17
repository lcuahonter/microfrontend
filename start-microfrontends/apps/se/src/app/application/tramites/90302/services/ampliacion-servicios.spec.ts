import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AmpliacionServiciosService } from './ampliacion-servicios.service';
import {
  DatosResponse,
  BitacoraRespuesta,
  SectorRespuesta,
  PlantasRespuesta,
  MercanciasRespuesta,
  ProductorIndirectoRespuesta,
  DatosDelModificacion,
} from '../models/datos-info.model';
import { AmpliacionServiciosState } from '../estados/tramite90302.store';
import { Tramite90302Store } from '../estados/tramite90302.store';

describe('AmpliacionServiciosService', () => {
  let service: AmpliacionServiciosService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: Partial<Tramite90302Store>;

  beforeEach(() => {
    tramiteStoreMock = {
      setInfoRegistro: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AmpliacionServiciosService,
        { provide: Tramite90302Store, useValue: tramiteStoreMock },
      ],
    });

    service = TestBed.inject(AmpliacionServiciosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch datos from JSON', () => {
    const mockResponse: DatosResponse[] = [
      {
        code: 200,
        data: {
          idsubmanufacturer: '123',
          infoServicios: {
            seleccionaLaModalidad: 'Modalidad Test',
            folio: 'Folio Test',
            ano: '2023',
          },
        },
      },
    ];

    service.getDatos().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90302/info-registro-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch bitacora Prosec from JSON', () => {
    const mockResponse: BitacoraRespuesta = {
      code: 200,
      data: [
        {
          tipoModificacion: 'Modificación Test',
          fechaModificacion: '2023-01-01',
          valoresAnteriores: 'Valor Anterior',
          valoresNuevos: 'Valor Nuevo',
        },
      ],
      message: 'Success',
    };

    service.getBitacoraProsec().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90302/bitacora.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch sectores Prosec from JSON', () => {
    const mockResponse: SectorRespuesta = {
      code: 200,
      data: [
        { listaSectores: 'Sector 1', claveSector: '001', estatus: 'Activo' },
        { listaSectores: 'Sector 2', claveSector: '002', estatus: 'Inactivo' },
      ],
      message: 'Success',
    };

    service.getSectoresProsec().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90302/sectores.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch plantas Prosec from JSON', () => {
    const mockResponse: PlantasRespuesta = {
      code: 200,
      data: [
        {
          calle: 'Calle Test',
          numeroExterior: '123',
          numeroInterior: 'A',
          codingPostal: '12345',
          colonia: 'Colonia Test',
          municipio: 'Municipio Test',
          estado: 'Estado Test',
          pais: 'México',
          rfc: 'RFC123',
          razonSocial: 'Razón Social Test',
          domicilioFisical: 'Domicilio Fiscal Test',
          estatus: 'Activo',
        },
      ],
      message: 'Success',
    };

    service.getPlantasProsec().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90302/plantas.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch mercancias Prosec from JSON', () => {
    const mockResponse: MercanciasRespuesta = {
      code: 200,
      data: [
        { fraccionArancelaria: '1234.56.78', claveSector: '001', estatus: 'Activo' },
      ],
      message: 'Success',
    };

    service.getMercanciasProsec().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90302/mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch productor indirecto Prosec from JSON', () => {
    const mockResponse: ProductorIndirectoRespuesta = {
      code: 200,
      data: [
        {
          rfc: 'RFC123',
          denominacion: 'Denominación Test',
          correo: 'correo@test.com',
          estatus: 'Activo',
        },
      ],
      message: 'Success',
    };

    service.getProductorIndirectoProsec().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90302/productor.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch modificacion table data from JSON', () => {
    const mockResponse: DatosDelModificacion[] = [
      {
        id: 1,
        calle: 'Calle Test',
        numeroExterior: 123,
        numeroInterior: 1,
        codigoPostal: 12345,
        colonia: 'Colonia Test',
        municipioOAlcaldia: 'Municipio Test',
        entidadFederativa: 'Entidad Test',
        pais: 'México',
        telefono: '1234567890',
        desEstatus: 'Activo',
      },
    ];

    service.getModificacionTableData().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/90302/modificacion-tabla-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

 
});