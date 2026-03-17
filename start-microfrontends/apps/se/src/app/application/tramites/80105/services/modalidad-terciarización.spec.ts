import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NuevoProgramaIndustrialService } from './modalidad-terciarización.service';
import { ComplimentosService } from '../../../shared/services/complimentos.service';
import { Tramite80101Query } from '../estados/tramite80101.query';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { PROC_80105 } from '../servers/api-route';

describe('NuevoProgramaIndustrialService', () => {
    let service: NuevoProgramaIndustrialService;
    let http: jest.Mocked<HttpClient>;
    let complimentosService: jest.Mocked<ComplimentosService>;
    let tramite80101Query: jest.Mocked<Tramite80101Query>;
    let httpService: jest.Mocked<HttpCoreService>;

    beforeEach(() => {
        http = { get: jest.fn() } as any;
        complimentosService = {
            setProcedure: jest.fn(),
            setProcedureNo: jest.fn()
        } as any;
        tramite80101Query = {
            allStoreData$: of({})
        } as any;
        httpService = { post: jest.fn() } as any;

        TestBed.configureTestingModule({
            providers: [
                NuevoProgramaIndustrialService,
                { provide: HttpClient, useValue: http },
                { provide: ComplimentosService, useValue: complimentosService },
                { provide: Tramite80101Query, useValue: tramite80101Query },
                { provide: HttpCoreService, useValue: httpService }
            ]
        });

        service = TestBed.inject(NuevoProgramaIndustrialService);
    });

    it('should be created and call setProcedure/setProcedureNo', () => {
        expect(service).toBeTruthy();
        expect(complimentosService.setProcedure).toHaveBeenCalledWith('sat-t80105');
        expect(complimentosService.setProcedureNo).toHaveBeenCalledWith('80105');
    });

    it('getDatos should return infoServicios', (done) => {
        const mockRes = { data: { infoServicios: { test: 1 } } };
        http.get.mockReturnValue(of(mockRes));
        service.getDatos().subscribe(res => {
            expect(res).toEqual({ test: 1 });
            done();
        });
    });

    it('obtenerIngresoSelectList should return dropdown data', (done) => {
        const mockRes = { code: 'ok', data: [{ id: 1 }] };
        http.get.mockReturnValue(of(mockRes));
        service.obtenerIngresoSelectList().subscribe(res => {
            expect(res).toEqual([{ id: 1 }]);
            done();
        });
    });

    it('obtenerListaEstado should return estados', (done) => {
        const mockRes = { estados: [{ id: 1 }] };
        http.get.mockReturnValue(of(mockRes));
        service.obtenerListaEstado().subscribe(res => {
            expect(res).toEqual(mockRes);
            done();
        });
    });

    it('getSubfabricantesDisponibles should return subfabricantes', (done) => {
        const mockRes = [{ id: 1 }];
        http.get.mockReturnValue(of(mockRes));
        service.getSubfabricantesDisponibles().subscribe(res => {
            expect(res).toEqual(mockRes);
            done();
        });
    });

    it('obtenerComplimentos should return datosComplimentos', (done) => {
        const mockRes = { test: 1 };
        http.get.mockReturnValue(of(mockRes));
        service.obtenerComplimentos().subscribe(res => {
            expect(res).toEqual(mockRes);
            done();
        });
    });

    it('getEstadosCatalogo should return catalogo', (done) => {
        const mockRes = { catalogo: [{ id: 1 }] };
        http.get.mockReturnValue(of(mockRes));
        service.getEstadosCatalogo().subscribe(res => {
            expect(res).toEqual(mockRes);
            done();
        });
    });

    it('getAllState should return all store data', (done) => {
        service.getAllState().subscribe(res => {
            expect(res).toEqual({});
            done();
        });
    });

    it('guardarDatosPost should call httpService.post', (done) => {
        const body = { a: 1 };
        const mockRes = { code: 'ok' };
        httpService.post.mockReturnValue(of(mockRes));
        service.guardarDatosPost(body).subscribe(res => {
            expect(httpService.post).toHaveBeenCalledWith(PROC_80105.GUARDAR, { body });
            expect(res).toEqual(mockRes);
            done();
        });
    });

    it('buildComplimentos should build correct object', () => {
        const data = {
            datosComplimentos: {
                formaModificaciones: {
                    rfc: 'RFC',
                    nombreDeActa: 'ACTA',
                    nombreDeNotaria: 'NOTARIA',
                    estado: 'JALISCO',
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
                    fechaExpedicion: '2024-01-02',
                    aceptarObligacionFiscal: true
                }
            }
        };
        const base = { notario: {} };
        const result:any = service.buildComplimentos(data, base);
        expect(result.notario.rfc).toBe('RFC');
        expect(result.booleanGenerico).toBe(true);
        expect(result.numeroPermiso).toBe('SI');
        expect(result.fechaOperacion).toContain('2024');
        expect(result.nomOficialAutorizado).toBe('FED');
    });

    it('buildSociosAccionistas should build correct array', () => {
        const arr1 = [{ nombre: 'A', estado: 'JALISCO', pais: 'MX', taxId: 'TAX', codigoPostal: '12345' }];
        const arr2 = [{ nombre: 'B', estado: 'CDMX', pais: 'MX', taxId: 'TAX2', codigoPostal: '54321' }];
        const base:any = [{}];
        const result:any = service.buildSociosAccionistas(arr1, arr2, base);
        expect(result.length).toBe(2);
        expect(result[0].nombre).toBe('A');
        expect(result[1].nombre).toBe('B');
    });

    it('buildDeclaracionSolicitudEntries should build correct array', () => {
        const data = { datosComplimentos: { obligacionesFiscales: { aceptarObligacionFiscal: true } } };
        const result:any = service.buildDeclaracionSolicitudEntries(data);
        expect(Array.isArray(result)).toBe(true);
        expect(result[0].acepto).toBe(1);
    });

    it('buildComplementosTablaPayload should build correct array', () => {
        const array = [{ rfc: 'RFC', correoElectronico: 'mail', razonSocial: 'RS', nombre: 'N', apellidoPaterno: 'AP', apellidoMaterno: 'AM', codigoPostal: 'CP', estado: 'JALISCO' }];
        const base = [{}];
        const result:any = service.buildComplementosTablaPayload(array, base);
        expect(result.length).toBe(1);
        expect(result[0].rfc).toBe('RFC');
        expect(result[0].domicilioSolicitud.codigoPostal).toBe('CP');
    });

    it('buildPlantas should build correct object', () => {
        const array = [{ planta: 'P', calle: 'C', numeroExterior: '1', numeroInterior: '2', codigoPostal: 'CP', localidad: 'L', colonia: 'COL', delegacionMunicipio: 'DM', entidadFederativa: 'EF', pais: 'MX', registroFederalDeContribuyentes: 'RFC', domicilioDelSolicitante: 'DFS', razonSocial: 'RS' }];
        const base = [{}];
        const data = {
            tablaDatosCapacidadInstalada: [{ FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: 'F', UMT: 'U', DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: 'D', CAPACIDAD_EFECTIVAMENTE_UTILIZADA: 'CE', CALCULO_CAPACIDAD_INSTALADA: 'CC', TURNOS: 1, HORAS_POR_TURNO: 8, CANTIDAD_EMPLEADOS: 10, CANTIDAD_MAQUINARIA: 5, DESCRIPCION_MAQUINARIA: 'DM', CAPACIDAD_INSTALADA_MENSUAL: 100, CAPACIDAD_INSTALADA_ANUAL: 1200 }],
            montosDeInversionTablaDatos: [{ PLANTA: 'P', MONTO: 1000, TIPO: 'T', DESC_TIPO: 'DT', CANTIDAD: 2, DESCRIPCION: 'DESC', TESTADO: '1', DESC_TESTADO: 'DT' }],
            empleadosTablaDatos: [{ PLANTA: 'P', ID_EMPLEADOS: 'ID', TOTAL: 10, DIRECTOS: 5, CEDULA_DE_CUOTAS: 'CC', FECHA_DE_CEDULA: '2024-01-01', INDIRECTOS_TEST: 2, CONTRATO: 'C', OBJETO_DEL_CONTRATO_DEL_SERVICIO: 'O', FECHA_FIRMA: '2024-01-02', FECHA_FIN_VIGENCIA: '2024-01-03', RFC: 'RFC', RAZON_SOCIAL: 'RS', TESTADO: '1', DESC_TESTADO: 'DT' }],
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

    it('buildAnexo should build correct anexo object', () => {
        const data = {
            annexoDosTres: {
                anexoDosTablaLista: [{ encabezadoFraccion: 'F', encabezadoDescripcion: 'D' }],
                anexoTresTablaLista: [{ encabezadoFraccion: 'F3', encabezadoDescripcion: 'D3' }]
            },
            annexoUno: {
                proveedorClienteDatosTabla: [{ idProveedor: 1, paisOrigen: 'MX', rfcProveedor: 'RFC', razonProveedor: 'RS', paisDestino: 'US', rfcClinte: 'RFC2', razonSocial: 'RS2', domicilio: 'DOM', testado: true, idProductoP: 2, descTestado: 'DT' }],
                importarDatosTabla: [{ encabezadoAnexoII: 'AII', encabezadoTipo: 'T', encabezadoCategoria: 'C', encabezadoDescripcionComercial: 'DC', encabezadoVolumenMensual: 10, encabezadoVolumenAnual: 100, encabezadoValorEnMonedaMensual: 1000, encabezadoValorEnMonedaAnual: 10000 }],
                exportarDatosTabla: [{ encabezadoFraccionExportacion: 'FE', encabezadoFraccionImportacion: 'FI', encabezadoDescripcionComercial: 'DC', encabezadoAnexoII: 'AII', encabezadoIdProducto: 1, encabezadoFraccionDescripcionAnexo: 'FDA', encabezadoValorEnMonedaAnual: 10000, encabezadoValorEnMonedaMensual: 1000, encabezadoVolumenMensual: 10, encabezadoVolumenAnual: 100, encabezadoCategoria: 'C', encabezadoTipo: 'T', encabezadoUmt: 'UMT' }],
                proveedorClienteDatosTablaDos: [{ paisOrigen: 'MX', rfcProveedor: 'RFC', razonProveedor: 'RS', paisDestino: 'US', rfcClinte: 'RFC2', razonSocial: 'RS2', domicilio: 'DOM', descTestado: 'DT' }]
            },
            proyectoImmexTablaLista: [{ encabezadoTipoDocument: 'TD', encabezadoDescripcionOtro: 'DO', encabezadoFechaFirma: '2024-01-01', encabezadoFechaVigencia: '2024-01-02', encabezadoRfc: 'RFC', encabezadoRazonFirmante: 'RS' }]
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
        const base = [{ datosComplementarios: [{ idPlantaC: '1', idDato: '2', amparoPrograma: 'AMP' }] }];
        const array: any = [{ calle: 'C', numInterior: 'NI', numExterior: 'NE', codigoPostal: 'CP', colonia: 'COL', municipio: 'MUN', entidadFederativa: 'EF', pais: 'MX', rfc: 'RFC', domicilioFiscal: 'DF', razonSocial: 'RS' }];
        const result:any = service.buildPlantasSubmanufactureras(base, array);
        expect(result.length).toBe(1);
        expect(result[0].empresaCalle).toBe('C');
        expect(result[0].datosComplementarios.length).toBe(1);
    });

    it('buildDatosFederatarios should build correct array', () => {
        const base = [{}];
        const array: any = [{ nombre: 'N', segundoApellido: 'SA', primerApellido: 'PA', numeroDeActa: 'NA', fechaInicioInput: '2024-01-01', numeroDeNotaria: 'NN', estado: 'EF', estadoOptions: 'DM' }];
        const result:any = service.buildDatosFederatarios(base, array);
        expect(result.length).toBe(1);
        expect(result[0].nombreNotario).toBe('N');
        expect(result[0].fechaActa).toContain('2024');
    });

    it('buildPlantasControladoras should build correct array', () => {
        const empresasSeleccionadas = [{ calle: 'C', numeroExterior: 'NE', numeroInterior: 'NI', codigoPostal: 'CP', colonia: 'COL', municipioDelegacion: 'MD', entidadFederativa: 'EF', pais: 'MX', registroFederalContribuyentes: 'RFC', razonSocial: 'RS', domicilioFiscalSolicitante: 'DFS' }];
        const basePlantas = [{}];
        const result:any = service.buildPlantasControladoras(empresasSeleccionadas, basePlantas);
        expect(result.length).toBe(1);
        expect(result[0].calle).toBe('C');
        expect(result[0].rfc).toBe('RFC');
    });
});