import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PagoDeDerechosEntradaService } from './pago-de-derechos-entrada.service';

describe('PagoDeDerechosEntradaService', () => {
  let service: PagoDeDerechosEntradaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PagoDeDerechosEntradaService]
    });
    service = TestBed.inject(PagoDeDerechosEntradaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener los datos del pago de derechos', () => {
    const mockRespuesta = [{ id: 1, nombre: 'Banco' }];
    service.getData().subscribe(data => {
      expect(data).toEqual(mockRespuesta);
    });
    const req = httpMock.expectOne('assets/json/260402/banco.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockRespuesta);
  });
});