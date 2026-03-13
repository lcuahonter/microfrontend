import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MediodetransporteService } from './medio-de-transporte.service';
import { Catalogo } from '@ng-mf/data-access-user';

describe('MediodetransporteService', () => {
  let service: MediodetransporteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Provide a mock HTTP client
      providers: [MediodetransporteService],
    });

    service = TestBed.inject(MediodetransporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});