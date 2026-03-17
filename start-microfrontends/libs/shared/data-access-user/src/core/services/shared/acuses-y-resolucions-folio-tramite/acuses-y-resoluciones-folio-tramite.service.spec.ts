import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AcuseYResolucionesFolioTramiteService } from './acuses-y-resoluciones-folio-tramite.service';
import { AcuseYResolucionesFolioTramite } from '../../../models/shared/acuse-y-resoluciones-folio-tramite.model';
import { AcuseYResolucionesFolioTramiteDetalles } from '../../../models/shared/acuse-y-resoluciones-foilio-tramite-detalles.model';

describe('AcuseYResolucionesFolioTramiteService', () => {
  let service: AcuseYResolucionesFolioTramiteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AcuseYResolucionesFolioTramiteService],
    });

    service = TestBed.inject(AcuseYResolucionesFolioTramiteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch acuses y resoluciones folio tramite', () => {
    const mockResponse: AcuseYResolucionesFolioTramite[] = [
      { folioTramite: '12345', tipoDeTramite: 'Test', dependencia: 'Dependencia 1', fechInicioTramite: '2025-04-01' },
    ];

    service.getAcuseYResolucionesFolioTramite().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('./assets/json/shared/acuses-y-resoluciones-folio-tramite.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should fetch acuses y resoluciones folio tramite detalles', () => {
    const mockResponse: AcuseYResolucionesFolioTramiteDetalles[] = [
      { detalleId: '1', descripcion: 'Detalle 1', fecha: '2025-04-01' },
    ];

    service.getAcuseYResolucionesFolioTramiteDetalles().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('./assets/json/shared/acuses-y-resoluciones-folio-tramite-detalles.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});