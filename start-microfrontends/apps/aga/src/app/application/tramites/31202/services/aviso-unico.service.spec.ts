import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AvisoUnicoService } from './aviso-unico.service';
import { AvisoValor, PreOperativo, RespuestaConsulta } from '../models/aviso.model';

describe('AvisoUnicoService', () => {
  let service: AvisoUnicoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AvisoUnicoService],
    });

    service = TestBed.inject(AvisoUnicoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests remain
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch datos de localidad', () => {
    const mockResponse = { municipio: 'SomeMunicipio' };

    service.obtenerDatosLocalidad().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/31202/aviso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should catch error on obtenerDatosLocalidad', () => {
    const errorMessage = 'Failed to load';

    service.obtenerDatosLocalidad().subscribe({
      error: (error) => {
        expect(error).toBeTruthy();
      },
    });

    const req = httpMock.expectOne('assets/json/31202/aviso.json');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should fetch solicitante', () => {
    const mockResponse: AvisoValor = { nombre: 'Juan', valor: 'ABC' } as unknown as AvisoValor;

    service.getSolicitante().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/31202/renovacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch radio data', () => {
    const mockData = [
        { id: 1, descripcion: 'Tipo 1' },
        { id: 2, descripcion: 'Tipo 2' },
    ] as unknown as PreOperativo[];

    service.obtenerRadio().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/31202/tipoPersonaradio.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch datos consulta', () => {
    const mockData: RespuestaConsulta = {
      status: 'success',
      data: { clave: 'valor' },
    } as any;

    service.getDatosConsulta().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/31202/consulta_31202.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
