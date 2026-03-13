import { TestBed } from '@angular/core/testing';
import { AvisoDestruccionService } from './aviso-destruccion.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite32506Store } from '../estados/tramite32506.store';
import {
  AvisoTablaDatos,
  CatalogoLista,
  ConsultaDatos,
  DatosSolicitante,
  DesperdicioTablaDatos,
  PedimentoTablaDatos,
  ProcesoTablaDatos,
  RespuestaConsulta,
} from '../models/aviso-destruccion.model';

describe('AvisoDestruccionService', () => {
  let service: AvisoDestruccionService;
  let httpClientSpy: jest.Mocked<HttpClient>;
  let storeSpy: jest.Mocked<Tramite32506Store>;

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    } as any;

    storeSpy = {
      setAvisoFormularioAdace: jest.fn(),
      setAvisoFormularioCalle: jest.fn(),
      setAvisoFormularioCodigoPostal: jest.fn(),
      setAvisoFormularioColonia: jest.fn(),
      setAvisoFormularioDelegacionMunicipio: jest.fn(),
      setAvisoFormularioEntidadFederativa: jest.fn(),
      setAvisoFormularioFechaTranslado: jest.fn(),
      setAvisoFormularioJustificacion: jest.fn(),
      setAvisoFormularioNombreComercial: jest.fn(),
      setAvisoFormularioNumeroExterior: jest.fn(),
      setAvisoFormularioNumeroInterior: jest.fn(),
      setAvisoFormularioTipoAviso: jest.fn(),
      setAvisoFormularioTipoCarga: jest.fn(),
      setAvisoFormularioValorAnioProgramaImmex: jest.fn(),
      setAvisoFormularioValorProgramaImmex: jest.fn(),
      setCantidadDesp: jest.fn(),
      setCantidadPedimento: jest.fn(),
      setCircunstanciaHechos: jest.fn(),
      setClaveAduanaPedimento: jest.fn(),
      setClaveFraccionArancelariaPedimento: jest.fn(),
      setClaveUnidadMedidaDesp: jest.fn(),
      setClaveUnidadMedidaPedimento: jest.fn(),
      setDatosSolicitante: jest.fn(),
      setDescripcionDesperdicio: jest.fn(),
      setDescripcionMercancia: jest.fn(),
      setDescripcionProcesoDestruccion: jest.fn(),
      setDomicilioFormularioCalle: jest.fn(),
      setDomicilioFormularioCodigoPostal: jest.fn(),
      setDomicilioFormularioColonia: jest.fn(),
      setDomicilioFormularioDelegacionMunicipio: jest.fn(),
      setDomicilioFormularioEntidadFederativa: jest.fn(),
      setDomicilioFormularioNombreComercial: jest.fn(),
      setDomicilioFormularioNumeroExterior: jest.fn(),
      setDomicilioFormularioNumeroInterior: jest.fn(),
      setDomicilioFormularioRfc: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AvisoDestruccionService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Tramite32506Store, useValue: storeSpy },
      ],
    });
    service = TestBed.inject(AvisoDestruccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('obtenerDatosSolicitante should call http.get with correct URL', (done) => {
    const mockData: DatosSolicitante = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerDatosSolicitante().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/datosSolicitante.json'
      );
      done();
    });
  });

  it('obtenerPedimentoTabla should call http.get with correct URL', (done) => {
    const mockData: PedimentoTablaDatos = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerPedimentoTabla().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/pedimento-tabla.json'
      );
      done();
    });
  });

  it('obtenerProcesoTabla should call http.get with correct URL', (done) => {
    const mockData: ProcesoTablaDatos = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerProcesoTabla().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/proceso-tabla.json'
      );
      done();
    });
  });

  it('obtenerDesperdicioTabla should call http.get with correct URL', (done) => {
    const mockData: DesperdicioTablaDatos = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerDesperdicioTabla().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/desperdicio-tabla.json'
      );
      done();
    });
  });

  it('obtenerAvisoTabla should call http.get with correct URL', (done) => {
    const mockData: AvisoTablaDatos = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerAvisoTabla().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/aviso-tabla.json'
      );
      done();
    });
  });

  it('obtenerColonias should call http.get with correct URL', (done) => {
    const mockData: CatalogoLista = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerColonias().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/entidad-federativa.json'
      );
      done();
    });
  });

  it('obtenerMunicipio should call http.get with correct URL', (done) => {
    const mockData: CatalogoLista = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerMunicipio().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/entidad-federativa.json'
      );
      done();
    });
  });

  it('obtenerFederativa should call http.get with correct URL', (done) => {
    const mockData: CatalogoLista = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerFederativa().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/entidad-federativa.json'
      );
      done();
    });
  });

  it('obtenerUnidadMedida should call http.get with correct URL', (done) => {
    const mockData: CatalogoLista = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerUnidadMedida().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/entidad-federativa.json'
      );
      done();
    });
  });

  it('obtenerFraccionArancelaria should call http.get with correct URL', (done) => {
    const mockData: CatalogoLista = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.obtenerFraccionArancelaria().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/entidad-federativa.json'
      );
      done();
    });
  });

  it('guardarDatosFormulario should call http.get with correct URL', (done) => {
    const mockData: RespuestaConsulta = {} as any;
    httpClientSpy.get.mockReturnValue(of(mockData));
    service.guardarDatosFormulario().subscribe((data) => {
      expect(data).toBe(mockData);
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        'assets/json/32506/tramite-32506-aviso.json'
      );
      done();
    });
  });

  describe('actualizarEstadoFormulario', () => {
    it('should update all store properties when valid data is provided', () => {
      const mockResponse = {
        avisoFormulario: {
          adace: 'ADACE-001',
          calle: 'Test Street',
          codigoPostal: '12345',
          claveColonia: 'COL-001',
          claveDelegacionMunicipio: 'DEL-001',
          claveEntidadFederativa: 'ENT-001',
          fechaTranslado: '2024-01-01',
          justificacion: 'Test justification',
          nombreComercial: 'Test Company',
          numeroExterior: '123',
          numeroInterior: '456',
          tipoAviso: 'TIPO-001',
          tipoCarga: 'CARGA-001',
          valorAnioProgramaImmex: '2024',
          valorProgramaImmex: 'IMMEX-001'
        },
        desperdicioFormulario: {
          cantidadDesp: '100',
          circunstanciaHechos: 'Test circumstances',
          claveUnidadMedidaDesp: 'KG',
          descripcionDesperdicio: 'Test desperdicio',
          descripcionMercancia: 'Test mercancia'
        },
        pedimentoFormulario: {
          cantidadPedimento: '200',
          claveAduanaPedimento: 'ADU-001',
          claveFraccionArancelariaPedimento: 'FRAC-001',
          claveUnidadMedidaPedimento: 'KG'
        },
        procesoFormulario: {
          descripcionProcesoDestruccion: 'Test destruction process'
        },
        domicilioFormulario: {
          calle: 'Domicilio Street',
          codigoPostal: '67890',
          claveColonia: 'COL-002',
          claveDelegacionMunicipio: 'DEL-002',
          claveEntidadFederativa: 'ENT-002',
          nombreComercial: 'Domicilio Company',
          numeroExterior: '789',
          numeroInterior: '012',
          rfc: 'RFC123456789'
        },
        datosSolicitante: {
          rfc: 'SOL123456789',
          denominacion: 'Test Solicitante',
          actividadEconomica: 'Test Activity',
          correoElectronico: 'test@example.com'
        }
      } as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).toHaveBeenCalledWith('ADACE-001');
      expect(storeSpy.setAvisoFormularioCalle).toHaveBeenCalledWith('Test Street');
      expect(storeSpy.setAvisoFormularioCodigoPostal).toHaveBeenCalledWith('12345');
      expect(storeSpy.setAvisoFormularioColonia).toHaveBeenCalledWith('COL-001');
      expect(storeSpy.setAvisoFormularioDelegacionMunicipio).toHaveBeenCalledWith('DEL-001');
      expect(storeSpy.setAvisoFormularioEntidadFederativa).toHaveBeenCalledWith('ENT-001');
      expect(storeSpy.setAvisoFormularioFechaTranslado).toHaveBeenCalledWith('2024-01-01');
      expect(storeSpy.setAvisoFormularioJustificacion).toHaveBeenCalledWith('Test justification');
      expect(storeSpy.setAvisoFormularioNombreComercial).toHaveBeenCalledWith('Test Company');
      expect(storeSpy.setAvisoFormularioNumeroExterior).toHaveBeenCalledWith('123');
      expect(storeSpy.setAvisoFormularioNumeroInterior).toHaveBeenCalledWith('456');
      expect(storeSpy.setAvisoFormularioTipoAviso).toHaveBeenCalledWith('TIPO-001');
      expect(storeSpy.setAvisoFormularioTipoCarga).toHaveBeenCalledWith('CARGA-001');
      expect(storeSpy.setAvisoFormularioValorAnioProgramaImmex).toHaveBeenCalledWith('2024');
      expect(storeSpy.setAvisoFormularioValorProgramaImmex).toHaveBeenCalledWith('IMMEX-001');

      expect(storeSpy.setCantidadDesp).toHaveBeenCalledWith('100');
      expect(storeSpy.setCircunstanciaHechos).toHaveBeenCalledWith('Test circumstances');
      expect(storeSpy.setClaveUnidadMedidaDesp).toHaveBeenCalledWith('KG');
      expect(storeSpy.setDescripcionDesperdicio).toHaveBeenCalledWith('Test desperdicio');
      expect(storeSpy.setDescripcionMercancia).toHaveBeenCalledWith('Test mercancia');

      expect(storeSpy.setCantidadPedimento).toHaveBeenCalledWith('200');
      expect(storeSpy.setClaveAduanaPedimento).toHaveBeenCalledWith('ADU-001');
      expect(storeSpy.setClaveFraccionArancelariaPedimento).toHaveBeenCalledWith('FRAC-001');
      expect(storeSpy.setClaveUnidadMedidaPedimento).toHaveBeenCalledWith('KG');

      expect(storeSpy.setDescripcionProcesoDestruccion).toHaveBeenCalledWith('Test destruction process');

      expect(storeSpy.setDomicilioFormularioCalle).toHaveBeenCalledWith('Domicilio Street');
      expect(storeSpy.setDomicilioFormularioCodigoPostal).toHaveBeenCalledWith('67890');
      expect(storeSpy.setDomicilioFormularioColonia).toHaveBeenCalledWith('COL-002');
      expect(storeSpy.setDomicilioFormularioDelegacionMunicipio).toHaveBeenCalledWith('DEL-002');
      expect(storeSpy.setDomicilioFormularioEntidadFederativa).toHaveBeenCalledWith('ENT-002');
      expect(storeSpy.setDomicilioFormularioNombreComercial).toHaveBeenCalledWith('Domicilio Company');
      expect(storeSpy.setDomicilioFormularioNumeroExterior).toHaveBeenCalledWith('789');
      expect(storeSpy.setDomicilioFormularioNumeroInterior).toHaveBeenCalledWith('012');
      expect(storeSpy.setDomicilioFormularioRfc).toHaveBeenCalledWith('RFC123456789');

      expect(storeSpy.setDatosSolicitante).toHaveBeenCalledWith(mockResponse.datosSolicitante);
    });

    it('should return early when avisoFormulario is missing', () => {
      const mockResponse = {
        avisoFormulario: null,
        desperdicioFormulario: { cantidadDesp: '100' },
        pedimentoFormulario: { cantidadPedimento: '200' },
        procesoFormulario: { descripcionProcesoDestruccion: 'test' },
        domicilioFormulario: { calle: 'test' },
        datosSolicitante: { rfc: 'test' }
      } as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadDesp).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadPedimento).not.toHaveBeenCalled();
      expect(storeSpy.setDescripcionProcesoDestruccion).not.toHaveBeenCalled();
      expect(storeSpy.setDomicilioFormularioCalle).not.toHaveBeenCalled();
      expect(storeSpy.setDatosSolicitante).not.toHaveBeenCalled();
    });

    it('should return early when desperdicioFormulario is missing', () => {
      const mockResponse = {
        avisoFormulario: { adace: 'test' },
        desperdicioFormulario: null,
        pedimentoFormulario: { cantidadPedimento: '200' },
        procesoFormulario: { descripcionProcesoDestruccion: 'test' },
        domicilioFormulario: { calle: 'test' },
        datosSolicitante: { rfc: 'test' }
      } as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadDesp).not.toHaveBeenCalled();
    });

    it('should return early when pedimentoFormulario is missing', () => {
      const mockResponse = {
        avisoFormulario: { adace: 'test' },
        desperdicioFormulario: { cantidadDesp: '100' },
        pedimentoFormulario: null,
        procesoFormulario: { descripcionProcesoDestruccion: 'test' },
        domicilioFormulario: { calle: 'test' },
        datosSolicitante: { rfc: 'test' }
      } as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadPedimento).not.toHaveBeenCalled();
    });

    it('should return early when procesoFormulario is missing', () => {
      const mockResponse = {
        avisoFormulario: { adace: 'test' },
        desperdicioFormulario: { cantidadDesp: '100' },
        pedimentoFormulario: { cantidadPedimento: '200' },
        procesoFormulario: null,
        domicilioFormulario: { calle: 'test' },
        datosSolicitante: { rfc: 'test' }
      } as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setDescripcionProcesoDestruccion).not.toHaveBeenCalled();
    });

    it('should return early when domicilioFormulario is missing', () => {
      const mockResponse = {
        avisoFormulario: { adace: 'test' },
        desperdicioFormulario: { cantidadDesp: '100' },
        pedimentoFormulario: { cantidadPedimento: '200' },
        procesoFormulario: { descripcionProcesoDestruccion: 'test' },
        domicilioFormulario: null,
        datosSolicitante: { rfc: 'test' }
      } as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setDomicilioFormularioCalle).not.toHaveBeenCalled();
    });

    it('should return early when response is null', () => {
      service.actualizarEstadoFormulario(null as any);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadDesp).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadPedimento).not.toHaveBeenCalled();
      expect(storeSpy.setDescripcionProcesoDestruccion).not.toHaveBeenCalled();
      expect(storeSpy.setDomicilioFormularioCalle).not.toHaveBeenCalled();
      expect(storeSpy.setDatosSolicitante).not.toHaveBeenCalled();
    });

    it('should return early when response is undefined', () => {
      service.actualizarEstadoFormulario(undefined as any);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadDesp).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadPedimento).not.toHaveBeenCalled();
      expect(storeSpy.setDescripcionProcesoDestruccion).not.toHaveBeenCalled();
      expect(storeSpy.setDomicilioFormularioCalle).not.toHaveBeenCalled();
      expect(storeSpy.setDatosSolicitante).not.toHaveBeenCalled();
    });

    it('should handle empty response object gracefully', () => {
      const mockResponse = {} as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadDesp).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadPedimento).not.toHaveBeenCalled();
      expect(storeSpy.setDescripcionProcesoDestruccion).not.toHaveBeenCalled();
      expect(storeSpy.setDomicilioFormularioCalle).not.toHaveBeenCalled();
      expect(storeSpy.setDatosSolicitante).not.toHaveBeenCalled();
    });

    it('should handle partial data gracefully when some sub-objects are undefined', () => {
      const mockResponse = {
        avisoFormulario: undefined,
        desperdicioFormulario: undefined,
        pedimentoFormulario: undefined,
        procesoFormulario: undefined,
        domicilioFormulario: undefined,
        datosSolicitante: undefined
      } as any;

      service.actualizarEstadoFormulario(mockResponse);

      expect(storeSpy.setAvisoFormularioAdace).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadDesp).not.toHaveBeenCalled();
      expect(storeSpy.setCantidadPedimento).not.toHaveBeenCalled();
      expect(storeSpy.setDescripcionProcesoDestruccion).not.toHaveBeenCalled();
      expect(storeSpy.setDomicilioFormularioCalle).not.toHaveBeenCalled();
      expect(storeSpy.setDatosSolicitante).not.toHaveBeenCalled();
    });
  });

});