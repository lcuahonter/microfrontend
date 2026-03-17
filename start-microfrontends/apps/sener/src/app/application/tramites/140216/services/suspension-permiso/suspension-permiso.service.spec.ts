import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SuspensionPermisoService } from './suspension-permiso.service';
import { PermisosVigentesRespuesta, PersonasNotificarRespuesta, TitularDetalleRespuesta } from '../../models/suspension-permiso.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

describe('SuspensionPermisoService', () => {
  let service: SuspensionPermisoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SuspensionPermisoService],
    });
    service = TestBed.inject(SuspensionPermisoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.get with the correct URL for obtenerDocumentosSeleccionados', () => {
    const expectedUrl = 'assets/json/140216/documentos-seleccionados.json';

    service.obtenerDocumentosSeleccionados().subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
  });

  it('should return an Observable of RespuestaCatalogos from obtenerDocumentosSeleccionados', (done) => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: 'Success' };

    service.obtenerDocumentosSeleccionados().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/140216/documentos-seleccionados.json');
    req.flush(mockResponse);
  });

  it('should call HttpClient.get with the correct URL for obtenerPermisosVigentes', () => {
    const expectedUrl = 'assets/json/140216/permisos-vigentes.json';

    service.obtenerPermisosVigentes().subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
  });

  it('should return an Observable of PermisosVigentesRespuesta from obtenerPermisosVigentes', (done) => {
    const mockResponse: PermisosVigentesRespuesta = { code: 200, data: [], message: 'Success' };

    service.obtenerPermisosVigentes().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/140216/permisos-vigentes.json');
    req.flush(mockResponse);
  });

  it('should call HttpClient.get with the correct URL for obtenerDetalleTitular', () => {
    const expectedUrl = 'assets/json/140216/detalle-titular.json';

    service.obtenerDetalleTitular().subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
  });

  it('should return an Observable of TitularDetalleRespuesta from obtenerDetalleTitular', (done) => {
    const mockResponse: TitularDetalleRespuesta = {
      code: 200,
      data: [
        {
          denominacion: 'Empresa XYZ',
          actividadEconomica: 'Comercio',
          correoElectronico: 'empresa@xyz.com',
          rfc: 'XYZ123456789',
          calle: 'Calle 123',
          numeroExterior: '45',
          numeroInterior: 'A',
          codigoPostal: '12345',
          colonia: 'Centro',
          pais: 'México',
          estado: 'CDMX',
          localidad: 'Ciudad de México',
          municipioAlcaldia: 'Cuauhtémoc',
          telefono: '5555555555',
        },
      ],
      message: 'Success',
    };

    service.obtenerDetalleTitular().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/140216/detalle-titular.json');
    req.flush(mockResponse);
  });

  it('should call HttpClient.get with the correct URL for obtenerPersonasNotificar', () => {
    const expectedUrl = 'assets/json/140216/personas-notificar.json';

    service.obtenerPersonasNotificar().subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
  });

  it('should return an Observable of PersonasNotificarRespuesta from obtenerPersonasNotificar', (done) => {
    const mockResponse: PersonasNotificarRespuesta = {
      code: 200,
      data: [
        {
          nombre: 'John',
          apellidoPaterno: 'Doe',
          apellidoMaterno: 'Smith',
          correoElectronico: 'john.doe@example.com',
          pais: 'México',
          entidadFederative: 'CDMX',
          municipioDelegacion: 'Cuauhtémoc',
        },
      ],
      message: 'Success',
    };

    service.obtenerPersonasNotificar().subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });

    const req = httpMock.expectOne('assets/json/140216/personas-notificar.json');
    req.flush(mockResponse);
  });

  it('should handle errors from HttpClient.get in obtenerDetalleTitular', (done) => {
    const errorMessage = 'Error fetching detalle titular';

    service.obtenerDetalleTitular().subscribe({
      next: () => {
        fail('Expected an error, but got a response');
      },
      error: (error) => {
        expect(error.message).toContain(errorMessage);
        done();
      },
    });

    const req = httpMock.expectOne('assets/json/140216/detalle-titular.json');
    req.error(new ErrorEvent('Network error'), { status: 500, statusText: errorMessage });
  });
});