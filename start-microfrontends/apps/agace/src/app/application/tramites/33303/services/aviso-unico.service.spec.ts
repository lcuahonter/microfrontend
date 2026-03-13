import { TestBed } from '@angular/core/testing';
import { AvisoUnicoService } from './aviso-unico.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatalogoResponse } from '@libs/shared/data-access-user/src';
import { AvisoValor } from '../models/aviso.model';

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
    httpMock.verify(); // Make sure no outstanding requests
  });

  it('should fetch aviso modify data', () => {
    const mockData: CatalogoResponse = {
      descripcion: 'Test Aviso',
      id: 0
    };

    service.getAvisoModify().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/33303/tipoDeAviso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch solicitante data', () => {
    const mockSolicitante: AvisoValor = {
      claveReferencia: 'Sample',
      cadenaDependencia: '',
      importePago: ''
    };

    service.getSolicitante().subscribe((data) => {
      expect(data).toEqual(mockSolicitante);
    });

    const req = httpMock.expectOne('assets/json/33303/renovacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockSolicitante);
  });

  it('should fetch localidad data', () => {
    const mockLocalidad = { ciudad: 'Chennai' };

    service.obtenerDatosLocalidad().subscribe((data) => {
      expect(data).toEqual(mockLocalidad);
    });

    const req = httpMock.expectOne('assets/json/33303/aviso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockLocalidad);
  });
});
