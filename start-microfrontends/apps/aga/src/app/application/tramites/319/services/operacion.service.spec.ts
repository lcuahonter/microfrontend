import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OperacionService } from './operacion.service';
import { Tramite319Store } from '../estados/tramite319Store.store';

describe('OperacionService', () => {
  let service: OperacionService;
  let httpMock: HttpTestingController;
  let tramite319StoreMock: jest.Mocked<Tramite319Store>;
  const URL = '../../../../../assets/json/319/';

  beforeEach(() => {
    tramite319StoreMock = {
      actualizarOperacion: jest.fn(),
      actualizarTodo: jest.fn()
    } as unknown as jest.Mocked<Tramite319Store>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OperacionService,
        { provide: Tramite319Store, useValue: tramite319StoreMock }
      ]
    });

    service = TestBed.inject(OperacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerSelectorList should fetch and map catalog data', (done) => {
    const fileName = 'catalogos.json';
    const mockResponse = { data: [{ id: 1, nombre: 'Periodo1' }] };

    service.obtenerSelectorList(fileName).subscribe(data => {
      expect(data).toEqual(mockResponse.data);
      done();
    });

    const req = httpMock.expectOne(URL + fileName);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

});