import { TestBed } from '@angular/core/testing';
import { ValidarInicalmenteService } from './validar-inicalmente.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ValidarInicalmenteService', () => {
  let service: ValidarInicalmenteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValidarInicalmenteService]
    });
    service = TestBed.inject(ValidarInicalmenteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener la lista de estados', () => {
    const mockResponse = { data: [{ id: 1, nombre: 'Estado1' }] };
    service.obtenerEstadoList().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/110208/seleccion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe obtener los datos del formulario', () => {
    const mockResponse = { data: [{ id: 1, nombre: 'FormDato1' }] };
    service.obtenerFormDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/110208/mercancia-datos.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe obtener los datos de la tabla', () => {
    const mockResponse = { data: [{ id: 1, nombre: 'TablaDato1' }] };
    service.obtenerTablaDatos().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/110208/mercancias-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe obtener los datos de la tabla certificado', () => {
    const mockResponse = { data: [{ id: 1, nombre: 'CertificadoDato1' }] };
    service.obtenerTablaDatosCertificado().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/110208/certificado-tabla.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe obtener la lista de países', () => {
  const mockResponse = { data: [{ id: 1, nombre: 'País1' }] };
  service.obtenerPaisList().subscribe(res => {
    expect(res).toEqual(mockResponse);
  });
  const req = httpMock.expectOne('assets/json/110208/pais.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

it('debe obtener la lista de UMC', () => {
  const mockResponse = { data: [{ id: 1, nombre: 'UMC1' }] };
  service.obtenerUMCList().subscribe(res => {
    expect(res).toEqual(mockResponse);
  });
  const req = httpMock.expectOne('assets/json/110208/umc.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

it('debe obtener la lista de tipos de factura', () => {
  const mockResponse = { data: [{ id: 1, nombre: 'TipoFactura1' }] };
  service.obtenerTipoDeFacturaList().subscribe(res => {
    expect(res).toEqual(mockResponse);
  });
  const req = httpMock.expectOne('assets/json/110208/tipo-de-factura.json');
  expect(req.request.method).toBe('GET');
  req.flush(mockResponse);
});

});