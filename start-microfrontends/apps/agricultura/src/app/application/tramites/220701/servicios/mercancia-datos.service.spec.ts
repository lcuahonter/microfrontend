import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MercanciaDatosService } from './mercancia-datos.service';

describe('MercanciaDatosService', () => {
  let service: MercanciaDatosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercanciaDatosService]
    });
    service = TestBed.inject(MercanciaDatosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDatos should GET mercancia.json', () => {
    const mockResponse = [{ id: 1, nombre: 'Producto A' }, { id: 2, nombre: 'Producto B' }];
    service.getDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('/assets/json/220701/mercancia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});