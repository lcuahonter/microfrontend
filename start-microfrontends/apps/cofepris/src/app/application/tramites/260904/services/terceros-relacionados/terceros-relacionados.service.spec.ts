import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TercerosRelacionadosService } from './terceros-relacionados.service';

describe('TercerosRelacionadosService', () => {
  let service: TercerosRelacionadosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TercerosRelacionadosService],
    });
    service = TestBed.inject(TercerosRelacionadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerInformaciónDeTablaDeFabricantes', () => {
    it('should fetch manufacturer table data successfully', () => {
      const mockData = [{ id: 1, name: 'Fabricante 1' }];

      service.obtenerInformacionDeTablaDeFabricantes().subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(service.dataTableLink);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle errors and return an empty array', () => {
      service.obtenerInformacionDeTablaDeFabricantes().subscribe((data) => {
        expect(data).toEqual([]);
      });

      const req = httpMock.expectOne(service.dataTableLink);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('obtenerInformaciónDeTablaDeDestinatraios', () => {
    it('should fetch recipient table data successfully', () => {
      const mockData = [{ id: 1, name: 'Destinatario 1' }];

      service.obtenerInformacionDeTablaDeDestinatraios().subscribe((data) => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(service.destinatarioTableLink);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should handle errors and return an empty array', () => {
      service.obtenerInformacionDeTablaDeDestinatraios().subscribe((data) => {
        expect(data).toEqual([]);
      });

      const req = httpMock.expectOne(service.destinatarioTableLink);
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));
    });
  });
});