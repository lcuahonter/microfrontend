import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistroCuentasBancariasService } from './registro-cuentas-bancarias.service';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';

describe('RegistroCuentasBancariasService', () => {
  let service: RegistroCuentasBancariasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroCuentasBancariasService]
    });
    service = TestBed.inject(RegistroCuentasBancariasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('getSolicitudesTabla should return data', () => {
    const mockData = [{ id: 1, name: 'test' }];
    service.getSolicitudesTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/6001/registro-de-solicitudes-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  test('obtenerDatosDeFormularioDeAPI should return data', () => {
    const mockData = { id: 1, nombre: 'test' };
    service.obtenerDatosDeFormularioDeAPI().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/6001/respuesta-de-la-api.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  test('obtenerTramite should return data', () => {
    const mockResponse = { success: true };
    const id = 123;
    service.obtenerTramite(id).subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  test('cambiarComponente should update componenteActual', done => {
    service.componenteActual.subscribe(value => {
      if (value === 'NuevoComponente') {
        expect(value).toBe('NuevoComponente');
        done();
      }
    });
    service.cambiarComponente('NuevoComponente');
  });

  test('getTipoDePersonaDatos should return data', () => {
    const mockResponse = { data: [] };
    service.getTipoDePersonaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6001/tipo-de-persona.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  test('getPaisDondeRadicaDatos should return data', () => {
    const mockResponse = { data: [] };
    service.getPaisDondeRadicaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6001/pais-donde-radica.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  test('getInstitucionDatos should return data', () => {
    const mockResponse = { data: [] };
    service.getInstitucionDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6001/institucion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  test('getEstadoDatos should return data', () => {
    const mockResponse = { data: [] };
    service.getEstadoDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6001/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  test('getSociedadTablaDatos should return data', () => {
    const mockResponse = { data: [] };
    service.getSociedadTablaDatos().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/6001/sociedad-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  test('getSolicitudesTabla should handle error', done => {
    service.getSolicitudesTabla().subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/6001/registro-de-solicitudes-tabla.json');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  test('obtenerDatosDeFormularioDeAPI should handle error', done => {
    service.obtenerDatosDeFormularioDeAPI().subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(404);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/6001/respuesta-de-la-api.json');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  test('obtenerTramite should handle error', done => {
    const id = 123;
    service.obtenerTramite(id).subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(400);
        done();
      }
    });
    const req = httpMock.expectOne(`${ENVIRONMENT.URL_SERVER_JSON_AUXILIAR}/${id}`);
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });

  test('getTipoDePersonaDatos should handle error', done => {
    service.getTipoDePersonaDatos().subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(403);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/6001/tipo-de-persona.json');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });

  test('getPaisDondeRadicaDatos should handle error', done => {
    service.getPaisDondeRadicaDatos().subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(401);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/6001/pais-donde-radica.json');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  test('getInstitucionDatos should handle error', done => {
    service.getInstitucionDatos().subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/6001/institucion.json');
    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });

  test('getEstadoDatos should handle error', done => {
    service.getEstadoDatos().subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(404);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/6001/estado.json');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  test('getSociedadTablaDatos should handle error', done => {
    service.getSociedadTablaDatos().subscribe({
      next: () => {},
      error: (err) => {
        expect(err.status).toBe(400);
        done();
      }
    });
    const req = httpMock.expectOne('assets/json/6001/sociedad-tabla.json');
    req.flush('Bad request', { status: 400, statusText: 'Bad Request' });
  });
});
