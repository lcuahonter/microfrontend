import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MediodetransporteService } from './medio-de-transporte.service';
import { Catalogo } from '@ng-mf/data-access-user';

describe('MediodetransporteService', () => {
  let service: MediodetransporteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MediodetransporteService],
    });

    service = TestBed.inject(MediodetransporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch medio de transporte data', () => {
    const mockResponse: Catalogo[] = [
      { id: 1, descripcion: 'Transporte A' },
      { id: 2, descripcion: 'Transporte B' },
    ];

    service.getMedioDeTransporte().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('./assets/json/220402/mediodetransporte.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});