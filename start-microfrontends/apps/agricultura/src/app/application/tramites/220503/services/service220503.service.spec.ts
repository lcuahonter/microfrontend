import { Solocitud220503Service } from './service220503.service';
import { Solicitud220503Store, Solicitud220503State } from '../estados/tramites220503.store';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { PagoDeDerechos } from '../models/pago-de-derechos.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { TercerosrelacionadosdestinoTable } from '../../../shared/models/tercerosrelacionados.model';
import { DestinatarioForm } from '../../220203/models/220203/importacion-de-acuicultura.module';

describe('Solocitud220503Service', () => {
  let service: Solocitud220503Service;
  let httpMock: jest.Mocked<HttpClient>;
  let storeMock: jest.Mocked<Solicitud220503Store>;

  beforeEach(() => {
    httpMock = {
      get: jest.fn()
    } as any;

    storeMock = {
      setCertificadosAutorizados: jest.fn(),
      setMercancia: jest.fn(),
      setHoraDeInspeccion: jest.fn(),
      setAduanaDeIngreso: jest.fn(),
      setSanidadAgropecuaria: jest.fn(),
      setPuntoDeInspeccion: jest.fn(),
      setFechaDeInspeccion: jest.fn(),
      setNombre: jest.fn(),
      setPrimerapellido: jest.fn(),
      setSegundoapellido: jest.fn(),
      setTipocontenedor: jest.fn(),
      setTransporteIdMedio: jest.fn(),
      setIdentificacionTransporte: jest.fn(),
      setEsSolicitudFerros: jest.fn(),
      setTotalDeGuiasAmparadas: jest.fn(),
      setFoliodel: jest.fn(),
      setAduanaIngreso: jest.fn(),
      setOficinaInspeccion: jest.fn(),
      setPuntoInspeccion: jest.fn(),
      setClaveUCON: jest.fn(),
      setEstablecimientoTIF: jest.fn(),
      setNumeroguia: jest.fn(),
      setRegimen: jest.fn(),
      setMovilizacion: jest.fn(),
      setTransporte: jest.fn(),
      setNombreEmpresa: jest.fn(),
      setPunto: jest.fn(),
      setExentoPagoNo: jest.fn(),
      setJustificacion: jest.fn(),
      setClaveReferencia: jest.fn(),
      setCadenaDependencia: jest.fn(),
      setBanco: jest.fn(),
      setIlavePago: jest.fn(),
      setImportePago: jest.fn(),
      updateTercerosRelacionados: jest.fn(),
      _select: jest.fn(),
      actualizarPagoDeDerechos: jest.fn()
    } as any;

    service = new Solocitud220503Service(httpMock, storeMock);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe llamar todos los setters del store con los valores correctos en actualizarEstadoFormulario', () => {
    const datos: Solicitud220503State = {
      certificadosAutorizados: 1,
      mercancia: 'mercancia',
      horaDeInspeccion: 1000,
      aduanaDeIngreso: 123,
      sanidadAgropecuaria: 1,
      puntoInspeccion: 1,
      puntoDeInspeccion: 1,
      fechaDeInspeccion: '2024-01-01',
      nombre: 'Juan',
      primerapellido: 'Perez',
      segundoapellido: 'Lopez',
      tipocontenedor: 1,
      transporteIdMedio: 1,
      identificacionTransporte: 'idTransporte',
      esSolicitudFerros: 1,
      totalDeGuiasAmparadas: '5',
      foliodel: 'folio',
      aduanaIngreso: 456,
      oficinaInspeccion: 789,
      claveUCON: 'clave',
      establecimientoTIF: 'tif',
      numeroguia: 'num',
      regimen: 1,
      movilizacion: 123,
      transporte: 'transporte',
      nombreEmpresa: 123, 
      punto: 2,
      exentoPagoNo: 0,
      justificacion: 'justificacion',
      claveReferencia: 'ref',
      cadenaDependencia: 'cadena',
      banco: 1,
      llavePago: 'llave',
      importePago: '1000',
      fetchapago: '', 
      datosForma: [] ,
      tercerosRelacionados: [],
      selectedTerceros:{} as TercerosrelacionadosdestinoTable,
      seletedExdora: {} as DestinatarioForm,
      pagoDeDerechos: {} as PagoDeDerechos
    };

    service.actualizarEstadoFormulario(datos);

    expect(storeMock.setCertificadosAutorizados).toHaveBeenCalledWith(datos.certificadosAutorizados);
    expect(storeMock.setMercancia).toHaveBeenCalledWith(datos.mercancia);
    expect(storeMock.setHoraDeInspeccion).toHaveBeenCalledWith(datos.horaDeInspeccion);
    expect(storeMock.setAduanaDeIngreso).toHaveBeenCalledWith(datos.aduanaDeIngreso);
    expect(storeMock.setSanidadAgropecuaria).toHaveBeenCalledWith(datos.sanidadAgropecuaria);
    expect(storeMock.setPuntoDeInspeccion).toHaveBeenCalledWith(datos.puntoInspeccion);
    expect(storeMock.setFechaDeInspeccion).toHaveBeenCalledWith(datos.fechaDeInspeccion);
    expect(storeMock.setNombre).toHaveBeenCalledWith(datos.nombre);
    expect(storeMock.setPrimerapellido).toHaveBeenCalledWith(datos.primerapellido);
    expect(storeMock.setSegundoapellido).toHaveBeenCalledWith(datos.segundoapellido);
    expect(storeMock.setTipocontenedor).toHaveBeenCalledWith(datos.tipocontenedor);
    expect(storeMock.setTransporteIdMedio).toHaveBeenCalledWith(datos.transporteIdMedio);
    expect(storeMock.setIdentificacionTransporte).toHaveBeenCalledWith(datos.identificacionTransporte);
    expect(storeMock.setEsSolicitudFerros).toHaveBeenCalledWith(datos.esSolicitudFerros);
    expect(storeMock.setTotalDeGuiasAmparadas).toHaveBeenCalledWith(datos.totalDeGuiasAmparadas);
    expect(storeMock.setFoliodel).toHaveBeenCalledWith(datos.foliodel);
    expect(storeMock.setAduanaIngreso).toHaveBeenCalledWith(datos.aduanaIngreso);
    expect(storeMock.setOficinaInspeccion).toHaveBeenCalledWith(datos.oficinaInspeccion);
    expect(storeMock.setPuntoInspeccion).toHaveBeenCalledWith(datos.puntoInspeccion);
    expect(storeMock.setClaveUCON).toHaveBeenCalledWith(datos.claveUCON);
    expect(storeMock.setEstablecimientoTIF).toHaveBeenCalledWith(datos.establecimientoTIF);
    expect(storeMock.setNumeroguia).toHaveBeenCalledWith(datos.numeroguia);
    expect(storeMock.setRegimen).toHaveBeenCalledWith(datos.regimen);
    expect(storeMock.setMovilizacion).toHaveBeenCalledWith(datos.movilizacion);
    expect(storeMock.setTransporte).toHaveBeenCalledWith(datos.transporte);
    expect(storeMock.setNombreEmpresa).toHaveBeenCalledWith(datos.nombreEmpresa);
    expect(storeMock.setPunto).toHaveBeenCalledWith(datos.punto);
    expect(storeMock.setExentoPagoNo).toHaveBeenCalledWith(datos.exentoPagoNo);
    expect(storeMock.setJustificacion).toHaveBeenCalledWith(datos.justificacion);
    expect(storeMock.setClaveReferencia).toHaveBeenCalledWith(datos.claveReferencia);
    expect(storeMock.setCadenaDependencia).toHaveBeenCalledWith(datos.cadenaDependencia);
    expect(storeMock.setBanco).toHaveBeenCalledWith(datos.banco);
    expect(storeMock.setIlavePago).toHaveBeenCalledWith(datos.llavePago);
    expect(storeMock.setImportePago).toHaveBeenCalledWith(datos.importePago);
  });

  it('debe llamar http.get con la URL correcta en getRegistroTomaMuestrasMercanciasData', () => {
    const mockResponse = { some: 'data' } as any;
    httpMock.get.mockReturnValue(of(mockResponse));

    const obs$ = service.getRegistroTomaMuestrasMercanciasData();

    expect(httpMock.get).toHaveBeenCalledWith(
      'assets/json/220503/registro_toma_muestras_mercancias.json'
    );

    obs$.subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });

  it('debe tener urlServer y urlServerCatalogos desde ENVIRONMENT', () => {
    expect(service.urlServer).toBeDefined();
    expect(service.urlServerCatalogos).toBeDefined();
  });

  it('debe llamar updateTercerosRelacionados en el store en updateTercerosRelacionado', () => {
    const mockTerceros: TercerosrelacionadosdestinoTable[] = [
      { id: 1, nombre: 'Tercero 1' } as any
    ];

    service.updateTercerosRelacionado(mockTerceros);

    expect(storeMock.updateTercerosRelacionados).toHaveBeenCalledWith(mockTerceros);
  });

  it('debe retornar un observable desde store._select en getAllDatosForma', () => {
    const mockState: Solicitud220503State = {
      certificadosAutorizados: 1,
      mercancia: 'test'
    } as any;
    
    storeMock._select.mockReturnValue(of(mockState));

    const result$ = service.getAllDatosForma();

    expect(storeMock._select).toHaveBeenCalledWith(expect.any(Function));
    result$.subscribe(data => {
      expect(data).toEqual(mockState);
    });
  });

  it('debe llamar actualizarPagoDeDerechos en el store en actualizarPagoDeDerechos', () => {
    const mockPago: PagoDeDerechos = {
      exentoPago: 'SI',
      justificacion: 'Test justification',
      claveReferencia: 'REF123',
      cadenaDependencia: 'DEP456',
      banco: 'BANCO_TEST',
      llavePago: 'test123',
      importePago: '1000',
      fechaPago: '2024-01-01'
    };

    service.actualizarPagoDeDerechos(mockPago);

    expect(storeMock.actualizarPagoDeDerechos).toHaveBeenCalledWith(mockPago);
  });

  it('debe llamar http.get con la URL correcta en obtenerDetallesDelCatalogo', () => {
    const nombreArchivo = 'test-catalog.json';
    const mockResponse: RespuestaCatalogos = {
      code: 200,
      message: 'Success',
      data: [
        { id: 1, descripcion: 'Test Item 1' },
        { id: 2, descripcion: 'Test Item 2' }
      ]
    };
    httpMock.get.mockReturnValue(of(mockResponse));

    const result$ = service.obtenerDetallesDelCatalogo(nombreArchivo);

    expect(httpMock.get).toHaveBeenCalledWith(`assets/json/220503/${nombreArchivo}`);
    result$.subscribe(data => {
      expect(data).toEqual(mockResponse);
    });
  });
});