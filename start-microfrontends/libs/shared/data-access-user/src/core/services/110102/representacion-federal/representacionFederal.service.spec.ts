import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RepresentacionfederalService } from './representacionFederal.service';
import { HttpCoreService } from '../../shared/http/http.service';

describe('RepresentacionfederalService', () => {
  let service: RepresentacionfederalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepresentacionfederalService, HttpCoreService]
    });
    service = TestBed.inject(RepresentacionfederalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch entidad federativa data from JSON file', () => {
    const mockData = { key: 'value' };

    service.getEntidadFederativa().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('./assets/json/110102/entidadfederativa.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch representacion federal data from JSON file', () => {
    const mockData = { key: 'value' };
    const entidadFederativa = 'some-entity';

    service.getRepresentacionfederal(entidadFederativa).subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('./assets/json/110102/representacionfederal.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});