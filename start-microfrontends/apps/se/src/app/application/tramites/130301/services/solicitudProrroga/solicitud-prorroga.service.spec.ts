import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { SolicitudProrrogaService } from './solicitud-prorroga.service';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';
import { Tramite130301Store } from '../../../../estados/tramites/tramite130301.store';

import { PROC_130301 } from '../../servers/api-route';
import { DatosFolioPermiso, ValidacionFolioPermisoResponse } from '@libs/shared/data-access-user/src/core/models/130301/solicitud-prorroga.model';

describe('SolicitudProrrogaService', () => {
  let service: SolicitudProrrogaService;
  let httpClientMock: jest.Mocked<HttpClient>;
  let queryMock: jest.Mocked<Tramite130301Query>;
  let storeMock: jest.Mocked<Tramite130301Store>;

  beforeEach(() => {
    httpClientMock = {
      post: jest.fn(),
      get: jest.fn()
    } as any;

    queryMock = {
      selectSolicitud$: of({} as any)
    } as any;

    storeMock = {
      setNumeroFolioTramiteOriginal: jest.fn(),
      setSolicitudOpcion: jest.fn(),
      setRegimen: jest.fn(),
      setClasificacionDelRegimen: jest.fn(),
      setProductoOpcion: jest.fn(),
      setDescripcionMercancia: jest.fn(),
      setFraccionArancelaria: jest.fn(),
      setUmt: jest.fn(),
      setCantidad: jest.fn(),
      setValorFactura: jest.fn(),
      setPais: jest.fn(),
      setUsoEspecifico: jest.fn(),
      setJustificacionImportacionExportacion: jest.fn(),
      setObservaciones: jest.fn(),
      setRepresentacionFederal: jest.fn(),
      setCertificadoKimberleyForma: jest.fn(),
      setCantidadProrroga: jest.fn(),
      setFechaInicioProrroga: jest.fn(),
      setFechaFinProrroga: jest.fn(),
      setEstatusSolicitud: jest.fn(),
      setPartidasIdSolicitud: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        SolicitudProrrogaService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: Tramite130301Query, useValue: queryMock },
        { provide: Tramite130301Store, useValue: storeMock }
      ],
    });

    service = TestBed.inject(SolicitudProrrogaService);
  });
  
  it('should return state from query', (done) => {
    service.getAllState().subscribe((data) => {
      expect(data).toEqual({});
      done();
    });
  });

  it('should call cargarDatosPerfil API', () => {
    const payload = { folioPermiso: '123', rfc: 'ABC123' };
    const mockResponse = {} as ValidacionFolioPermisoResponse;

    httpClientMock.post.mockReturnValue(of(mockResponse));

    service.cargarDatosPerfil(payload).subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    expect(httpClientMock.post).toHaveBeenCalledWith(
      PROC_130301.CARGAR_DATOS_PREFIL,
      payload
    );
  });

  it('should call guardarDatos API', () => {
    const body = { foo: 'bar' };
    const mockResponse = { ok: true };

    httpClientMock.post.mockReturnValue(of(mockResponse));

    service.guardarDatos(body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    expect(httpClientMock.post).toHaveBeenCalledWith(
      PROC_130301.GUARDAR,
      body
    );
  });

  it('should update store with datosPerfil', () => {
    const datos = {
      numeroFolio: '100',
      solicitud: {
        tipoSolicitudPexim: 'TIPO',
        datoTramite: {
          regimen: 'Regimen',
          clasificacionRegimen: 'Clasificacion'
        },
        fraccionArancelaria: '123',
        representacionFederal: 'OFICINA'
      },
      tramite: {
        solicitud: {
          mercancia: {
            condicionMercancia: 'COND',
            descripcion: 'DESC',
            unidadMedidaTarifaria: 'KG',
            unidadesAutorizadas: '50',
            importeFacturaAutorizadoUSD: '1000'
          },
          certificadoKimberly: {
            certificadosEmitidos: '1',
            idCertificadoKimberlyImportacion: 'ID',
            nombrePaisOrigenIngles: 'USA',
            nombreExportador: 'Exporter',
            direccionExportador: 'Dir Exp',
            nombreImportador: 'Importer',
            direccionImportador: 'Dir Imp',
            descripcionNumeroRemesa: 'One',
            descripcionNumeroRemesaIngles: 'One',
            numeroFacturaRemesa: 'FAC1',
            numeroKilates: '10',
            valorDiamantes: '500',
            certificadoKimberlyPKPais: 'PAIS',
            origen: true,
            claveOrigen: 'ORIG'
          },
          prorroga: {
            cantidadLibreMercancia: '500'
          }
        }
      },
      paises: 'USA',
      usoEspecifico: 'Uso',
      justificacionImportacionExportacion: 'Just',
      observaciones: 'Obs',
      fechaInicioProrroga: '01/01/2025',
      fechaFinProrroga: '02/01/2025'
    } as DatosFolioPermiso;

    service.actualizarDatosPerfil(datos);

    expect(storeMock.setNumeroFolioTramiteOriginal).toHaveBeenCalledWith('100');
    expect(storeMock.setSolicitudOpcion).toHaveBeenCalledWith('TIPO');
    expect(storeMock.setRegimen).toHaveBeenCalledWith('Regimen');
    expect(storeMock.setFechaInicioProrroga).toHaveBeenCalledWith('01/01/2025');
    expect(storeMock.setFechaFinProrroga).toHaveBeenCalledWith('02/01/2025');
  });

  it('should call obtenerProrrogaTablaDatos API', () => {
    const mockResponse = { data: {} } as any;
    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.obtenerProrrogaTablaDatos('999').subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${PROC_130301.MOSTRAR_PRORROGA}999`
    );
  });

  it('should call obtenerPartidasTablaDatos API', () => {
    const mockResponse = { data: {} } as any;
    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.obtenerPartidasTablaDatos('20').subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

    expect(httpClientMock.get).toHaveBeenCalledWith(
      `${PROC_130301.MOSTAR_PARTIDAS}20`
    );
  });

  it('should call obtenerEstadoList API', () => {
    const mockResponse = { catalogo: [] };

    httpClientMock.get.mockReturnValue(of(mockResponse));

    service.obtenerEstadoList().subscribe((res) => {
      expect(res).toBe(mockResponse);
    });

  //  expect(httpClientMock.get).toHaveBeenCalledWith(PROC_130301.PAIS_CATALOGO);
  });
});