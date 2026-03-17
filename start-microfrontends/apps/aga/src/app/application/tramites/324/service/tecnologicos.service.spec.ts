import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TecnologicosService } from './tecnologicos.service';
import { Catalogo } from '@libs/shared/data-access-user/src';

describe('TecnologicosService', () => {
  let service: TecnologicosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TecnologicosService],
    });
    service = TestBed.inject(TecnologicosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch aduana data', () => {
    const mockResponse: Catalogo[] = [
      { id: 1, descripcion: 'Aduana 1' },
      { id: 2, descripcion: 'Aduana 2' },
    ];

    service.obtenerDatosAduana().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/324/aduana.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch rol data', () => {
    const mockResponse: Catalogo[] = [
      { id: 1, descripcion: 'Rol 1' },
      { id: 2, descripcion: 'Rol 2' },
    ];

    service.obtenerDatosRol().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/324/rol.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch sistema data', () => {
    const mockResponse: Catalogo[] = [
      { id: 1, descripcion: 'Sistema 1' },
      { id: 2, descripcion: 'Sistema 2' },
    ];

    service.obtenerDatosSistema().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/324/sistema.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch tipoMovimiento data', () => {
    const mockResponse: Catalogo[] = [
      { id: 1, descripcion: 'Movimiento 1' },
      { id: 2, descripcion: 'Movimiento 2' },
    ];

    service.obtenerDatosTipoMovimiento().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/324/tipo-movimiento.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle HTTP errors', () => {
    const errorMessage = 'Error occurred';

    service.obtenerDatosAduana().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne('assets/json/324/aduana.json');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });
});