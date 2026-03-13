import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NuevoProgramaIndustrialService } from './modalidad-albergue.service';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { ComplimentosService } from '../../../shared/services/complimentos.service';
import { Tramite80101Query } from '../estados/tramite80101.query';

describe('NuevoProgramaIndustrialService', () => {
  let service: NuevoProgramaIndustrialService;
  let httpClientMock: any;
  let httpCoreServiceMock: any;
  let complimentosServiceMock: any;
  let tramite80101QueryMock: any;

  beforeEach(() => {
    httpClientMock = { get: jest.fn(), post: jest.fn() };
    httpCoreServiceMock = { post: jest.fn() };
    complimentosServiceMock = { setProcedure: jest.fn(), setProcedureNo: jest.fn() };
    tramite80101QueryMock = { allStoreData$: of({}) };

    TestBed.configureTestingModule({
      providers: [
        NuevoProgramaIndustrialService,
        { provide: HttpClient, useValue: httpClientMock },
        { provide: HttpCoreService, useValue: httpCoreServiceMock },
        { provide: ComplimentosService, useValue: complimentosServiceMock },
        { provide: Tramite80101Query, useValue: tramite80101QueryMock },
      ],
    });

    service = TestBed.inject(NuevoProgramaIndustrialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setProcedure and setProcedureNo on construction', () => {
    expect(complimentosServiceMock.setProcedure).toHaveBeenCalledWith('sat-t80103');
    expect(complimentosServiceMock.setProcedureNo).toHaveBeenCalledWith('80103');
  });

  it('setProcedure should call complimentosService.setProcedure', () => {
    service.setProcedure();
    expect(complimentosServiceMock.setProcedure).toHaveBeenCalledWith('sat-t80103');
  });

  it('setProcedureNo should call complimentosService.setProcedureNo', () => {
    service.setProcedureNo();
    expect(complimentosServiceMock.setProcedureNo).toHaveBeenCalledWith('80103');
  });

  it('getDatos should return infoServicios from ampliacion-servicios.json', (done) => {
    httpClientMock.get.mockReturnValue(of({ data: { infoServicios: { test: 1 } } }));
    service.getDatos().subscribe(res => {
      expect(res).toEqual({ test: 1 });
      done();
    });
  });

  it('obtenerIngresoSelectList should return data from ampliacion-IMMEX-dropdown.json', (done) => {
    httpClientMock.get.mockReturnValue(of({ data: [{ id: 1 }] }));
    service.obtenerIngresoSelectList().subscribe(res => {
      expect(res).toEqual([{ id: 1 }]);
      done();
    });
  });

  it('obtenerListaEstado should return estados from estado-datos.json', (done) => {
    httpClientMock.get.mockReturnValue(of({ estados: ['CDMX'] }));
    service.obtenerListaEstado().subscribe(res => {
      expect(res).toEqual({ estados: ['CDMX'] });
      done();
    });
  });

  it('getSubfabricantesDisponibles should return subfabricantes from submanufactureras-disponibles-datos.json', (done) => {
    httpClientMock.get.mockReturnValue(of([{ id: 1 }]));
    service.getSubfabricantesDisponibles().subscribe(res => {
      expect(res).toEqual([{ id: 1 }]);
      done();
    });
  });

  it('obtenerComplimentos should return datosComplimentos from datos-complimentos.json', (done) => {
    httpClientMock.get.mockReturnValue(of({ test: 'complimentos' }));
    service.obtenerComplimentos().subscribe(res => {
      expect(res).toEqual({ test: 'complimentos' });
      done();
    });
  });

  it('getAllState should return allStoreData$', (done) => {
    service.getAllState().subscribe(res => {
      expect(res).toEqual({});
      done();
    });
  });

  it('guardarDatosPost should call httpService.post with correct params', (done) => {
    httpCoreServiceMock.post.mockReturnValue(of({ ok: true }));
    service.guardarDatosPost({ a: 1 }).subscribe(res => {
      expect(httpCoreServiceMock.post).toHaveBeenCalled();
      expect(res).toEqual({ ok: true });
      done();
    });
  });

  it('buildComplimentos should build object from data and base', () => {
    const data = {
      datosComplimentos: {
        formaModificaciones: {
          rfc: 'RFC',
          nombreDeActa: 'ACTA',
          nombreDeNotaria: 'NOTARIA',
          estado: 'CDMX',
          fechaDeActa: '2024-01-01',
          nombreDelFederatario: 'FEDERATARIO',
        },
        modalidad: 'MODALIDAD',
        programaPreOperativo: true,
        datosGeneralis: {
          paginaWWeb: 'WEB',
          localizacion: 'LOC',
        },
        obligacionesFiscales: {
          opinionPositiva: '1',
          fechaExpedicion: '2024-01-02',
        },
      },
    };
    const base = { notario: {} };
    const result:any = service.buildComplimentos(data, base);
    expect(result.notario.rfc).toBe('RFC');
    expect(result.booleanGenerico).toBe(true);
    expect(result.numeroPermiso).toBe('SI');
    expect(result.nomOficialAutorizado).toBe('FEDERATARIO');
  });

  it('buildSociosAccionistas should build array from arr1, arr2, base', () => {
    const arr1 = [{ nombre: 'A', estado: 'CDMX', pais: 'MX', taxId: 'TAX', codigoPostal: '12345' }];
    const arr2 = [{ nombre: 'B', estado: 'JAL', pais: 'MX', taxId: 'TAX2', codigoPostal: '54321' }];
    const base:any = [{}];
    const result:any = service.buildSociosAccionistas(arr1, arr2, base);
    expect(result.length).toBe(2);
    expect(result[0].nombre).toBe('A');
    expect(result[1].nombre).toBe('B');
  });

  it('buildDeclaracionSolicitudEntries should build correct array', () => {
    const data = { datosComplimentos: { obligacionesFiscales: { aceptarObligacionFiscal: true } } };
    const result:any = service.buildDeclaracionSolicitudEntries(data);
    expect(result[0].acepto).toBe(1);
    expect(result[0].idTipoTramite).toBe(80103);
  });

  it('buildComplementosTablaPayload should build correct array', () => {
    const array = [{ rfc: 'RFC', correoElectronico: 'mail', razonSocial: 'RS', nombre: 'N', apellidoPaterno: 'AP', apellidoMaterno: 'AM', codigoPostal: 'CP', estado: 'CDMX' }];
    const base = [{}];
    const result:any = service.buildComplementosTablaPayload(array, base);
    expect(result.length).toBe(1);
    expect(result[0].rfc).toBe('RFC');
    expect(result[0].domicilioSolicitud.codigoPostal).toBe('CP');
  });

  it('buildPlantas should build correct object', () => {
    const array = [{ planta: 'P1', calle: 'C', numeroExterior: '1', numeroInterior: '2', codigoPostal: 'CP', localidad: 'LOC', colonia: 'COL', delegacionMunicipio: 'DEL', entidadFederativa: 'CDMX', pais: 'MX', registroFederalDeContribuyentes: 'RFC', domicilioDelSolicitante: 'DF', razonSocial: 'RS' }];
    const base = [{}];
    const data = {
      tablaDatosCapacidadInstalada: [{ FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: 'F', UMT: 'U', DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: 'D', CAPACIDAD_EFECTIVAMENTE_UTILIZADA: 'CE', CALCULO_CAPACIDAD_INSTALADA: 'CC', TURNOS: 1, HORAS_POR_TURNO: 8, CANTIDAD_EMPLEADOS: 10, CANTIDAD_MAQUINARIA: 5, DESCRIPCION_MAQUINARIA: 'DM', CAPACIDAD_INSTALADA_MENSUAL: 100, CAPACIDAD_INSTALADA_ANUAL: '1200' }],
      montosDeInversionTablaDatos: [{ PLANTA: 'P1', MONTO: 1000, TIPO: 'T', DESC_TIPO: 'DT', CANTIDAD: 1, DESCRIPCION: 'DESC', TESTADO: '1', DESC_TESTADO: 'DT' }],
      empleadosTablaDatos: [{ PLANTA: 'P1', ID_EMPLEADOS: 'E1', TOTAL: 10, DIRECTOS: 5, CEDULA_DE_CUOTAS: 'C', FECHA_DE_CEDULA: '2024-01-01', INDIRECTOS_TEST: 5, CONTRATO: 'CON', OBJETO_DEL_CONTRATO_DEL_SERVICIO: 'OBJ', FECHA_FIRMA: '2024-01-02', FECHA_FIN_VIGENCIA: '2024-01-03', RFC: 'RFC', RAZON_SOCIAL: 'RS', TESTADO: '1', DESC_TESTADO: 'DT' }],
      complementarPlantaDatos: [{ PLANTA: 'P1', DATO: 'D', PERMANECERA_MERCANCIA_PROGRAMA: 'AMP', TIPO_DOCUMENTO: 'TD', DESCRIPCION_DOCUMENTO: 'DD', DESCRIPCION_OTRO: 'DO', DOCUMENTO_RESPALDO: 'DR', DESC_DOCUMENTO_RESPALDO: 'DDR', RESPALDO_OTRO: 'RO', FECHA_DE_FIRMA: '2024-01-01', FECHA_DE_FIN_DE_VIGENCIA: '2024-01-02', FECHA_DE_FIRMA_DOCUMENTO: '2024-01-03', FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO: '2024-01-04' }],
      complementarFirmanteDatos: [{ planta: 'P1', tipoFirmante: 'TF', descTipoFirmante: 'DTF' }],
    };
    const result:any = service.buildPlantas(array, base, data);
    expect(result['LISTA_CAPACIDAD'].length).toBe(1);
    expect(result['MONTOS'].length).toBe(1);
    expect(result['DATOS_EMPLEADOS'].length).toBe(1);
    expect(result['DATOS_COMPLEMENTARIOS'].length).toBe(1);
    expect(result['FIRMANTES'].length).toBe(1);
  });

  it('buildAnexo should build correct anexo object', () => {
    const data = {
      annexoDosTres: {
        anexoDosTablaLista: [{ encabezadoFraccion: 'F', encabezadoDescripcion: 'D' }],
        anexoTresTablaLista: [{ encabezadoFraccion: 'F3', encabezadoDescripcion: 'D3' }],
      },
      annexoUno: {
        proveedorClienteDatosTabla: [{ idProveedor: 1, paisOrigen: 'MX', rfcProveedor: 'RFC', razonProveedor: 'RS', paisDestino: 'MX', rfcClinte: 'RFC2', razonSocial: 'RS2', domicilio: 'DOM', testado: true, idProductoP: 2, descTestado: 'DT' }],
        importarDatosTabla: [{ encabezadoAnexoII: 'AII', encabezadoTipo: 'T', encabezadoCategoria: 'C', encabezadoDescripcionComercial: 'DC', encabezadoVolumenMensual: 'VM', encabezadoVolumenAnual: 'VA', encabezadoValorEnMonedaMensual: 'VMM', encabezadoValorEnMonedaAnual: 'VMA' }],
        exportarDatosTabla: [{ encabezadoFraccionExportacion: 'FE', encabezadoFraccionImportacion: 'FI', encabezadoDescripcionComercial: 'DC', encabezadoAnexoII: 'AII', encabezadoIdProducto: 1, encabezadoFraccionDescripcionAnexo: 'FDA', encabezadoValorEnMonedaAnual: 'VMA', encabezadoValorEnMonedaMensual: 'VMM', encabezadoVolumenMensual: 'VM', encabezadoVolumenAnual: 'VA', encabezadoCategoria: 'C', encabezadoTipo: 'T', encabezadoUmt: 'U' }],
        proveedorClienteDatosTablaDos: [{ paisOrigen: 'MX', rfcProveedor: 'RFC', razonProveedor: 'RS', paisDestino: 'MX', rfcClinte: 'RFC2', razonSocial: 'RS2', domicilio: 'DOM', descTestado: 'DT' }],
      },
      proyectoImmexTablaLista: [{ encabezadoTipoDocument: 'TD', encabezadoDescripcionOtro: 'DO', encabezadoFechaFirma: '2024-01-01', encabezadoFechaVigencia: '2024-01-02', encabezadoRfc: 'RFC', encabezadoRazonFirmante: 'RS' }],
    };
    const result:any = service.buildAnexo(data);
    expect(result.anexo.ANEXOII.length).toBe(1);
    expect(result.anexo.ANEXOIII.length).toBe(1);
    expect(result.anexo.proveedorCliente.length).toBe(1);
    expect(result.anexo.datosParaNavegar).toBeDefined();
    expect(result.anexo.tableDos.length).toBe(1);
    expect(result.anexo.proyectoimex.length).toBe(1);
    expect(result.anexo.proveedorClienteDos.length).toBe(1);
  });

  it('buildPlantasSubmanufactureras should build correct array', () => {
    const base = [{ datosComplementarios: [{ idPlantaC: 'P1', idDato: 'D1', amparoPrograma: 'AMP' }] }];
    const array:any = [{ calle: 'C', numInterior: 'NI', numExterior: 'NE', codigoPostal: 'CP', colonia: 'COL', municipio: 'MUN', entidadFederativa: 'CDMX', pais: 'MX', rfc: 'RFC', domicilioFiscal: 'DF', razonSocial: 'RS' }];
    const result:any = service.buildPlantasSubmanufactureras(base, array);
    expect(result.length).toBe(1);
    expect(result[0].empresaCalle).toBe('C');
    expect(result[0].datosComplementarios.length).toBe(1);
    expect(result[0].datosComplementarios[0].idPlantaC).toBe('P1');
  });

  it('buildDatosFederatarios should build correct array', () => {
    const base = [{}];
    const array = [{ nombre: 'N', segundoApellido: 'SA', primerApellido: 'PA', numeroDeActa: 'NA', fechaInicioInput: '2024-01-01', numeroDeNotaria: 'NN', estado: 'CDMX', estadoOptions: 'DEL' }];
    const result:any = service.buildDatosFederatarios(base, array);
    expect(result.length).toBe(1);
    expect(result[0].nombreNotario).toBe('N');
    expect(result[0].apellidoMaterno).toBe('SA');
    expect(result[0].fechaActa).toBe('2024-01-01');
    expect(result[0].delegacionMunicipio).toBe('DEL');
  });
});