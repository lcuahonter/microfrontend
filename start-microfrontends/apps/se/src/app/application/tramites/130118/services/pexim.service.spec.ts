import { TestBed } from '@angular/core/testing';
import { PeximService } from './pexim.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Tramite130118Store } from '../estados/tramites/tramite130118.store';
import { Solicitud130118State } from '../estados/tramites/tramite130118.store';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';

describe('PeximService', () => {
  let service: PeximService;
  let httpMock: HttpTestingController;
  let storeMock: any;

  beforeEach(() => {
    storeMock = {
      setRegimenMercancia: jest.fn(),
      setClasifiRegimen: jest.fn(),
      setValueTA: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setNico: jest.fn(),
      setUnidadMedidaTarifaria: jest.fn(),
      setCantidadTarifaria: jest.fn(),
      setValorFacturaUSD: jest.fn(),
      setPrecioUnitarioUSD: jest.fn(),
      setPaisOrigen: jest.fn(),
      setPaisDestino: jest.fn(),
      setLote: jest.fn(),
      setFechaSalida: jest.fn(),
      setObservaciones: jest.fn(),
      setObservacionMerc: jest.fn(),
      setTipoPersona: jest.fn(),
      setNombre: jest.fn(),
      setApellidoPaterno: jest.fn(),
      setApellidoMaterno: jest.fn(),
      setRazonSocial: jest.fn(),
      setDomicilio: jest.fn(),
      setEstado: jest.fn(),
      setRepresentacionFederal: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Tramite130118Store, useValue: storeMock }
      ]
    });
    service = TestBed.inject(PeximService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update store in actualizarEstadoFormulario', () => {
    const datos: Solicitud130118State = {
      idSolicitud: 123,
      regimenMercancia: 'reg',
      clasifiRegimen: 'clas',
      valueTA: 'val',
      fraccionArancelaria: 'frac',
      nico: 'nico',
      unidadMedidaTarifaria: 'uni',
      cantidadTarifaria: 1,
      valorFacturaUSD: 1,
      precioUnitarioUSD: 1,
      paisOrigen: 'mx',
      paisDestino: 'us',
      lote: 'lote',
      fechaSalida: '2024-01-01',
      observaciones: 'obs',
      observacionMerc: 'obsmerc',
      tipoPersona: 'fisica',
      nombre: 'nombre',
      apellidoPaterno: 'ap',
      apellidoMaterno: 'am',
      razonSocial: 'razon',
      domicilio: 'dom',
      estado: 'cdmx',
      representacionFederal: 'rf'
    };
    service.actualizarEstadoFormulario(datos);
    expect(storeMock.setRegimenMercancia).toHaveBeenCalledWith('reg');
    expect(storeMock.setClasifiRegimen).toHaveBeenCalledWith('clas');
    expect(storeMock.setValueTA).toHaveBeenCalledWith('val');
    expect(storeMock.setFraccionArancelaria).toHaveBeenCalledWith('frac');
    expect(storeMock.setNico).toHaveBeenCalledWith('nico');
    expect(storeMock.setUnidadMedidaTarifaria).toHaveBeenCalledWith('uni');
    expect(storeMock.setCantidadTarifaria).toHaveBeenCalledWith(1);
    expect(storeMock.setValorFacturaUSD).toHaveBeenCalledWith(1);
    expect(storeMock.setPrecioUnitarioUSD).toHaveBeenCalledWith(1);
    expect(storeMock.setPaisOrigen).toHaveBeenCalledWith('mx');
    expect(storeMock.setPaisDestino).toHaveBeenCalledWith('us');
    expect(storeMock.setLote).toHaveBeenCalledWith('lote');
    expect(storeMock.setFechaSalida).toHaveBeenCalledWith('2024-01-01');
    expect(storeMock.setObservaciones).toHaveBeenCalledWith('obs');
    expect(storeMock.setObservacionMerc).toHaveBeenCalledWith('obsmerc');
    expect(storeMock.setTipoPersona).toHaveBeenCalledWith('fisica');
    expect(storeMock.setNombre).toHaveBeenCalledWith('nombre');
    expect(storeMock.setApellidoPaterno).toHaveBeenCalledWith('ap');
    expect(storeMock.setApellidoMaterno).toHaveBeenCalledWith('am');
    expect(storeMock.setRazonSocial).toHaveBeenCalledWith('razon');
    expect(storeMock.setDomicilio).toHaveBeenCalledWith('dom');
    expect(storeMock.setEstado).toHaveBeenCalledWith('cdmx');
    expect(storeMock.setRepresentacionFederal).toHaveBeenCalledWith('rf');
  });

  it('should get registro toma muestras mercancias data', () => {
    const mockResponse = {} as Solicitud130118State;
    service.getRegistroTomaMuestrasMercanciasData().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/registro_toma_muestras_mercancias.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get regimen mercancia catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getRegimenMercancia('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/regimen-mercancia.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get clasifi regimen catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getClasifiRegimen('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/clasifi-regimen.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get fraccion arancelaria catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getFraccionArancelariaCatalogo('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/fraccion-arancelaria-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get nico catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getNicoCatalogo('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/nico-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get pais origen catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getPaisOrigenCatalogo('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/pais-origen-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get pais destino catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getPaisDestinoCatalogo('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/pais-destino-catalogo.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get estado catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getEstadoCatalogo('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/estado.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get molino catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getMolinoCatalogo('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/molino.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get unidad medida tarifaria catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getUnidadMedidaTarifariaCatalogo('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/unidad-medida-tarifaria.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get representacion federal catalog', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.getRepresentacionFederal('test').subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/representacion-federal.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get documentos seleccionados', () => {
    const mockResponse: RespuestaCatalogos = { code: 200, data: [], message: '' };
    service.obtenerDocumentosSeleccionados().subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/130118/documentos-seleccionados.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});