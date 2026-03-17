import { TestBed } from '@angular/core/testing';
import { ElegibilidadTextilesService } from './elegibilidad-textiles.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ElegibilidadDeTextilesStore } from '../../estados/elegibilidad-de-textiles.store';
import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { TextilesState } from '../../estados/elegibilidad-de-textiles.store';
import { of } from 'rxjs';

describe('ElegibilidadTextilesService', () => {
  let service: ElegibilidadTextilesService;
  let httpMock: HttpTestingController;
  let storeSpy: jest.Mocked<ElegibilidadDeTextilesStore>;

  beforeEach(() => {
    storeSpy = {
      _select: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ElegibilidadTextilesService,
        { provide: ElegibilidadDeTextilesStore, useValue: storeSpy }
      ]
    });
    service = TestBed.inject(ElegibilidadTextilesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerMenuDesplegable should return catalogo data', () => {
    const mockResponse: RespuestaCatalogos = { 
      data: [{ id: 1, descripcion: 'Test' }] as Catalogo[], 
      code: 200, 
      message: 'Success' 
    };
    service.obtenerMenuDesplegable('test.json').subscribe(data => {
      expect(data).toEqual(mockResponse.data);
    });
    const req = httpMock.expectOne('../../../../../assets/json/120301/test.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('obtenerTablaDatos should return table data', () => {
    const mockData = [{ id: 1, nombre: 'Fila' }];
    service.obtenerTablaDatos<any>('tabla.json').subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('../../../../../assets/json/120301/tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('getFormData should call store._select', () => {
    const mockState = { test: 'value' } as unknown as TextilesState;
    storeSpy._select.mockReturnValue(of(mockState));
    service.getFormData().subscribe(data => {
      expect(data).toEqual(mockState);
    });
    expect(storeSpy._select).toHaveBeenCalled();
  });

  it('obtenerListaPaises should return countries data', () => {
    const mockData = [{ id: 1, nombre: 'México' }];
    service.obtenerListaPaises().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/120301/ano-de-la-constancia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('getPrefillDatos should return prefill data', () => {
    const mockData = { test: 'prefill' } as unknown as TextilesState;
    service.getPrefillDatos().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/120301/datos-prefill.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});