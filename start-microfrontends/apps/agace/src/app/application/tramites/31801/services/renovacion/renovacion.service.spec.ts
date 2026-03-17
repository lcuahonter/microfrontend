import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RenovacionService } from './renovacion.service';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { RenovacionRespuesta, ManifiestosRespuesta } from '../../models/renovacion.model';

describe('RenovacionService', () => {
  let service: RenovacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RenovacionService],
    });

    service = TestBed.inject(RenovacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch selected documents', () => {
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      data: [
        {
          "id": 1,
          "descripcion": "Document_01"
        },
        {
          "id": 2,
          "descripcion": "Document_01"
        }
      ],
      message: 'Success'
    };

    service.obtenerDocumentosSeleccionados().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/31801/documentos-seleccionados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch renovation data', () => {
    const mockResponse: RenovacionRespuesta = {
      code: 200,
      data: [
        {
          "numeroOficio": "2500302600420259910000014-000014",
          "fechaInicialInput": "21/03/2025",
          "fechaFinalInput": "21/04/2025"
        }
      ],
      message: 'Success'
    };

    service.obtenerRenovacionDatos().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/31801/renovacion-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch manifiestos', () => {
    const mockResponse: ManifiestosRespuesta = {
      code: 200,
      data: [
        {
          "declaracion": {
            "clave": "clave1",
            "descripcion": "Manifiesto bajo protesta de decir verdad, que las circunstancias por las que se otorgó el Registro en el Esquema de Certificación de Empresas, no han variado y continúo cumpliendo con los requisitos inherentes a la misma."
          },
          "manifiestoDeclaracion": true
        }
      ],
      message: 'Success'
    };

    service.getManifiestos().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/31801/manifiestos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle HTTP error for obtenerRenovacionDatos', () => {
    const errorMessage = '404 error';

    service.obtenerRenovacionDatos().subscribe(
      () => fail('Expected an error, not data'),
      (error) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe('Not Found');
      }
    );

    const req = httpMock.expectOne('assets/json/31801/renovacion-datos.json');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  });

});