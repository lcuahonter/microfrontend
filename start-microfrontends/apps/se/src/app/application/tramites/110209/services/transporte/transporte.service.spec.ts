import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransporteService } from './transporte.service';
import { HttpCoreService } from '@libs/shared/data-access-user/src';

describe('TransporteService', () => {
  let service: TransporteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransporteService, HttpCoreService]
    });

    service = TestBed.inject(TransporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch medio de transporte from JSON file', () => {
    const MOCK_MEDIO_DE_TRANSPORTE = [
      { id: '1', nombre: 'Aéreo' },
      { id: '2', nombre: 'Marítimo' }
    ];

    service.getMedioDeTransporte().subscribe((medioDeTransporte) => {
      expect(medioDeTransporte).toEqual(MOCK_MEDIO_DE_TRANSPORTE);
    });

    const REQ = httpMock.expectOne('assets/json/110209/transporte.json');
    expect(REQ.request.method).toBe('GET');
    REQ.flush(MOCK_MEDIO_DE_TRANSPORTE);
  });
});