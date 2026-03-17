import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TplService } from './Tpl.service';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { API_POST_TPL, API_GET_REPRESENTACION_FEDERAL, API_POST_DETALLE_TPL, IDASIGNACION } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { TplRequest } from '../models/request/tpl-request.model';
import { TplResponse } from '../models/response/tpl-response.model';
import { RepresentaciónFederalResponse } from '../models/response/representacion-federal-response.model';
import { TplDetalleRequest } from '../models/request/tpl-detalle-request.model';
import { TplDetalleResponse } from '../models/response/tpl-detalle-response.model';

describe('TplService', () => {
  let service: TplService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TplService]
    });
    service = TestBed.inject(TplService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('posTpl', () => {
    it('should send POST request', () => {
      const mockPayload: TplRequest = { test: 'data' } as any;
      const mockResponse: BaseResponse<TplResponse[]> = {
        codigo: '200',
        mensaje: 'Success',
        datos: [{ id: 1, descripcion: 'Test' }] as any,
        path: '/api/tpl',
        timestamp: new Date().toISOString()
      };

      service.posTpl(mockPayload).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${ENVIRONMENT.API_HOST}/api/${API_POST_TPL}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('getRepresentacionFederal', () => {
    it('should send GET request', () => {
      const idAsignacion = 12345;
      const mockResponse: BaseResponse<RepresentaciónFederalResponse> = {
        codigo: '200',
        mensaje: 'Success',
        datos: { id: 1, descripcion: 'Test' } as any,
        path: '/api/representacion',
        timestamp: new Date().toISOString()
      };

      service.getRepresentacionFederal(idAsignacion).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_REPRESENTACION_FEDERAL.replace(IDASIGNACION, idAsignacion.toString())}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('postTplDetalle', () => {
    it('should send POST request', () => {
      const mockPayload: TplDetalleRequest = { detalle: 'test' } as any;
      const mockResponse: BaseResponse<TplDetalleResponse> = {
        codigo: '200',
        mensaje: 'Success',
        datos: { id: 1, detalle: 'Test' } as any,
        path: '/api/tpl-detalle',
        timestamp: new Date().toISOString()
      };

      service.postTplDetalle(mockPayload).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${ENVIRONMENT.API_HOST}/api/${API_POST_DETALLE_TPL}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
});