import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FacturasAsociadasService } from './facturas-asociadas.service';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { 
  API_GET_FACTURAS_TPL, 
  API_POST_FACTURAS_TPL_ASOCIAR, 
  API_GET_FACTURAS_TPL_ASOCIADAS, 
  API_DELETE_FACTURAS_TPL_ELIMINAR,
  API_GET_FACTURAS_TPL_TOTAL_UNIDAD,
  IDEXPEDICION 
} from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { FacturasTplResponse } from '../models/response/facturas-tpl-response.model';
import { FacturasTplAsociadasRequest } from '../models/request/facturas-tpl-asociadas-request.model';
import { FacturaTplAsociadaResponse } from '../models/response/facturas-tpl-asociada-response.model';
import { FacturasTplEliminarRequest } from '../models/request/facturas-tpl-eliminar-request.model';
import { FacturaTotalUnidadResponse } from '../models/response/facturas-tpl-unidad-total-response.model';

describe('FacturasAsociadasService', () => {
  let service: FacturasAsociadasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FacturasAsociadasService]
    });
    service = TestBed.inject(FacturasAsociadasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFacturasTpl', () => {
    it('should send GET request with parameters', () => {
      const rfc = 'RFC123456789';
      const idExpedicion = 12345;
      const tipoRegimen = 'REG.02';
      
      const mockResponse: BaseResponse<FacturasTplResponse> = {
        codigo: '200',
        mensaje: 'Success',
        datos: { facturas: [] } as any,
        path: '/api/facturas',
        timestamp: new Date().toISOString()
      };

      service.getFacturasTpl(rfc, idExpedicion, tipoRegimen).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_FACTURAS_TPL.replace(IDEXPEDICION, idExpedicion.toString())}`;
      const req = httpMock.expectOne((request) => request.url === expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.has('rfc')).toBeTruthy();
      expect(req.request.params.has('tipoRegimen')).toBeTruthy();
      req.flush(mockResponse);
    });
  });

  describe('postFacturasAsociar', () => {
    it('should send POST request', () => {
      const payload: FacturasTplAsociadasRequest = { facturas: [] } as any;
      
      const mockResponse: BaseResponse<null> = {
        codigo: '200',
        mensaje: 'Success',
        datos: null,
        path: '/api/asociar',
        timestamp: new Date().toISOString()
      };

      service.postFacturasAsociar(payload).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${ENVIRONMENT.API_HOST}/api/${API_POST_FACTURAS_TPL_ASOCIAR}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('getFacturasTplAsociadas', () => {
    it('should send GET request with parameters', () => {
      const idExpedicion = 12345;
      const page = 0;
      const size = 10;
      
      const mockResponse: BaseResponse<FacturaTplAsociadaResponse> = {
        codigo: '200',
        mensaje: 'Success',
        datos: { asociadas: [] } as any,
        path: '/api/asociadas',
        timestamp: new Date().toISOString()
      };

      service.getFacturasTplAsociadas(idExpedicion, page, size).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_FACTURAS_TPL_ASOCIADAS.replace(IDEXPEDICION, idExpedicion.toString())}`;
      const req = httpMock.expectOne((request) => request.url === expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('deleteFacturaTpl', () => {
    it('should send DELETE request', () => {
      const payload: FacturasTplEliminarRequest[] = [{ id: 1 }] as any;
      
      const mockResponse: BaseResponse<FacturaTplAsociadaResponse> = {
        codigo: '200',
        mensaje: 'Success',
        datos: { eliminadas: [] } as any,
        path: '/api/eliminar',
        timestamp: new Date().toISOString()
      };

      service.deleteFacturaTpl(payload).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${ENVIRONMENT.API_HOST}/api/${API_DELETE_FACTURAS_TPL_ELIMINAR}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('getFacturaTplTotalUnida', () => {
    it('should send GET request with parameters', () => {
      const idExpedicion = 12345;
      
      const mockResponse: BaseResponse<FacturaTotalUnidadResponse> = {
        codigo: '200',
        mensaje: 'Success',
        datos: { total: 100 } as any,
        path: '/api/total',
        timestamp: new Date().toISOString()
      };

      service.getFacturaTplTotalUnida(idExpedicion).subscribe((response: BaseResponse<FacturaTotalUnidadResponse>) => {
        expect(response).toEqual(mockResponse);
      });

      const expectedUrl = `${ENVIRONMENT.API_HOST}/api/${API_GET_FACTURAS_TPL_TOTAL_UNIDAD.replace(IDEXPEDICION, idExpedicion.toString())}`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});