import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ExencionDeImpuestosService } from './exencion-de-impuestos.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { TableDataNgTable } from '../models/exencion-impuestos.model';

describe('ExencionDeImpuestosService', () => {
  let service: ExencionDeImpuestosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExencionDeImpuestosService],
    });
    service = TestBed.inject(ExencionDeImpuestosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch aduanaIngresara data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          id: 0,
          descripcion: 'AGUA PRIETA',
        },
        {
          id: 1,
          descripcion: 'AEROPUERTOS',
        },
        {
          id: 2,
          descripcion: 'PUERTOS MARÍTIMOS',
        },
        {
          id: 3,
          descripcion: 'FRONTERAS TERRESTRES',
        },
      ],
      message: 'aduana Ingresara',
    };

    service.getAduanaIngresara().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10703/aduanaIngresara.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch usoEspecifico data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          id: 0,
          descripcion: 'Culturales',
        },
      ],
      message: 'Fin al cual se destinará la mercancía',
    };

    service.getusoEspecifico().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10703/finalCualDestinara.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch mercanciaTbl data', () => {
    const mockResponse: TableDataNgTable = {
      tableHeader: [
        'Tipo de mercancía',
        'Cantidad',
        'Unidad de medida de Comercialización',
        'Año',
        'Modelo',
        'Marco',
        'Número de serie',
        'Uso específico de la mercancía',
        'Condición de la mercancía',
        'Vehículo',
      ],
      tableBody: [
        {
          tbodyData: [
            'S',
            '1',
            'Matro Cubico',
            '',
            '',
            '',
            '',
            'S',
            'Usado',
            'No',
          ],
        },
      ],
    };

    service.getMercanciaTbl().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10703/mercancia-table.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch pais data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          id: 1,
          descripcion: 'PAIS_01',
        },
        {
          id: 2,
          descripcion: 'PAIS_02',
        },
        {
          id: 3,
          descripcion: 'PAIS_03',
        },
      ],
      message: 'Consulta exitosa',
    };

    service.getPais().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10703/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch ano data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          id: 0,
          descripcion: '2022',
        },
        {
          id: 1,
          descripcion: '2023',
        },
        {
          id: 2,
          descripcion: '2024',
        },
        {
          id: 3,
          descripcion: '2025',
        },
      ],
      message: 'ano',
    };

    service.getAno().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10703/ano.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch unidadMedida data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          id: 1,
          descripcion: 'UNIDAD_MEDIDA_01',
        },
        {
          id: 2,
          descripcion: 'UNIDAD_MEDIDA_02',
        },
        {
          id: 3,
          descripcion: 'UNIDAD_MEDIDA_03',
        },
      ],
      message: 'Consulta exitosa',
    };

    service.getUnidadMedida().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10703/unidad-medida.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch condicionMercancia data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          id: 1,
          descripcion: 'Condicion_Mercancia_01',
        },
        {
          id: 2,
          descripcion: 'Condicion_Mercancia_02',
        },
        {
          id: 3,
          descripcion: 'Condicion_Mercancia_03',
        },
      ],
      message: 'Consulta exitosa',
    };

    service.getCondicionMercancia().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      'assets/json/10703/condicion-mercancia.json'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch tipoDeMercancia data', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          id: 1,
          descripcion: 'Mercancía_01',
        },
        {
          id: 2,
          descripcion: 'Mercancía_02',
        },
        {
          id: 3,
          descripcion: 'Mercancía_03',
        },
      ],
      message: 'Consulta exitosa',
    };

    service.getTipoDeMercancia().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/10703/tipo-de-mercancia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
