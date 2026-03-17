import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';  // Update the path as needed
import { InfoRegistro } from '../modelos/subfabricante.model';
import { SubfabricanteService } from './servicios-subfabricante.service';

describe('SubfabricanteService', () => {
  let service: SubfabricanteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Use HttpClientTestingModule for mocking HTTP requests
      providers: [SubfabricanteService],
    });
    service = TestBed.inject(SubfabricanteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch datos correctly', () => {
    const mockData: InfoRegistro = {
      modalidad: 'Empresa de comercio exterior con programa IMMEX',
      folio: 'VUCEM-2024-001234',
      ano: 2024
    };

    service.getDatos().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('assets/json/80207/submanufacturer-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData); // Mock the response
  });

  afterEach(() => {
    // Ensure that no outstanding HTTP requests are pending
    httpMock.verify();
  });
});
