import { AutorizacionProgrmaNuevoService } from './autorizacion-programa-nuevo.service';

describe('AutorizacionProgrmaNuevoService', () => {
  let service: AutorizacionProgrmaNuevoService;
  let httpMock: any;
  let tramite80102StoreMock: any;
  let tramite80102QueryMock: any;
  let httpServiceMock: any;
  let complimentosServiceMock: any;

  beforeEach(() => {
    httpMock = { get: jest.fn(), post: jest.fn() };
    tramite80102StoreMock = { update: jest.fn() };
    tramite80102QueryMock = { allStoreData$: { pipe: jest.fn(), subscribe: jest.fn() } };
    httpServiceMock = { get: jest.fn(), post: jest.fn() };
    complimentosServiceMock = { setProcedure: jest.fn(), setProcedureNo: jest.fn() };
    service = new AutorizacionProgrmaNuevoService(
      httpMock,
      tramite80102StoreMock,
      tramite80102QueryMock,
      httpServiceMock,
      complimentosServiceMock
    );
  });

  it('should call setProcedure and setProcedureNo on construction', () => {
    expect(complimentosServiceMock.setProcedure).toHaveBeenCalledWith('sat-t80102');
    expect(complimentosServiceMock.setProcedureNo).toHaveBeenCalledWith('80102');
  });

  it('tieneDatosDeTabla$ should emit initial value', (done) => {
    service.tieneDatosDeTabla$.subscribe(val => {
      expect(val).toBe(false);
      done();
    });
  });

  it('getDatos should call http.get and map response', (done) => {
    const mockResponse = { data: { InfoServicios: { foo: 'bar' } } };
    httpMock.get.mockReturnValueOnce({
      pipe: (fn: any) => ({ subscribe: (cb: any) => cb(fn(mockResponse)) })
    });
    service.getDatos().subscribe(res => {
      expect(res).toEqual({ foo: 'bar' });
      done();
    });
  });

  it('obtenerIngresoSelectList should call http.get and map response', (done) => {
    const mockResponse = { data: [{ id: 1 }] };
    httpMock.get.mockReturnValueOnce({
      pipe: (fn: any) => ({ subscribe: (cb: any) => cb(fn(mockResponse)) })
    });
    service.obtenerIngresoSelectList().subscribe(res => {
      expect(res).toEqual([{ id: 1 }]);
      done();
    });
  });

  it('obtenerListaEstado should call http.get', (done) => {
    const mockResponse = { estados: ['A', 'B'] };
    httpMock.get.mockReturnValueOnce({ subscribe: (cb: any) => cb(mockResponse) });
    service.obtenerListaEstado().subscribe(res => {
      expect(res).toEqual(mockResponse);
      done();
    });
  });

  it('getSubfabricantesDisponibles should call http.get and map response', (done) => {
    const mockResponse = { data: [{ rfc: 'X' }] };
    httpMock.get.mockReturnValueOnce({
      pipe: (fn: any) => ({ subscribe: (cb: any) => cb(fn(mockResponse)) })
    });
    service.getSubfabricantesDisponibles().subscribe(res => {
      expect(res).toEqual([{ rfc: 'X' }]);
      done();
    });
  });

  it('obtenerComplimentos should call http.get', (done) => {
    const mockResponse = { foo: 'bar' };
    httpMock.get.mockReturnValueOnce({ subscribe: (cb: any) => cb(mockResponse) });
    service.obtenerComplimentos().subscribe(res => {
      expect(res).toEqual(mockResponse);
      done();
    });
  });

  it('actualizarEstadoFormulario should call tramite80102Store.update', () => {
    const datos = { test: 1 };
    service.actualizarEstadoFormulario(datos as any);
    expect(tramite80102StoreMock.update).toHaveBeenCalled();
  });

  it('getRegistroTomaMuestrasMercanciasData should call http.get', (done) => {
    const mockResponse = { foo: 'bar' };
    httpMock.get.mockReturnValueOnce({ subscribe: (cb: any) => cb(mockResponse) });
    service.getRegistroTomaMuestrasMercanciasData().subscribe(res => {
      expect(res).toEqual(mockResponse);
      done();
    });
  });

  it('getFederataiosyPlantaCatalogosData should call http.get', (done) => {
    const mockResponse = { catalogo: 'data' };
    httpMock.get.mockReturnValueOnce({ subscribe: (cb: any) => cb(mockResponse) });
    service.getFederataiosyPlantaCatalogosData().subscribe(res => {
      expect(res).toEqual(mockResponse);
      done();
    });
  });

  it('getAllState should return tramite80102Query.allStoreData$', () => {
    expect(service.getAllState()).toBe(tramite80102QueryMock.allStoreData$);
  });

  it('guardarDatosPost should call httpService.post', () => {
    const body = { foo: 'bar' };
    httpServiceMock.post.mockReturnValueOnce('response');
    expect(service.guardarDatosPost(body)).toBe('response');
    expect(httpServiceMock.post).toHaveBeenCalled();
  });

  it('setProcedure should call complimentosService.setProcedure', () => {
    service.setProcedure();
    expect(complimentosServiceMock.setProcedure).toHaveBeenCalledWith('sat-t80102');
  });

  it('getServicoImmex should call httpService.get', () => {
    httpServiceMock.get.mockReturnValueOnce('response');
    expect(service.getServicoImmex()).toBe('response');
    expect(httpServiceMock.get).toHaveBeenCalled();
  });

  it('getPais should call httpService.get', () => {
    httpServiceMock.get.mockReturnValueOnce('response');
    expect(service.getPais()).toBe('response');
    expect(httpServiceMock.get).toHaveBeenCalled();
  });

  it('buildComplimentos should build object correctly', () => {
    const data = {
      datosComplimentos: {
        formaModificaciones: {
          rfc: 'RFC',
          nombreDeActa: 'ACTA',
          nombreDeNotaria: 'NOTARIA',
          estado: 'ESTADO',
          fechaDeActa: '2024-01-01',
          nombreDelFederatario: 'FED'
        },
        modalidad: 'MOD',
        programaPreOperativo: true,
        datosGeneralis: {
          paginaWWeb: 'WEB',
          localizacion: 'LOC'
        },
        obligacionesFiscales: {
          opinionPositiva: '1',
          fechaExpedicion: '2024-01-02'
        }
      }
    };
    const base = { notario: {} };
    const result = service.buildComplimentos(data, base);
    expect((result as any)['notario'].rfc).toBe('RFC');
    expect((result as any).booleanGenerico).toBe(true);
    expect((result as any).numeroPermiso).toBe('SI');
    expect((result as any).fechaOperacion).toBe('2024-01-02');
    expect((result as any).nomOficialAutorizado).toBe('FED');
  });

  it('buildSociosAccionistas should build array correctly', () => {
    const arr1 = [{ nombre: 'A', estado: 'E', pais: 'MX', taxId: 'T', codigoPostal: 'CP' }];
    const arr2 = [{ nombre: 'B', estado: 'F', pais: 'US', taxId: 'U', codigoPostal: 'CP2' }];
    const base:any = [{}];
    const result = service.buildSociosAccionistas(arr1, arr2, base);
    expect(result.length).toBe(2);
    expect(result[0]['nombre']).toBe('A');
    expect(result[1]['nombre']).toBe('B');
  });

  it('buildEmpresaNacionales should build array correctly', () => {
    const base = [{}];
    const array = [{ servicio: 'S', registroContribuyentes: 'RFC', anoIMMEX: '2024', numeroIMMEX: '123', denominacionSocial: 'RS' }];
    const result = service.buildEmpresaNacionales(base, array) as Array<{ idServicio: string; rfc: string; razonSocial: string }>;
    expect(result[0].idServicio).toBe('S');
    expect(result[0].rfc).toBe('RFC');
    expect(result[0].razonSocial).toBe('RS');
  });

  it('buildEmpresaExtranjera should build array correctly', () => {
    const base = [{}];
    const array = [{ direccionEmpresaExtranjera: 'DIR', servicio: 'S', nombreEmpresa: 'NE' }];
    const result:any = service.buildEmpresaExtranjera(base, array);
    expect(result[0].idDireccionSol).toBe('DIR');
    expect(result[0].idServicio).toBe('S');
    expect(result[0].nombre).toBe('NE');
  });

  it('buildDeclaracionSolicitudEntries should build array correctly', () => {
    const data = { datosComplimentos: { obligacionesFiscales: { aceptarObligacionFiscal: true } } };
    const result:any = service.buildDeclaracionSolicitudEntries(data);
    expect(result[0].acepto).toBe(1);
    expect(result[0].idTipoTramite).toBe(80102);
  });

  it('buildComplementosTablaPayload should build array correctly', () => {
    const array = [{ rfc: 'RFC', correoElectronico: 'mail', razonSocial: 'RS', nombre: 'N', apellidoPaterno: 'AP', apellidoMaterno: 'AM', codigoPostal: 'CP', estado: 'E' }];
    const base = [{}];
    const result:any = service.buildComplementosTablaPayload(array, base);
    expect(result[0].rfc).toBe('RFC');
    expect(result[0].domicilioSolicitud.codigoPostal).toBe('CP');
    expect(result[0].domicilioSolicitud.informacionExtra).toBe('E');
  });

  it('buildAnexo should build anexo object correctly', () => {
    const data = {
      annexoDosTres: {
        anexoDosTablaLista: [{ encabezadoFraccion: 'F', encabezadoDescripcion: 'D' }],
        anexoTresTablaLista: [{ encabezadoFraccion: 'F3', encabezadoDescripcion: 'D3' }]
      },
      annexoUno: {
        proveedorClienteDatosTabla: [{
          idProveedor: 1, paisOrigen: 'MX', rfcProveedor: 'RFC', razonProveedor: 'RS', paisDestino: 'US', rfcClinte: 'RFC2', razonSocial: 'RS2', domicilio: 'DOM', testado: true, idProductoP: 2, descTestado: 'DT'
        }],
        importarDatosTabla: [{ encabezadoAnexoII: 'AII', encabezadoTipo: 'T', encabezadoCategoria: 'C', encabezadoDescripcionComercial: 'DC', encabezadoVolumenMensual: 'VM', encabezadoVolumenAnual: 'VA', encabezadoValorEnMonedaMensual: 'VMM', encabezadoValorEnMonedaAnual: 'VMA' }],
        exportarDatosTabla: [{ encabezadoFraccionExportacion: 'FE', encabezadoFraccionImportacion: 'FI', encabezadoDescripcionComercial: 'DC', encabezadoAnexoII: 'AII', encabezadoIdProducto: 1, encabezadoFraccionDescripcionAnexo: 'FDA', encabezadoValorEnMonedaAnual: 'VMA', encabezadoValorEnMonedaMensual: 'VMM', encabezadoVolumenAnual: 'VA', encabezadoCategoria: 'C', encabezadoTipo: 'T', encabezadoUmt: 'UMT' }],
        proveedorClienteDatosTablaDos: [{
          paisOrigen: 'MX', rfcProveedor: 'RFC', razonProveedor: 'RS', paisDestino: 'US', rfcClinte: 'RFC2', razonSocial: 'RS2', domicilio: 'DOM', descTestado: 'DT'
        }]
      },
      proyectoImmexTablaLista: [{
        encabezadoTipoDocument: 'TD', encabezadoDescripcionOtro: 'DO', encabezadoFechaFirma: 'FF', encabezadoFechaVigencia: 'FV', encabezadoRfc: 'RFC', encabezadoRazonFirmante: 'RF'
      }]
    };
    const result:any = service.buildAnexo(data);
    expect(result.anexo.ANEXOII.length).toBe(1);
    expect(result.anexo.ANEXOIII.length).toBe(1);
    expect(result.anexo.proveedorCliente.length).toBe(1);
    expect(result.anexo.datosParaNavegar.anexoII).toBe('AII');
    expect(result.anexo.tableDos.length).toBe(1);
    expect(result.anexo.proyectoimex.length).toBe(1);
    expect(result.anexo.proveedorClienteDos.length).toBe(1);
  });

  it('buildPlantasSubmanufactureras should build array correctly', () => {
    const base = [{ datosComplementarios: [{ idPlantaC: '1', idDato: '2', amparoPrograma: 'AP' }] }];
    const array:any = [{
      calle: 'C', numInterior: 'NI', numExterior: 'NE', codigoPostal: 'CP', colonia: 'COL', municipio: 'MUN', entidadFederativa: 'EF', pais: 'MX', rfc: 'RFC', domicilioFiscal: 'DF', razonSocial: 'RS'
    }];
    const result:any = service.buildPlantasSubmanufactureras(base, array);
    expect(result[0].empresaCalle).toBe('C');
    expect(result[0].datosComplementarios.length).toBe(1);
    expect(result[0].datosComplementarios[0].idPlantaC).toBe('1');
  });

  it('buildPlantas should build object correctly', () => {
    const array = [{ planta: 'P', calle: 'C', numeroExterior: 'NE', numeroInterior: 'NI', codigoPostal: 'CP', localidad: 'LOC', colonia: 'COL', delegacionMunicipio: 'DM', entidadFederativa: 'EF', pais: 'MX', registroFederalDeContribuyentes: 'RFC', domicilioDelSolicitante: 'DS', razonSocial: 'RS' }];
    const base = [{}];
    const data = {
      tablaDatosCapacidadInstalada: [{ FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: 'F', UMT: 'U', DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: 'D', CAPACIDAD_EFECTIVAMENTE_UTILIZADA: 'CE', CALCULO_CAPACIDAD_INSTALADA: 'CC', TURNOS: 1, HORAS_POR_TURNO: 8, CANTIDAD_EMPLEADOS: 10, CANTIDAD_MAQUINARIA: 5, DESCRIPCION_MAQUINARIA: 'DM', CAPACIDAD_INSTALADA_MENSUAL: 100, CAPACIDAD_INSTALADA_ANUAL: 1200 }],
      montosDeInversionTablaDatos: [{ PLANTA: 'P', MONTO: 1000, TIPO: 'T', DESC_TIPO: 'DT', CANTIDAD: 1, DESCRIPCION: 'D', TESTADO: '1', DESC_TESTADO: 'DT' }],
      empleadosTablaDatos: [{ PLANTA: 'P', ID_EMPLEADOS: 'ID', TOTAL: 10, DIRECTOS: 5, CEDULA_DE_CUOTAS: 'CC', FECHA_DE_CEDULA: '2024-01-01', INDIRECTOS_TEST: 5, CONTRATO: 'C', OBJETO_DEL_CONTRATO_DEL_SERVICIO: 'O', FECHA_FIRMA: '2024-01-02', FECHA_FIN_VIGENCIA: '2024-01-03', RFC: 'RFC', RAZON_SOCIAL: 'RS', TESTADO: '1', DESC_TESTADO: 'DT' }],
      complementarPlantaDatos: [{ PLANTA: 'P', DATO: 'D', PERMANECERA_MERCANCIA_PROGRAMA: 'AMP', TIPO_DOCUMENTO: 'TD', DESCRIPCION_DOCUMENTO: 'DD', DESCRIPCION_OTRO: 'DO', DOCUMENTO_RESPALDO: 'DR', DESC_DOCUMENTO_RESPALDO: 'DDR', RESPALDO_OTRO: 'RO', FECHA_DE_FIRMA: '2024-01-01', FECHA_DE_FIN_DE_VIGENCIA: '2024-01-02', FECHA_DE_FIRMA_DOCUMENTO: '2024-01-03', FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO: '2024-01-04' }],
      complementarFirmanteDatos: [{ planta: 'P', tipoFirmante: 'TF', descTipoFirmante: 'DTF' }]
    };
    const result:any = service.buildPlantas(array, base, data);
    expect(result.LISTA_CAPACIDAD.length).toBe(1);
    expect(result.MONTOS.length).toBe(1);
    expect(result.DATOS_EMPLEADOS.length).toBe(1);
    expect(result.DATOS_COMPLEMENTARIOS.length).toBe(1);
    expect(result.FIRMANTES.length).toBe(1);
  });

  it('buildDatosFederatarios should build array correctly', () => {
    const base = [{}];
    const array = [{ nombre: 'N', segundoApellido: 'SA', primerApellido: 'PA', numeroDeActa: 'NA', fechaInicioInput: '2024-01-01', numeroDeNotaria: 'NN', estado: 'E', estadoOptions: 'EO' }];
    const result:any = service.buildDatosFederatarios(base, array);
    expect(result[0].nombreNotario).toBe('N');
    expect(result[0].apellidoMaterno).toBe('SA');
    expect(result[0].fechaActa).toBe('2024-01-01');
    expect(result[0].numeroNotaria).toBe('NN');
    expect(result[0].delegacionMunicipio).toBe('EO');
  });
});