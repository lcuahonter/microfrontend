import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DistinatarioService } from './distinatario.service';

// Import the Catalogo interface used by the service
import { Catalogo } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';

/**
 * Mock data for countries (paises).
 */
const mockPaises: Catalogo[] = [
  { id: 1, descripcion: 'Mexico' },
  { id: 2, descripcion: 'United States' }
];

/**
 * Mock data for states (estados).
 */
const mockEstados: Catalogo[] = [
  { id: 1, descripcion: 'Jalisco' },
  { id: 2, descripcion: 'Nuevo León' }
];

describe('DistinatarioService', () => {
  let service: DistinatarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Configure the test module with HttpClientTestingModule
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DistinatarioService],
    });

    // Inject service and HTTP testing controller
    service = TestBed.inject(DistinatarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that there are no outstanding HTTP requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch country data from the JSON file', () => {
    service.obtenerPaisData().subscribe((data: Catalogo[]) => {
      expect(data).toEqual(mockPaises);
    });

    const req = httpMock.expectOne('assets/json/250102/pais.json');
    expect(req.request.method).toBe('GET');

    // Respond with mock country data
    req.flush(mockPaises);
  });

  it('should fetch state data from the JSON file', () => {
    service.obtenerEstadoData().subscribe((data: Catalogo[]) => {
      expect(data).toEqual(mockEstados);
    });

    const req = httpMock.expectOne('assets/json/250102/estado.json');
    expect(req.request.method).toBe('GET');

    // Respond with mock state data
    req.flush(mockEstados);
  });
});
