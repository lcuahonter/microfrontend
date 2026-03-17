import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CertificadosOrigenService } from './certificado-origen.service';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Tramite110216Query } from '../../../estados/queries/tramite110216.query';
import { of } from 'rxjs';
import { Mercancia, HistoricoColumnas } from '../models/certificado-origen.model';

describe('CertificadosOrigenService - Jest', () => {
  let service: CertificadosOrigenService;
  let httpMock: HttpTestingController;
  let httpCoreSpy: jest.Mocked<HttpCoreService>;
  let tramiteQuerySpy: jest.Mocked<Tramite110216Query>;

  beforeEach(() => {
    const httpCore = { post: jest.fn() } as unknown as jest.Mocked<HttpCoreService>;
    const tramiteQuery = { allStoreData$: of({}) } as unknown as jest.Mocked<Tramite110216Query>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CertificadosOrigenService,
        { provide: HttpCoreService, useValue: httpCore },
        { provide: Tramite110216Query, useValue: tramiteQuery },
      ],
    });

    service = TestBed.inject(CertificadosOrigenService);
    httpMock = TestBed.inject(HttpTestingController);
    httpCoreSpy = TestBed.inject(HttpCoreService) as jest.Mocked<HttpCoreService>;
    tramiteQuerySpy = TestBed.inject(Tramite110216Query) as jest.Mocked<Tramite110216Query>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch productor por exportador', () => {
    const mockResponse = { datos: [{ nombre: 'Laura' }] };
    const rfc = 'AAA010101AAA';

    service.obtenerProductorPorExportador(rfc).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`https://example.com/productores/${rfc}`); // replace with actual URL
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call guardarDatosPost via httpCoreService', () => {
    const body = { test: 'data' };
    const response = { success: true };
    httpCoreSpy.post.mockReturnValue(of(response));

    service.guardarDatosPost(body).subscribe(res => {
      expect(res).toEqual(response);
      expect(httpCoreSpy.post).toHaveBeenCalledWith(expect.any(String), { body });
    });
  });

  it('should call agregarProductores via httpCoreService', () => {
    const body = { rfc_solicitante: 'AAA010101AAA' };
    const response = { success: true };
    httpCoreSpy.post.mockReturnValue(of(response));

    service.agregarProductores(body).subscribe(res => {
      expect(res).toEqual(response);
      expect(httpCoreSpy.post).toHaveBeenCalledWith(expect.any(String), { body });
    });
  });

  it('should return mapped buildProductoresPorExportador', () => {
    const data: HistoricoColumnas[] = [
      { id: 1, nombreProductor: 'Laura', numeroRegistroFiscal: 'RFC1', direccion: 'Dir1', correoElectronico: 'email1', telefono: '123', fax: '456' }
    ];

    const result = service.buildProductoresPorExportador(data);
    expect(result[0]).toEqual({
      nombreCompleto: 'Laura',
      rfc: 'RFC1',
      direccionCompleta: 'Dir1',
      correoElectronico: 'email1',
      telefono: '123',
      fax: '456'
    });
  });

  it('should return mapped buildMercanciasProductor', () => {
    const data = [
      { fraccionArancelaria: '123', cantidad: '10', unidadMedida: 'UM', valorMercancia: '100', fetchFactura: 'FA', numeroFactura: '001', complementoDescripcion: 'CD', rfcProductor1: 'RFC' }
    ];

    const result = service.buildMercanciasProductor(data as any) as Array<{ fraccionArancelaria: string; cantidadComercial: string }>;
    expect(result[0].fraccionArancelaria).toBe('123');
    expect(result[0].cantidadComercial).toBe('10');
  });

  it('should return empty array for buildCertificadoMercancia if input not array', () => {
    const result = service.buildCertificadoMercancia(null as any);
    expect(result).toEqual([]);
  });

  it('should return all state observable', (done) => {
    service.getAllState().subscribe(state => {
      expect(state).toEqual({});
      done();
    });
  });
});
