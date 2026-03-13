import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudDeRegistroInvocarService } from './solicitud-de-registro-invocar.service';
import { RespuestaTabla, InstalacionesPrincipalesRespuestaTabla, PersonaRespuestaTabla } from '@libs/shared/data-access-user/src/core/models/32614/dato-comunes.model';

describe('SolicitudDeRegistroInvocarService', () => {
  let service: SolicitudDeRegistroInvocarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SolicitudDeRegistroInvocarService],
    });
    service = TestBed.inject(SolicitudDeRegistroInvocarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data for obtenerTablaDatos', () => {
    const mockResponse: RespuestaTabla = { data: [], code: 200, "message": "Consulta exitosa" };

    service.obtenerTablaDatos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/32614/mercancias-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch data for obtenerInstalacionesPrincipalesTablaDatos', () => {
    const mockResponse: InstalacionesPrincipalesRespuestaTabla = { data: [], code: 200, "message": "Consulta exitosa" };

    service.obtenerInstalacionesPrincipalesTablaDatos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/32614/instalacionesPrincipales-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch data for obtenerPersonaTablaDatos', () => {
    const mockResponse: PersonaRespuestaTabla = { data: [], code: 200, "message": "Consulta exitosa" };

    service.obtenerPersonaTablaDatos().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/32614/personapara.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error for obtenerTablaDatos', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerTablaDatos().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error.error).toBe(mockError);
      }
    );

    const req = httpMock.expectOne('assets/json/32614/mercancias-tabla.json');
    req.error(mockError);
  });

  it('should handle error for obtenerInstalacionesPrincipalesTablaDatos', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerInstalacionesPrincipalesTablaDatos().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error.error).toBe(mockError);
      }
    );

    const req = httpMock.expectOne('assets/json/32614/instalacionesPrincipales-tabla.json');
    req.error(mockError);
  });

  it('should handle error for obtenerPersonaTablaDatos', () => {
    const mockError = new ErrorEvent('Network error');

    service.obtenerPersonaTablaDatos().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error.error).toBe(mockError);
      }
    );

    const req = httpMock.expectOne('assets/json/32614/personapara.json');
    req.error(mockError);
  });
});
