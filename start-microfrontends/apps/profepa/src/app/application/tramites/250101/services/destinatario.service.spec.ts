import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DestinatarioService } from './destinatario.service';

describe('DestinatarioService', () => {
  let service: DestinatarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DestinatarioService]
    });
    service = TestBed.inject(DestinatarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener el encabezado de tabla de destinatario', () => {
    const mockData = { columns: ['Col1', 'Col2'] };
    service.getDestinatarioEncabezadoDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/datos-destinatario.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener el encabezado de tabla de aduanal', () => {
    const mockData = { columns: ['ColA', 'ColB'] };
    service.getAduanalEncabezadoDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/datos-agente-aduanal.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener los datos de país', () => {
    const mockData = [{ id: 1, descripcion: 'Pais1' }];
    service.getPaisData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/pais.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener los datos de estado', () => {
    const mockData = [{ id: 2, descripcion: 'Estado1' }];
    service.getEstadoData().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});