import { TestBed } from '@angular/core/testing';
import { NuevoProgramaIndustrialService } from './modalidad-albergue.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { ComplimentosService } from '../../../shared/services/complimentos.service';
import { Tramite80101Query } from '../estados/tramite80101.query';

jest.mock('@angular/common/http');
jest.mock('@libs/shared/data-access-user/src');
jest.mock('../../../shared/services/complimentos.service');
jest.mock('../estados/tramite80101.query');

describe('NuevoProgramaIndustrialService', () => {
    let service: NuevoProgramaIndustrialService;
    let http: jest.Mocked<HttpClient>;
    let httpService: jest.Mocked<HttpCoreService>;
    let complimentosService: jest.Mocked<ComplimentosService>;
    let tramite80101Query: jest.Mocked<Tramite80101Query>;

    beforeEach(() => {
        http = { get: jest.fn() } as any;
        httpService = { post: jest.fn() } as any;
        complimentosService = {
            setProcedure: jest.fn(),
            setProcedureNo: jest.fn()
        } as any;
        tramite80101Query = {
            allStoreData$: of({})
        } as any;

        TestBed.configureTestingModule({
            providers: [
                NuevoProgramaIndustrialService,
                { provide: HttpClient, useValue: http },
                { provide: HttpCoreService, useValue: httpService },
                { provide: ComplimentosService, useValue: complimentosService },
                { provide: Tramite80101Query, useValue: tramite80101Query }
            ]
        });
        service = TestBed.inject(NuevoProgramaIndustrialService);
    });

    it('should be created and call setProcedure/setProcedureNo', () => {
        expect(service).toBeTruthy();
        expect(complimentosService.setProcedure).toHaveBeenCalledWith('sat-t80104');
        expect(complimentosService.setProcedureNo).toHaveBeenCalledWith('80104');
    });

    it('should getDatos', (done) => {
        const mockResponse = { data: { infoServicios: { foo: 'bar' } } };
        http.get.mockReturnValue(of(mockResponse));
        service.getDatos().subscribe(res => {
            expect(res).toEqual({ foo: 'bar' });
            done();
        });
    });

    it('should obtenerIngresoSelectList', (done) => {
        const mockResponse = { data: [{ id: 1 }] };
        http.get.mockReturnValue(of(mockResponse));
        service.obtenerIngresoSelectList().subscribe(res => {
            expect(res).toEqual([{ id: 1 }]);
            done();
        });
    });

    it('should obtenerListaEstado', (done) => {
        const mockResponse = { estados: [{ id: 1 }] };
        http.get.mockReturnValue(of(mockResponse));
        service.obtenerListaEstado().subscribe(res => {
            expect(res).toEqual(mockResponse);
            done();
        });
    });

    it('should getSubfabricantesDisponibles', (done) => {
        const mockResponse = { data: [{ id: 1 }] };
        http.get.mockReturnValue(of(mockResponse));
        service.getSubfabricantesDisponibles().subscribe(res => {
            expect(res).toEqual([{ id: 1 }]);
            done();
        });
    });

    it('should obtenerComplimentos', (done) => {
        const mockResponse = { foo: 'bar' };
        http.get.mockReturnValue(of(mockResponse));
        service.obtenerComplimentos().subscribe(res => {
            expect(res).toEqual(mockResponse);
            done();
        });
    });

    it('should getAllState', (done) => {
        service.getAllState().subscribe(res => {
            expect(res).toEqual({});
            done();
        });
    });

    it('should guardarDatosPost', (done) => {
        const mockResponse = { ok: true };
        httpService.post.mockReturnValue(of(mockResponse));
        service.guardarDatosPost({ foo: 'bar' }).subscribe(res => {
            expect(res).toEqual(mockResponse);
            expect(httpService.post).toHaveBeenCalled();
            done();
        });
    });

    it('should buildComplimentos', () => {
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
        const result:any = service.buildComplimentos(data, base);
        expect(result.notario.rfc).toBe('RFC');
        expect(result.booleanGenerico).toBe(true);
        expect(result.numeroPermiso).toBe('SI');
        expect(result.fechaOperacion).toBe('2024-01-02');
        expect(result.nomOficialAutorizado).toBe('FED');
    });

    it('should buildSociosAccionistas', () => {
        const arr1 = [{ nombre: 'A', apellidoPaterno: 'B', estado: 'JAL', pais: 'MX', taxId: 'TID', codigoPostal: 'CP' }];
        const arr2 = [{ nombre: 'C', apellidoPaterno: 'D', estado: 'CDMX', pais: 'MX2', taxId: 'TID2', codigoPostal: 'CP2' }];
        const base:any = [{}];
        const result:any = service.buildSociosAccionistas(arr1, arr2, base);
        expect(result.length).toBe(2);
        expect(result[0].nombre).toBe('A');
        expect(result[1].nombre).toBe('C');
    });

    it('should buildDeclaracionSolicitudEntries', () => {
        const data = { datosComplimentos: { obligacionesFiscales: { aceptarObligacionFiscal: true } } };
        const result:any = service.buildDeclaracionSolicitudEntries(data);
        expect(result[0].acepto).toBe(1);
        expect(result[0].idTipoTramite).toBe(80104);
    });

    it('should buildComplementosTablaPayload', () => {
        const array = [{ rfc: 'RFC', correoElectronico: 'mail', razonSocial: 'RS', nombre: 'N', apellidoPaterno: 'AP', apellidoMaterno: 'AM', codigoPostal: 'CP', estado: 'EST' }];
        const base:any = [{}];
        const result:any = service.buildComplementosTablaPayload(array, base);
        expect(result.length).toBe(1);
        expect(result[0].rfc).toBe('RFC');
        expect(result[0].domicilioSolicitud.codigoPostal).toBe('CP');
    });

    it('should buildPlantas', () => {
        const array = [{ planta: 'P', calle: 'C', numeroExterior: '1', numeroInterior: '2', codigoPostal: 'CP', localidad: 'LOC', colonia: 'COL', delegacionMunicipio: 'DEL', entidadFederativa: 'EST', pais: 'MX', registroFederalDeContribuyentes: 'RFC', domicilioDelSolicitante: 'DFS', razonSocial: 'RS' }];
        const base = [{}];
        const data = {
            tablaDatosCapacidadInstalada: [{ FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO: 'F', UMT: 'U', DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO: 'D', CAPACIDAD_EFECTIVAMENTE_UTILIZADA: 'C', CALCULO_CAPACIDAD_INSTALADA: 'CC', TURNOS: 1, HORAS_POR_TURNO: 2, CANTIDAD_EMPLEADOS: 3, CANTIDAD_MAQUINARIA: 4, DESCRIPCION_MAQUINARIA: 'DM', CAPACIDAD_INSTALADA_MENSUAL: 5, CAPACIDAD_INSTALADA_ANUAL: 'CA' }],
            montosDeInversionTablaDatos: [{ PLANTA: 'P', MONTO: 1, TIPO: 'T', DESC_TIPO: 'DT', CANTIDAD: 2, DESCRIPCION: 'DESC', TESTADO: 'T', DESC_TESTADO: 'DT' }],
            empleadosTablaDatos: [{ PLANTA: 'P', ID_EMPLEADOS: 'ID', TOTAL: 10, DIRECTOS: 5, CEDULA_DE_CUOTAS: 'CED', FECHA_DE_CEDULA: '2024-01-01', INDIRECTOS_TEST: 2, CONTRATO: 'C', OBJETO_DEL_CONTRATO_DEL_SERVICIO: 'OBJ', FECHA_FIRMA: '2024-01-01', FECHA_FIN_VIGENCIA: '2024-01-02', RFC: 'RFC', RAZON_SOCIAL: 'RS', TESTADO: 'T', DESC_TESTADO: 'DT' }],
            complementarPlantaDatos: [{ PLANTA: 'P', DATO: 'D', PERMANECERA_MERCANCIA_PROGRAMA: 'AMP', TIPO_DOCUMENTO: 'TD', DESCRIPCION_DOCUMENTO: 'DD', DESCRIPCION_OTRO: 'DO', DOCUMENTO_RESPALDO: 'DR', DESC_DOCUMENTO_RESPALDO: 'DDR', RESPALDO_OTRO: 'RO', FECHA_DE_FIRMA: '2024-01-01', FECHA_DE_FIN_DE_VIGENCIA: '2024-01-02', FECHA_DE_FIRMA_DOCUMENTO: '2024-01-03', FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO: '2024-01-04' }],
            complementarFirmanteDatos: [{ planta: 'P', tipoFirmante: 'TF', descTipoFirmante: 'DTF' }]
        };
        const result:any = service.buildPlantas(array, base, data);
        expect(result['idPlanta']).toBe('P');
        expect(result['LISTA_CAPACIDAD'].length).toBe(1);
        expect(result['MONTOS'].length).toBe(1);
        expect(result['DATOS_EMPLEADOS'].length).toBe(1);
        expect(result['DATOS_COMPLEMENTARIOS'].length).toBe(1);
        expect(result['FIRMANTES'].length).toBe(1);
    });

    it('should buildAnexo', () => {
        const data = {
            annexoDosTres: {
                anexoDosTablaLista: [{ encabezadoFraccion: 'F', encabezadoDescripcion: 'D' }],
                anexoTresTablaLista: [{ encabezadoFraccion: 'F3', encabezadoDescripcion: 'D3' }]
            },
            annexoUno: {
                proveedorClienteDatosTabla: [{ idProveedor: 1, paisOrigen: 'MX', rfcProveedor: 'RFC', razonProveedor: 'RS', paisDestino: 'US', rfcClinte: 'RFC2', razonSocial: 'RS2', domicilio: 'DOM', testado: true, idProductoP: 2, descTestado: 'DT' }],
                importarDatosTabla: [{ encabezadoAnexoII: 'AII', encabezadoTipo: 'T', encabezadoCategoria: 'C', encabezadoDescripcionComercial: 'DC', encabezadoVolumenMensual: 'VM', encabezadoVolumenAnual: 'VA', encabezadoValorEnMonedaMensual: 'VMM', encabezadoValorEnMonedaAnual: 'VMA' }],
                exportarDatosTabla: [{ encabezadoFraccionExportacion: 'FE', encabezadoFraccionImportacion: 'FI', encabezadoDescripcionComercial: 'DC', encabezadoAnexoII: 'AII', encabezadoIdProducto: 1, encabezadoFraccionDescripcionAnexo: 'FDA', encabezadoValorEnMonedaAnual: 'VMA', encabezadoValorEnMonedaMensual: 'VMM', encabezadoVolumenMensual: 'VM', encabezadoVolumenAnual: 'VA', encabezadoCategoria: 'C', encabezadoTipo: 'T', encabezadoUmt: 'U' }],
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

    it('should buildPlantasSubmanufactureras', () => {
        const base = [{}];
        const array = [{
            calle: 'C', numInterior: 'NI', numExterior: 'NE', codigoPostal: 'CP', colonia: 'COL', municipio: 'MUN', entidadFederativa: 'EST', pais: 'MX', rfc: 'RFC', domicilioFiscal: 'DF', razonSocial: 'RS'
        }];
        const result:any = service.buildPlantasSubmanufactureras(base, array as any);
        expect(result.length).toBe(1);
        expect(result[0]['empresaCalle']).toBe('C');
    });

    it('should buildDatosFederatarios', () => {
        const base = [{}];
        const array = [{
            nombre: 'N', segundoApellido: 'SA', primerApellido: 'PA', numeroDeActa: 'NA', fechaInicioInput: '2024-01-01', numeroDeNotaria: 'NN', estado: 'EST', estadoOptions: 'EO'
        }];
        const result:any = service.buildDatosFederatarios(base, array);
        expect(result.length).toBe(1);
        expect(result[0]['nombreNotario']).toBe('N');
        expect(result[0]['fechaActa']).toBe('2024-01-01');
    });

    it('should buildPlantasControladoras', () => {
        const empresasSeleccionadas = [{
            calle: 'C', numeroExterior: '1', numeroInterior: '2', codigoPostal: 'CP', colonia: 'COL', municipioDelegacion: 'MD', entidadFederativa: 'EST', pais: 'MX', registroFederalContribuyentes: 'RFC', razonSocial: 'RS', domicilioFiscalSolicitante: 'DFS'
        }];
        const basePlantas = [{}];
        const result:any = service.buildPlantasControladoras(empresasSeleccionadas, basePlantas);
        expect(result.length).toBe(1);
        expect(result[0]['calle']).toBe('C');
        expect(result[0]['razonSocial']).toBe('RS');
    });
});