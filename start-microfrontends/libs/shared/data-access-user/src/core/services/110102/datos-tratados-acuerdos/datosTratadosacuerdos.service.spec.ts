import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatostratadosacuerdosService } from './datosTratadosacuerdos.service';
import { HttpCoreService } from '../../shared/http/http.service';

describe('DatostratadosacuerdosService', () => {
  let service: DatostratadosacuerdosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatostratadosacuerdosService, HttpCoreService]
    });
    service = TestBed.inject(DatostratadosacuerdosService);
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

    service.getData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('./assets/json/110102/datostratadosacuerdos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});