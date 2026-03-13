import { TestBed } from '@angular/core/testing';
import { CertificadoZoosanitarioServiceService } from './certificado-zoosanitario.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ZoosanitarioStore } from '../../estados/220201/zoosanitario.store';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';
import { of } from 'rxjs';

describe('CertificadoZoosanitarioServiceService', () => {
  let service: CertificadoZoosanitarioServiceService;
  let mockZoosanitarioStore: any;

  const MOCK_STORE_DATA = {
    datosDeLaSolicitud: { tipoMercancia: 'yes' },
    datosParaMovilizacionNacional: {},
    pagoDeDerechos: {},
    validarEnvio: {},
    tercerosRelacionados: [],
  };

  beforeEach(() => {
    mockZoosanitarioStore = {
      _select: jest.fn().mockReturnValue(of(MOCK_STORE_DATA)),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CertificadoZoosanitarioServiceService,
        { provide: ZoosanitarioStore, useValue: mockZoosanitarioStore },
        { provide: SeccionLibStore, useValue: {} },
      ],
    });

    service = TestBed.inject(CertificadoZoosanitarioServiceService);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe retornar todos los datos del formulario desde el store usando getAllDatosForma()', (done) => {
    service.getAllDatosForma().subscribe((data) => {
      expect(mockZoosanitarioStore._select).toHaveBeenCalled();
      expect(data).toEqual(MOCK_STORE_DATA);
      done();
    });
  });

  it('debe llamar a http.get con la URL correcta en obtenerRespuestaPorUrl', (done) => {
    const HTTP_CLIENT_SPY = { get: jest.fn() };
    const TEST_URL = 'testfile.json';
    const EXPECTED_URL = `../../../../../assets/json/220201/${TEST_URL}`;
    const EXPECTED_RESPONSE = { some: 'data' };

    (service as any).http = HTTP_CLIENT_SPY;
    HTTP_CLIENT_SPY.get.mockReturnValue(of(EXPECTED_RESPONSE));

    service.obtenerRespuestaPorUrl(TEST_URL).subscribe((resp) => {
      expect(HTTP_CLIENT_SPY.get).toHaveBeenCalledWith(EXPECTED_URL);
      expect(resp).toEqual(EXPECTED_RESPONSE);
      done();
    });
  });

  it('debe retornar todos los datos del formulario desde el store usando getFormData()', (done) => {
    service.getFormData().subscribe((data) => {
      expect(mockZoosanitarioStore._select).toHaveBeenCalled();
      expect(data).toEqual(MOCK_STORE_DATA);
      done();
    });
  });

  it('debe retornar validarEnvio desde el store usando getValidarEnvio()', (done) => {
    const VALIDAR_ENVIO_MOCK = { seccion1: true, seccion2: false };
    mockZoosanitarioStore._select.mockReturnValueOnce(of(VALIDAR_ENVIO_MOCK));

    service.getValidarEnvio().subscribe((data) => {
      expect(mockZoosanitarioStore._select).toHaveBeenCalledWith(expect.any(Function));
      expect(data).toEqual(VALIDAR_ENVIO_MOCK);
      done();
    });
  });

});
