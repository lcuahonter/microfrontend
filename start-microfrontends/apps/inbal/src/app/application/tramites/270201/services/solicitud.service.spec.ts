import { SolicitudService } from './solicitud.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Tramite270201Store } from '../estados/tramites/tramite270201.store';
import { Tramite270201State } from '../estados/tramites/tramite270201.store';
import { ENVIRONMENT } from '../../../../environments/environment';

jest.mock('@angular/common/http');
jest.mock('../estados/tramites/tramite270201.store');

describe('SolicitudService', () => {
  let service: SolicitudService;
  let http: jest.Mocked<HttpClient>;
  let store: jest.Mocked<Tramite270201Store>;

  beforeEach(() => {
    http = {
      get: jest.fn()
    } as any;
    store = {
      setOperacion: jest.fn(),
      setMovimiento: jest.fn(),
      setMotivo: jest.fn(),
      setPais: jest.fn(),
      setCiudad: jest.fn(),
      setTransporte: jest.fn(),
      setAduana: jest.fn(),
      setAutor: jest.fn(),
      setTitulo: jest.fn(),
      setTecnica: jest.fn(),
      setAlto: jest.fn(),
      setAncho: jest.fn(),
      setProfundidad: jest.fn(),
      setDiametro: jest.fn(),
      setVariables: jest.fn(),
      setAnoDeCreacion: jest.fn(),
      setAvaluo: jest.fn(),
      setMoneda: jest.fn(),
      setPropietario: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setDescripcionArancelaria: jest.fn(),
      setObraDeArte: jest.fn()
    } as any;
    service = new SolicitudService(http, store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.urlServer).toBe(ENVIRONMENT.URL_SERVER);
    expect(service.urlServerCatalogos).toBe(ENVIRONMENT.URL_SERVER_JSON_AUXILIAR);
  });

  it('getOperacionData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getOperacionData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/operacion.json');
  });

  it('getMovimientoData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getMovimientoData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/movimiento.json');
  });

  it('getPaisData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getPaisData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/pais.json');
  });

  it('getTransporteData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getTransporteData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/transporte.json');
  });

  it('getAduanaData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getAduanaData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/aduana.json');
  });

  it('getMotivoData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getMotivoData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/motivo.json');
  });

  it('getMonedaData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getMonedaData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/moneda.json');
  });

  it('getArancelariaData should call http.get with correct url', () => {
    http.get.mockReturnValue(of([]));
    service.getArancelariaData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/arancelaria.json');
  });

  it('getObraDeArteTabla should call http.get with correct url', () => {
    http.get.mockReturnValue(of({}));
    service.getObraDeArteTabla().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/obra-de-arte.json');
  });

  it('getRegistroTomaMuestrasMercanciasData should call http.get with correct url', () => {
    http.get.mockReturnValue(of({}));
    service.getRegistroTomaMuestrasMercanciasData().subscribe();
    expect(http.get).toHaveBeenCalledWith('assets/json/270201/aviso-de-importacion.json');
  });

  it('actualizarEstadoFormulario should update store with all fields', () => {
    const datos: Tramite270201State = {
      tipoDeOperacion: 'op',
      tipoDeMovimiento: 'mov',
      motivo: 'mot',
      pais: 'mx',
      ciudad: 'cdmx',
      medioTransporte: 'car',
      aduanaEntrada: 'aduana',
      autor: 'autor',
      titulo: 'titulo',
      tecnicaDeRealizacion: 'tecnica',
      alto: '1',
      ancho: '2',
      profundidad: '3',
      diametro: '4',
      variables: 'vars',
      anoDeCreacion: '2020',
      avaluo: '100',
      moneda: 'mxn',
      propietario: 'prop',
      fraccionArancelaria: 'frac',
      descripcionArancelaria: 'desc',
      ObraDeArte: [{ /* mock TablaDatos object */ }]
    } as any;

    service.actualizarEstadoFormulario(datos);

    expect(store.setOperacion).toHaveBeenCalledWith('op');
    expect(store.setMovimiento).toHaveBeenCalledWith('mov');
    expect(store.setMotivo).toHaveBeenCalledWith('mot');
    expect(store.setPais).toHaveBeenCalledWith('mx');
    expect(store.setCiudad).toHaveBeenCalledWith('cdmx');
    expect(store.setTransporte).toHaveBeenCalledWith('car');
    expect(store.setAduana).toHaveBeenCalledWith('aduana');
    expect(store.setAutor).toHaveBeenCalledWith('autor');
    expect(store.setTitulo).toHaveBeenCalledWith('titulo');
    expect(store.setTecnica).toHaveBeenCalledWith('tecnica');
    expect(store.setAlto).toHaveBeenCalledWith('1');
    expect(store.setAncho).toHaveBeenCalledWith('2');
    expect(store.setProfundidad).toHaveBeenCalledWith('3');
    expect(store.setDiametro).toHaveBeenCalledWith('4');
    expect(store.setVariables).toHaveBeenCalledWith('vars');
    expect(store.setAnoDeCreacion).toHaveBeenCalledWith('2020');
    expect(store.setAvaluo).toHaveBeenCalledWith('100');
    expect(store.setMoneda).toHaveBeenCalledWith('mxn');
    expect(store.setPropietario).toHaveBeenCalledWith('prop');
    expect(store.setFraccionArancelaria).toHaveBeenCalledWith('frac');
    expect(store.setDescripcionArancelaria).toHaveBeenCalledWith('desc');
    expect(store.setObraDeArte).toHaveBeenCalledWith([{ /* mock TablaDatos object */ }]);
  });

  it('actualizarEstadoFormulario should handle missing optional fields', () => {
    const datos: Partial<Tramite270201State> = {
      ciudad: 'cdmx',
      autor: 'autor',
      titulo: 'titulo',
      tecnicaDeRealizacion: 'tecnica',
      alto: '1',
      ancho: '2',
      profundidad: '3',
      diametro: '4',
      variables: 'vars',
      anoDeCreacion: '2020',
      avaluo: '100',
      propietario: 'prop',
      descripcionArancelaria: 'desc',
      ObraDeArte: []
    };
    service.actualizarEstadoFormulario(datos as any);

    expect(store.setOperacion).not.toHaveBeenCalled();
    expect(store.setMovimiento).not.toHaveBeenCalled();
    expect(store.setMotivo).not.toHaveBeenCalled();
    expect(store.setPais).not.toHaveBeenCalled();
    expect(store.setCiudad).toHaveBeenCalledWith('cdmx');
    expect(store.setTransporte).not.toHaveBeenCalled();
    expect(store.setAduana).not.toHaveBeenCalled();
    expect(store.setAutor).toHaveBeenCalledWith('autor');
    expect(store.setTitulo).toHaveBeenCalledWith('titulo');
    expect(store.setTecnica).toHaveBeenCalledWith('tecnica');
    expect(store.setAlto).toHaveBeenCalledWith('1');
    expect(store.setAncho).toHaveBeenCalledWith('2');
    expect(store.setProfundidad).toHaveBeenCalledWith('3');
    expect(store.setDiametro).toHaveBeenCalledWith('4');
    expect(store.setVariables).toHaveBeenCalledWith('vars');
    expect(store.setAnoDeCreacion).toHaveBeenCalledWith('2020');
    expect(store.setAvaluo).toHaveBeenCalledWith('100');
    expect(store.setMoneda).not.toHaveBeenCalled();
    expect(store.setPropietario).toHaveBeenCalledWith('prop');
    expect(store.setFraccionArancelaria).not.toHaveBeenCalled();
    expect(store.setDescripcionArancelaria).toHaveBeenCalledWith('desc');
    expect(store.setObraDeArte).toHaveBeenCalledWith([]);
  });
});
