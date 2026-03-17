import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MedioDeTransporteService } from './medio-de-transporte';
import { HttpClient } from '@angular/common/http';

describe('MedioDeTransporteService', () => {
  let service: MedioDeTransporteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MedioDeTransporteService]
    });
    service = TestBed.inject(MedioDeTransporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDatos should GET medio-de-transporte-tabla.json', () => {
    const mockResponse = [{ id: 1, nombre: 'Camión' }, { id: 2, nombre: 'Barco' }];
    service.getDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/medio-de-transporte-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});