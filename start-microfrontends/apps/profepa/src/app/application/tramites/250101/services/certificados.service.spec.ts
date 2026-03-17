import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CertificadosService } from './certificados.service';

describe('CertificadosService', () => {
  let service: CertificadosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CertificadosService]
    });
    service = TestBed.inject(CertificadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener el encabezado de la tabla de fitosanitarios', () => {
    const mockData = { columns: ['Fito1', 'Fito2'] };
    service.getFitosanitoriosEncabezadoDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/certificados-fitosanitorios.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener los permisos certificados de la tabla', () => {
    const mockData = { columns: ['Permiso1', 'Permiso2'] };
    service.getPermisoCertificadosDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/permisos-certificados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener los certificados de la tabla', () => {
    const mockData = { columns: ['Cert1', 'Cert2'] };
    service.getCertificadosDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/certificados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener la fila de certificados de la tabla', () => {
    const mockData = { data: { row: 1 } };
    service.getCertificadosFilaDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/certificado-row.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener la fila de certificados fito de la tabla', () => {
    const mockData = { data: { fito: 2 } };
    service.getCertificadosFitoFilaDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/certificados-fito-row.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('debería obtener la fila de permisos certificados de la tabla', () => {
    const mockData = { data: { permiso: 3 } };
    service.getPermisoCertificadosFilaDeTabla().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne('assets/json/250101/permisos-certificados-row.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
