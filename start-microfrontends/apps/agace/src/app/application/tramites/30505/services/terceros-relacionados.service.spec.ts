import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TercerosRelacionadosService } from './terceros-relacionados.service';
import { Solicitud30505Store } from '../../../estados/tramites/tramites30505.store';

describe('TercerosRelacionadosService', () => {
  let service: TercerosRelacionadosService;
  let httpMock: HttpTestingController;
  let tramiteStoreMock: any;

  beforeEach(() => {
    tramiteStoreMock = {
      setNumeroEstablecimiento: jest.fn(),
      setDescClobGenerica: jest.fn(),
      setActividadProductiva: jest.fn(),
      setFechaInicioVigencia: jest.fn(),
      setFechaFinVigencia: jest.fn(),
      setCheckboxDatos: jest.fn(),
      setFolioAcuse: jest.fn(),
      setTipoSolicitudPexim: jest.fn(),
      setCapacidadAlmacenamiento: jest.fn(),
      setTipoCaat: jest.fn(),
      setTipoProgFomExp: jest.fn(),
      setTipoTransito: jest.fn(),
      setMedioTransporte: jest.fn(),
      setNombreBanco: jest.fn(),
      setNomOficialAutorizado: jest.fn(),
      setObservaciones: jest.fn(),
      setEmpresaControladora: jest.fn(),
      setDescripcionLugarEmbarque: jest.fn(),
      updateFusionDatos: jest.fn(),
      updateAgenteDatos: jest.fn(),
      setAvisoDatos: jest.fn(),
      setAviso: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Solicitud30505Store, useValue: tramiteStoreMock }
      ]
    });

    service = TestBed.inject(TercerosRelacionadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAvisoDatos and return Solicitud30505State', () => {
    const mockResponse = { numeroEstablecimiento: '1' };
    service.getAvisoDatos().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/30505/aviso-modificacion.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call http.get with correct URL for obtenerDatos', () => {
    const mockResponse = { foo: 'bar' };
    service.obtenerDatos().subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne('assets/json/30505/aviso.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call http.get with correct URL and params for obtenerDatosPersona', () => {
    const mockResponse = { baz: 'qux' };
    const rfc = 'ABC123';
    service.obtenerDatosPersona(rfc).subscribe(resp => {
      expect(resp).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(
      req => req.url === 'assets/json/30505/fusion.json' && req.params.get('rfc') === rfc
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('rfc')).toBe(rfc);
    req.flush(mockResponse);
  });

  it('should call all store methods with correct values in setDatosFormulario', () => {
    const datos: any = {
      numeroEstablecimiento: '1',
      descClobGenerica: 'desc',
      actividadProductiva: 'prod',
      fechaInicioVigencia: '2023-01-01',
      fechaFinVigencia: '2023-12-31',
      selectedCheckbox: ['a', 'b'],
      folioAcuse: 'FOLIO',
      tipoSolicitudPexim: 'PEXIM',
      capacidadAlmacenamiento: '100',
      tipoCaat: 'CAAT',
      tipoProgFomExp: 'PROG',
      tipoTransito: 'TRANS',
      medioTransporte: 'CAMION',
      nombreBanco: 'BANCO',
      nomOficialAutorizado: 'OFICIAL',
      observaciones: 'OBS',
      empresaControladora: 'EMPRESA',
      descripcionLugarEmbarque: 'LUGAR',
      fusionEscisionData: [{ id: 1 }],
      agenteDatos: { agente: 1 },
      avisoDatos: { campo1: 'valor1', campo2: 'valor2' },
      avisoCheckbox: { check1: true, check2: false }
    };

    service.setDatosFormulario(datos);

    expect(tramiteStoreMock.setNumeroEstablecimiento).toHaveBeenCalledWith('1');
    expect(tramiteStoreMock.setDescClobGenerica).toHaveBeenCalledWith('desc');
    expect(tramiteStoreMock.setActividadProductiva).toHaveBeenCalledWith('prod');
    expect(tramiteStoreMock.setFechaInicioVigencia).toHaveBeenCalledWith('2023-01-01');
    expect(tramiteStoreMock.setFechaFinVigencia).toHaveBeenCalledWith('2023-12-31');
    expect(tramiteStoreMock.setCheckboxDatos).toHaveBeenCalledWith(['a', 'b']);
    expect(tramiteStoreMock.setFolioAcuse).toHaveBeenCalledWith('FOLIO');
    expect(tramiteStoreMock.setTipoSolicitudPexim).toHaveBeenCalledWith('PEXIM');
    expect(tramiteStoreMock.setCapacidadAlmacenamiento).toHaveBeenCalledWith('100');
    expect(tramiteStoreMock.setTipoCaat).toHaveBeenCalledWith('CAAT');
    expect(tramiteStoreMock.setTipoProgFomExp).toHaveBeenCalledWith('PROG');
    expect(tramiteStoreMock.setTipoTransito).toHaveBeenCalledWith('TRANS');
    expect(tramiteStoreMock.setMedioTransporte).toHaveBeenCalledWith('CAMION');
    expect(tramiteStoreMock.setNombreBanco).toHaveBeenCalledWith('BANCO');
    expect(tramiteStoreMock.setNomOficialAutorizado).toHaveBeenCalledWith('OFICIAL');
    expect(tramiteStoreMock.setObservaciones).toHaveBeenCalledWith('OBS');
    expect(tramiteStoreMock.setEmpresaControladora).toHaveBeenCalledWith('EMPRESA');
    expect(tramiteStoreMock.setDescripcionLugarEmbarque).toHaveBeenCalledWith('LUGAR');
    expect(tramiteStoreMock.setNumeroEstablecimiento).toHaveBeenCalledWith('1');
    expect(tramiteStoreMock.updateFusionDatos).toHaveBeenCalledWith([{ id: 1 }]);
    expect(tramiteStoreMock.updateAgenteDatos).toHaveBeenCalledWith({ agente: 1 });
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('campo1', 'valor1');
    expect(tramiteStoreMock.setAvisoDatos).toHaveBeenCalledWith('campo2', 'valor2');
    expect(tramiteStoreMock.setAviso).toHaveBeenCalledWith('check1', true);
    expect(tramiteStoreMock.setAviso).toHaveBeenCalledWith('check2', false);
  });

  it('should emit new value on fusion$ when setFusionada is called', (done) => {
    const fusionData = [{ id: 1 }, { id: 2 }];
    service.fusion$.subscribe((data) => {
      expect(data).toEqual(fusionData);
      done();
    });
    service.setFusionada(fusionData as any);
  });
});
