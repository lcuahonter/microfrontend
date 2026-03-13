import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MercanciaTableService } from './mercancia-table.service';

describe('MercanciaTableService', () => {
  let service: MercanciaTableService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercanciaTableService]
    });
    service = TestBed.inject(MercanciaTableService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get table data from JSON file', () => {
    const mockData = {
      mercancia: [
        { id: 1, nombre: 'Mercancía 1' },
        { id: 2, nombre: 'Mercancía 2' }
      ]
    };

    service.getTable().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/assets/json/103/mercancia-table.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle error when fetching table data', () => {
    service.getTable().subscribe(
      data => fail('should have failed with 404 error'),
      error => {
        expect(error.status).toBe(404);
      }
    );

    const req = httpMock.expectOne('/assets/json/103/mercancia-table.json');
    expect(req.request.method).toBe('GET');
    req.flush('Something went wrong', { status: 404, statusText: 'Not Found' });
  });
});
