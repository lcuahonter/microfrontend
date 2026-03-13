import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CambioModalidadService } from './cambio-modalidad.service';
import { CambioModalidadStore } from '../estados/tramite80208.store';
import { CambioDeModalidadForm, CambioModalidadResponse, ServiciosState } from '../modelos/cambio-de-modalidad.model';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';

describe('CambioModalidadService', () => {
  let service: CambioModalidadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CambioModalidadService],
    });

    service = TestBed.inject(CambioModalidadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch simulated data for cambio-de-modalidad', () => {
    const mockData = {
      seleccionaLaModalidad: 'Modalidad A',
      folio: 123,
      ano: 2023,
      seleccionaModalidad: 'Modalidad B',
      cambioModalidad: 'Cambio A',
      serviciosImmx: 'Servicio X',
      rfcEmpresa: 'RFC123',
      numeroPrograma: '12345',
      tiempoPrograma: '12 meses',
      datos: [],
      ServiciosDatos: [],
    };

    service.getDatosSimulados().subscribe((data) => {
      expect(data).toEqual(mockData);
      expect(data.seleccionaLaModalidad).toBe('Modalidad A');
      expect(data.folio).toBe(123);
      expect(data.ano).toBe(2023);
    });

    const req = httpMock.expectOne('/assets/json/80208/cambio-de-modalidad.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});