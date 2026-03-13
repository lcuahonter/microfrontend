import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ImportacionMaterialDeInvestigacionCientificaService } from './importacion-material-de-investigacion-cientifica.service';
import { Catalogo } from '@ng-mf/data-access-user';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';
import { of } from 'rxjs';

interface BaseResponse<T> {
  codigo: string;
  path: string;
  timestamp: string;
  mensaje: string;
  datos?: T;
}

describe('ImportacionMaterialDeInvestigacionCientificaService', () => {
  let service: ImportacionMaterialDeInvestigacionCientificaService;
  let httpMock: HttpTestingController;

  const mockTramite130112Store = {
    actualizarEstado: jest.fn()
  };

  const mockCatalogoServices = {
    tratadosAcuerdoCatalogo: jest.fn(),
    getpaisesBloqueCatalogo: jest.fn(),
    entidadesFederativasCatalogo: jest.fn(),
    regimenesCatalogo: jest.fn(),
    getRegimenClasificacion: jest.fn(),
    fraccionesArancelariasCatalogo: jest.fn(),
    getFraccionesArancelariasAutoCompleteCatalogo: jest.fn(),
    representacionFederalCatalogo: jest.fn(),
    getUMTCatalogo: jest.fn()
  };

  const mockHttpCoreService = {
    post: jest.fn()
  };

  const mockTramite130112Query = {
    selectSolicitud$: of({})
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ImportacionMaterialDeInvestigacionCientificaService,
        { provide: 'Tramite130112Store', useValue: mockTramite130112Store },
        { provide: 'CatalogoServices', useValue: mockCatalogoServices },
        { provide: 'HttpCoreService', useValue: mockHttpCoreService },
        { provide: 'Tramite130112Query', useValue: mockTramite130112Query }
      ],
    });

    service = TestBed.inject(ImportacionMaterialDeInvestigacionCientificaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test for getListaDePaisesDisponibles removed - method does not exist in service

  it('should fetch lista de países por bloque', () => {
    const mockResponse: Catalogo[] = [{ id: 1, descripcion: 'País 1' }];
    const tramite = '130112';
    const bloqueId = '1';

    jest.spyOn(service['catalogoServices'], 'getpaisesBloqueCatalogo').mockReturnValue(
      of({ 
        codigo: '200', 
        path: '/test', 
        timestamp: '2024-01-01', 
        mensaje: 'Success', 
        datos: mockResponse 
      } as BaseResponse<Catalogo[]>)
    );

    service.getPaisesPorBloque(tramite, bloqueId).subscribe((data: Catalogo[]) => {
      expect(data).toEqual(mockResponse);
    });

    expect(service['catalogoServices'].getpaisesBloqueCatalogo).toHaveBeenCalledWith(tramite, bloqueId);
  });

  // Test for getEntidadFederativa removed - method does not exist in service

  it('should fetch lista de representaciones federales', () => {
    const mockResponse: Catalogo[] = [{ id: 1, descripcion: 'Representación 1' }];

    service.getRepresentacionFederal().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/assets/json/130112/representacion-federal.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch opciones de solicitud', () => {
    const mockResponse: ProductoResponse = {
      options: [{ value: 'Opción 1', label: 'Opción 1' }],
      defaultSelect: 'Opción 1',
    };

    service.getSolicitudeOptions().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/130112/solicitude-options.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch opciones de producto', () => {
    const mockResponse: ProductoResponse = {
      options: [{ value: 'Producto 1', label: 'Producto 1' }],
      defaultSelect: 'Producto 1',
    };

    service.getProductoOptions().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/130112/producto-options.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch lista de fracciones y descripciones de partidas de la mercancía', () => {
    const mockResponse: Catalogo[] = [{ id: 1, descripcion: 'Fracción 1' }];
    const tramite = '130112';
    const ID = '1';

    jest.spyOn(service['catalogoServices'], 'getFraccionesArancelariasAutoCompleteCatalogo').mockReturnValue(
      of({ 
        codigo: '200', 
        path: '/test', 
        timestamp: '2024-01-01', 
        mensaje: 'Success', 
        datos: mockResponse 
      } as BaseResponse<Catalogo[]>)
    );

    service.getFraccionDescripcionPartidasDeLaMercanciaService(tramite, ID).subscribe((data: Catalogo[]) => {
      expect(data).toEqual(mockResponse);
    });

    expect(service['catalogoServices'].getFraccionesArancelariasAutoCompleteCatalogo).toHaveBeenCalledWith(tramite, ID);
  });
});