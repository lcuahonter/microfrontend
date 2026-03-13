import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MercanciaasociadaService } from './mercanciaAsociada.service';
import { HttpCoreService } from '../../shared/http/http.service';

describe('MercanciaasociadaService', () => {
  let service: MercanciaasociadaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercanciaasociadaService, HttpCoreService]
    });
    service = TestBed.inject(MercanciaasociadaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data from JSON file', () => {
    const mockData = { key: 'value' };

    service.getMercanciaAsociada().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('./assets/json/110102/mercanciaasociada.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});