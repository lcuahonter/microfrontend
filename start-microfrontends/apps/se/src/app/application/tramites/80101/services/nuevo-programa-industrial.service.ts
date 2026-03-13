import {
  Anexo1,
  InfoServicios,
  ProveedorClienteDatosTabla,
  Servicio
} from '../models/nuevo-programa-industrial.model';
import { AnexoDosEncabezado, AnexoEncabezado, AnexoUnoEncabezado, DatosAnexotressUno, ProveedorClienteTabla, ProyectoImmexEncabezado } from '../../../shared/models/nuevo-programa-industrial.model';
import {
  Catalogo,
  JSONResponse,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoDatosIdx, FederatariosEncabezado, PlantasImmex } from '../../../shared/models/federatarios-y-plantas.model';
import { DatosComplimentos, SociaoAccionistas } from '../../../shared/models/complimentos.model';
import {
  HttpCoreService,
  formatearFechaDdMmYyyy,
  formatearFechaYyyyMmDd,
} from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  Tramite80101State,
  Tramite80101Store,
} from '../estados/tramite80101.store';
import { API_ROUTES } from '../../../shared/servers/api-route';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { BehaviorSubject } from 'rxjs';
import { CadenaOriginalRequest } from '../../130118/model/request/cadena-original-request.model';
import { ComplimentosService } from '../../../shared/services/complimentos.service';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80101 } from '../servers/api-route';
import { PlantasSubfabricante } from '../../../shared/models/empresas-subfabricanta.model';
import { ServicioDeFormularioService } from '../../../shared/services/forma-servicio/servicio-de-formulario.service';
import { Tramite80101Query } from '../estados/tramite80101.query';
// Interfaz para el método de servicio interno
  interface CapacidadInstaladaItem {
    FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO?: string;
    UMT?: string;
    DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO?: string;
    CAPACIDAD_EFECTIVAMENTE_UTILIZADA?: string;
    CALCULO_CAPACIDAD_INSTALADA?: string;
    TURNOS?: number | string;
    HORAS_POR_TURNO?: number | string;
    CANTIDAD_EMPLEADOS?: number | string;
    CANTIDAD_MAQUINARIA?: number | string;
    DESCRIPCION_MAQUINARIA?: string;
    CAPACIDAD_INSTALADA_MENSUAL?: number | string;
    CAPACIDAD_INSTALADA_ANUAL?: string;
  }

  interface MontoInversionItem {
    PLANTA?: string;
    MONTO?: number | string;
    TIPO?: string;
    DESC_TIPO?: string;
    CANTIDAD?: number | string;
    DESCRIPCION?: string;
    TESTADO?: string;
    DESC_TESTADO?: string;
  }

  interface EmpleadoItem {
    PLANTA?: string;
    ID_EMPLEADOS?: string | number;
    TOTAL?: string | number;
    DIRECTOS?: string | number;
    CEDULA_DE_CUOTAS?: string;
    FECHA_DE_CEDULA?: string;
    INDIRECTOS_TEST?: string | number;
    CONTRATO?: string;
    OBJETO_DEL_CONTRATO_DEL_SERVICIO?: string;
    FECHA_FIRMA?: string;
    FECHA_FIN_VIGENCIA?: string;
    RFC?: string;
    RAZON_SOCIAL?: string;
    TESTADO?: string;
    DESC_TESTADO?: string;
  }

  interface ComplementarItem {
    PLANTA?: string;
    DATO?: string;
    PERMANECERA_MERCANCIA_PROGRAMA?: string;
    TIPO_DOCUMENTO?: string;
    DESCRIPCION_DOCUMENTO?: string;
    DESCRIPCION_OTRO?: string;
    DOCUMENTO_RESPALDO?: string;
    DESC_DOCUMENTO_RESPALDO?: string;
    RESPALDO_OTRO?: string;
    FECHA_DE_FIRMA?: string;
    FECHA_DE_FIN_DE_VIGENCIA?: string;
    FECHA_DE_FIRMA_DOCUMENTO?: string;
    FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO?: string;
  }

  interface FirmanteItem {
    planta?: string;
    tipoFirmante?: string;
    descTipoFirmante?: string;
  }

    interface AnexoDosItem {
      encabezadoFraccionExportacion?: string;
      encabezadoFraccionImportacion?: string;
      encabezadoDescripcionComercial?: string;
      encabezadoAnexoII?: string;
      encabezadoIdProducto?: string;
      encabezadoFraccionDescripcionAnexo?: string;
      encabezadoValorEnMonedaAnual?: string;
      encabezadoValorEnMonedaMensual?: string;
      encabezadoVolumenMensual?: string;
      encabezadoVolumenAnual?: string;
      encabezadoCategoria?: string;
      encabezadoTipo?: string;
      encabezadoUmt?: string;
    }

  interface DatosParaNavegar {
      encabezadoAnexoII?: string;
      encabezadoTipo?: string;
      encabezadoCategoria?: string;
      encabezadoDescripcionComercial?: string;
      encabezadoVolumenMensual?: string;
      encabezadoVolumenAnual?: string;
      encabezadoValorEnMonedaMensual?: string;
      encabezadoValorEnMonedaAnual?: string;
    }
/**
 * Servicio para gestionar las operaciones relacionadas con el programa industrial.
 * Este servicio proporciona métodos para obtener datos desde archivos JSON locales,
 * actualizar el estado del formulario y realizar otras operaciones relacionadas con el programa industrial.
 */
@Injectable({
  providedIn: 'root',
})
export class NuevoProgramaIndustrialService {
  /**
   * Subject que mantiene el estado actual sobre si la tabla tiene datos.
   * Permite la suscripción reactiva a los cambios en la presencia de datos en la tabla.
   */
  private _tieneDatosDeTabla$ = new BehaviorSubject<boolean>(false);

  /**
   * Observable que expone el estado de si la tabla tiene datos.
   * Se utiliza para que otros componentes puedan reaccionar a los cambios sin modificar el estado directamente.
   */
  public tieneDatosDeTabla$ = this._tieneDatosDeTabla$.asObservable();

  /**
   * Constructor de la clase NuevoProgramaIndustrialService.
   *
   * @param http - Cliente HTTP utilizado para realizar solicitudes HTTP al servidor.
   */
  constructor(
    private readonly http: HttpClient,
    public tramite80101Store: Tramite80101Store,
    public httpService: HttpCoreService,
    private Tramite80101Query: Tramite80101Query,
    private servicioDeFormularioService: ServicioDeFormularioService,
    private complimentosService: ComplimentosService
  ) {
    // No se necesita lógica de inicialización adicional.
    this.setProcedure();
    this.setProcedureNo();
  }

  setProcedureNo(): void {
    this.complimentosService.setProcedureNo('80101');
  }

  /**
   * Actualiza el estado interno indicando si la tabla tiene datos.
   * Emite el nuevo valor a todos los suscriptores del observable correspondiente.
   */
  setTieneDatosDeTabla(value: boolean): void {
    this._tieneDatosDeTabla$.next(value);
  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @returns {Observable<any>} - Observable con los datos obtenidos.
   */
  getDatos(): Observable<InfoServicios> {
    return (
      this.http
        .get<Servicio[]>('assets/json/80205/ampliacion-servicios.json')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((res: any) => res.data.InfoServicios))
    );
  }

  /**
   * Obtiene la lista de selección de ingreso desde un archivo JSON.
   * @returns {Observable<any>} - Observable con los datos obtenidos.
   */
  obtenerIngresoSelectList(): Observable<Catalogo[]> {
    return (
      this.http
        .get<Catalogo[]>('assets/json/80205/ampliacion-IMMEX-dropdown.json')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((res: any) => res.data))
    );
  }

  /**
   * Obtiene la lista de estados.
   * @method obtenerListaEstado
   * @returns {Observable<RespuestaCatalogos>} Observable con la lista de estados.
   */
  obtenerListaEstado(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/80207/estado-datos.json'
    );
  }

  /**
   * Obtiene la lista de subfabricantes disponibles.
   * @method getSubfabricantesDisponibles
   * @returns {Observable<TableData>} Observable con la lista de subfabricantes disponibles.
   */
  getSubfabricantesDisponibles(): Observable<PlantasSubfabricante[]> {
    return this.http
      .get<PlantasSubfabricante[]>(
        'assets/json/80207/submanufactureras-disponibles-datos.json'
      )

      .pipe(map((response: PlantasSubfabricante[]) => response));
  }

  /**
   * Obtiene la cadena original del trámite 130118.
   * @param body Objeto que contiene los datos necesarios para generar la cadena original.
   * @returns Un observable que emite la respuesta del servidor con la cadena original.
   */
  obtenerCadenaOriginal<T>(
    idSolicitud: string,
    body: CadenaOriginalRequest
  ): Observable<BaseResponse<T>> {
    return this.http
      .post<BaseResponse<T>>(
        PROC_80101.API_POST_CADENA_ORIGINAL(idSolicitud),
        body
      )
      .pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(
            `Error al obtener la cadena original en ${PROC_80101.API_POST_CADENA_ORIGINAL(
              idSolicitud
            )}`
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * Envía una solicitud de firma electrónica.
   * @param idSolicitud - ID de la solicitud a firmar.
   * @param body - Cuerpo de la solicitud de firma.
   * @returns Observable con la respuesta del servidor.
   */
  enviarFirma<T>(
    idSolicitud: string | number,
    body: FirmarRequest
  ): Observable<BaseResponse<T>> {
    return this.http
      .post<BaseResponse<T>>(
        PROC_80101.API_POST_FIRMA(String(idSolicitud)),
        body
      )
      .pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(
            `Error al firmar solicitud con ID ${idSolicitud}`
          );
          return throwError(() => ERROR);
        })
      );
  }

  /**
   * Obtiene los datos de complementos desde un archivo JSON local.
   *
   * @returns Un observable que emite los datos de tipo `DatosComplimentos`.
   */
  obtenerComplimentos(): Observable<DatosComplimentos> {
    return (
      this.http
        .get<DatosComplimentos>('assets/json/80102/datos-complimentos.json')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .pipe(map((res: any) => res))
    );
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param DATOS - Estado de la solicitud `Solicitud230401State` con la información del tipo de solicitud a actualizar en el store.
   */
  actualizarEstadoFormulario(DATOS: any): void {
    this.setComplimentos(DATOS);
    this.setFederatarios(DATOS);
    this.setEmpresasSubmanufactureras(DATOS);
    this.setAnexoI(DATOS);
    this.setAnexoIIyIII(DATOS);
    this.servicioDeFormularioService.pushToArray('federatariosDatos', DATOS.solicitud.notario);
  }

  setComplimentos(DATOS: unknown): void {
    const DATOS_COMPLIMENTOS = this.reverseBuildComplimentos(DATOS) as DatosComplimentos;
    this.tramite80101Store.setDatosComplimentos(DATOS_COMPLIMENTOS);
    const SOCIOS_ACCIONISTAS = this.reverseBuildSociosAccionistas((DATOS as { sociosAccionistas?: unknown[] }).sociosAccionistas ?? []) as { ARR1: SociaoAccionistas[]; ARR2: SociaoAccionistas[] };
    SOCIOS_ACCIONISTAS.ARR1.forEach((ele: SociaoAccionistas) => {
      this.tramite80101Store.aggregarTablaDatosComplimentos(ele);
    });
    SOCIOS_ACCIONISTAS.ARR2.forEach((ele: SociaoAccionistas) => {
      this.tramite80101Store.aggregarTablaDatosComplimentosExtranjera(ele);
    });
  }

  setFederatarios(DATOS: unknown): void {
    if (
      typeof DATOS === 'object' &&
      DATOS !== null &&
      'solicitud' in DATOS &&
      typeof (DATOS as any).solicitud === 'object' &&
      (DATOS as any).solicitud !== null &&
      'notario' in (DATOS as any).solicitud
    ) {
      const notarioData = (DATOS as any).solicitud.notario;
      const NOTARIOS = this.reverseBuildDatosFederatarios(Array.isArray(notarioData) ? notarioData : [notarioData]);
      this.complimentosService.federatariosEncabezado = NOTARIOS;
      NOTARIOS.forEach((ele: FederatariosEncabezado) => {
        
        this.tramite80101Store.setFederatarios(ele);
      });
    }

    if (typeof DATOS === 'object' && DATOS !== null && 'planta' in DATOS) {
      const PLANTAS = this.reverseBuildPlantas((DATOS as { planta?: unknown[] }).planta ?? []);
      this.tramite80101Store.setPlantasImmexTablaLista(PLANTAS);
    }
  }

  setEmpresasSubmanufactureras(DATOS: unknown): void {
    if (typeof DATOS === 'object' && DATOS !== null && 'plantasSubmanufactureras' in DATOS) {
      const PLANTAS_SUBMANUFACTURERAS = this.reverseBuildPlantasSubmanufactureras((DATOS as { plantasSubmanufactureras?: unknown[] }).plantasSubmanufactureras ?? []);
      this.tramite80101Store.setPlantasSubfabricantesAgregar(PLANTAS_SUBMANUFACTURERAS);
    }
  }

  setAnexoI(DATOS: unknown): void {
    if (typeof DATOS === 'object' && DATOS !== null && 'mercanciaImportacion' in DATOS) {
      const MERCANCIA_IMPORTACION = (DATOS as { mercanciaImportacion?: unknown[] }).mercanciaImportacion ?? [];
      const ANEXO_TABLA_UNO = this.reverseBuildDatosParaNavegar(
        MERCANCIA_IMPORTACION[0] && typeof MERCANCIA_IMPORTACION[0] === 'object' && MERCANCIA_IMPORTACION[0] !== null && 'complemento' in MERCANCIA_IMPORTACION[0]
          ? MERCANCIA_IMPORTACION[0].complemento
          : {}
      );
      this.tramite80101Store.setImportarDatosTabla(ANEXO_TABLA_UNO);
      const ANEXO_TABLA_DOS = this.reverseBuildAnexoDos(
        MERCANCIA_IMPORTACION[0] && typeof MERCANCIA_IMPORTACION[0] === 'object' && 'anexoI' in MERCANCIA_IMPORTACION[0]
          ? (MERCANCIA_IMPORTACION[0].anexoI as unknown[])
          : []
      );
      this.tramite80101Store.setExportarDatosTabla(ANEXO_TABLA_DOS);
      const LISTA_PROVEEDORES_CLIENT = 
        MERCANCIA_IMPORTACION[0] &&
        typeof MERCANCIA_IMPORTACION[0] === 'object' &&
        'listaProveedores' in MERCANCIA_IMPORTACION[0]
          ? this.reverseBuildProveedorCliente((MERCANCIA_IMPORTACION[0] as { listaProveedores?: unknown[] }).listaProveedores ?? [])
          : [];
      this.tramite80101Store.setProveedorClienteDatosTablaUno(LISTA_PROVEEDORES_CLIENT);
        const LISTA_PROVEEDORES_CLIENT_DOS = this.reverseProveedoresClientDos(
        ((DATOS as unknown as { fraccionArancelaria?: { listaProveedores?: unknown[] }[] })?.fraccionArancelaria?.[0]?.listaProveedores ?? [])
      );
      this.tramite80101Store.setProveedorClienteDatosTablaDos(LISTA_PROVEEDORES_CLIENT_DOS);
      const PROYECTO_IMMEX = this.reverseProyectoIMMEX(
        (DATOS as unknown as { productoExportacionDtoList?: { proyectosImmex?: unknown[] }[] })?.productoExportacionDtoList?.[0]?.proyectosImmex ?? []
      );
      this.tramite80101Store.setProyectoImmexTablaLista(PROYECTO_IMMEX);
    }
  }

  setAnexoIIyIII(DATOS: unknown): void {
    if (typeof DATOS === 'object' && DATOS !== null && 'anexoII' in DATOS) {
      const ANEXO_II = this.reverseBuildAnexoDosTres((DATOS as { anexoII?: unknown[] }).anexoII ?? []);
      this.tramite80101Store.setAnnexoDosTableLista(ANEXO_II);
      const ANEXO_III = this.reverseBuildAnexoDosTres((DATOS as { anexoIII?: unknown[] }).anexoIII ?? []);
      this.tramite80101Store.setAnnexoTresTableLista(ANEXO_III);
    }
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns Observable con los datos del estado de la solicitud `Solicitud230401State`,
   *          cargados desde el archivo JSON especificado en la ruta de `assets`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite80101State> {
    return this.http.get<Tramite80101State>(
      'https://api-v30.cloud-ultrasist.net/api/sat-t80101/solicitud/mostrar?idSolicitud=203013327'
    );
  }

  /**
   * Obtiene los datos del catálogo de federatarios y plantas desde un archivo JSON local.
   *
   * Este método realiza una solicitud HTTP GET para recuperar los datos del catálogo
   * almacenados en el archivo `federatarios-y-plantas-catalogos.json` ubicado en la
   * carpeta de activos (`assets/json/80101/`). Los datos recuperados se devuelven como
   * un observable de tipo `CatalogoDatosIdx`.
   *
   * @returns {Observable<CatalogoDatosIdx>} Un observable que emite los datos del catálogo
   * de federatarios y plantas.
   *
   * @example
   * this.nuevoProgramaIndustrialService.getFederataiosyPlantaCatalogosData()
   *   .subscribe((datos: CatalogoDatosIdx) => {
   *     console.log('Datos del catálogo:', datos);
   *   });
   *
   * @remarks
   * Este método es útil para cargar información estática de catálogos que se utiliza
   * en la aplicación, como listas de federatarios y plantas. Asegúrese de que el archivo
   * JSON exista en la ubicación especificada para evitar errores de carga.
   */
  getFederataiosyPlantaCatalogosData(): Observable<CatalogoDatosIdx> {
    return this.http.get<CatalogoDatosIdx>(
      'assets/json/80101/federatarios-y-plantas-catalogos.json'
    );
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Tramite80101State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite80101State> {
    return this.Tramite80101Query.allStoreData$;
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_80101.GUARDAR, { body: body });
  }

  /**
   * Establece el procedimiento actual para la gestión de trámites industriales.
   * Asigna el identificador de procedimiento 'st_t80101' y lo configura en el servicio de cumplimientos.
   *
   * @returns {void} No retorna ningún valor.
   */
  setProcedure(): void {
    const PROCEDURE = 'sat-t80101';
    this.complimentosService.setProcedure(PROCEDURE);
  }

  /** Realiza una solicitud POST para obtener los datos de la solicitud seleccionada desde el servidor. */
  fetchMostrarDatos(body: {idSolicitud: number; idSolicitudSeleccionada: string}): Observable<unknown> {
    return this.httpService.post<{ idSolicitud: number; idSolicitudSeleccionada: string }>(PROC_80101.MOSTRAR, { body: body });
  }

  /**
   * Construye un arreglo de socios/accionistas a partir de dos listas de entrada,
   * utilizando un objeto base como plantilla y datos complementarios para completar
   * los campos faltantes.
   *
   * @param data Primer arreglo de socios/accionistas.
   * @param base Objeto base que sirve de plantilla para cada elemento del resultado.
   *
   * @returns Un nuevo arreglo que contiene los objetos combinados y mapeados
   *          con la información de los dos arreglos de entrada.
   *
   * @example
   * const socios = buildSociosAccionistas(listaA, listaB, BASE, datos);
   */
   buildComplimentos(data: Record<string, unknown>, base: Record<string, unknown>): Record<string, unknown> {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid data type for buildComplimentos');
    }
    const DATOS_COMPLIMENTOS = (data as Record<string, unknown>)['datosComplimentos'] as DatosComplimentos;
    return {
      ...base,
      notario: {
        ...(typeof base['notario'] === 'object' && base['notario'] !== null ? base['notario'] : {}),
        rfc: DATOS_COMPLIMENTOS.formaModificaciones.rfc,
        numeroActa: DATOS_COMPLIMENTOS.formaModificaciones.nombreDeActa,
        numeroNotario:
          DATOS_COMPLIMENTOS.formaModificaciones.nombreDeNotaria,
        entidadFederativa: DATOS_COMPLIMENTOS.formaModificaciones.estado,
        fechaActa: formatearFechaYyyyMmDd(
          DATOS_COMPLIMENTOS.formaModificaciones.fechaDeActa
        ),
      },
      modalidad: DATOS_COMPLIMENTOS.modalidad,
      booleanGenerico: DATOS_COMPLIMENTOS.programaPreOperativo
        ? true
        : false,
      descripcionSistemasMedicion:
        DATOS_COMPLIMENTOS.datosGeneralis.paginaWWeb,
      descripcionLugarEmbarque:
        DATOS_COMPLIMENTOS.datosGeneralis.localizacion,
      capacidadAlmacenaje:
        DATOS_COMPLIMENTOS.formaModificaciones.nombreDeNotaria,
      numeroPermiso:
        DATOS_COMPLIMENTOS.obligacionesFiscales.opinionPositiva === '1'
          ? 'SI'
          : '',
      fechaOperacion: formatearFechaYyyyMmDd(
        DATOS_COMPLIMENTOS.obligacionesFiscales.fechaExpedicion
      ),
      nomOficialAutorizado:
        DATOS_COMPLIMENTOS.formaModificaciones.nombreDelFederatario,
    };
  }

  /** Construye el arreglo de declaraciones de solicitud a partir de los datos proporcionados. */
   buildDeclaracionSolicitudEntries(data: Record<string, unknown>): unknown[] {
      const DATOS_COMPLIMENTOS = (data as { datosComplimentos?: { obligacionesFiscales?: { aceptarObligacionFiscal?: boolean } } }).datosComplimentos;
      const ACEPTO = DATOS_COMPLIMENTOS?.obligacionesFiscales?.aceptarObligacionFiscal ? 1 : 0;
      const RESULT = [
        {
          ACEPTO,
          idTipoTramite: 80101,
          cveDeclaracion: '123',
        },
      ];
      return RESULT;
  }

  /**
   * Construye un arreglo de socios/accionistas a partir de dos listas de entrada,
   * utilizando un objeto base como plantilla y datos complementarios para completar
   * los campos faltantes.
   *
   * @param arr1 Primer arreglo de socios/accionistas.
   * @param arr2 Segundo arreglo de socios/accionistas.
   * @param base Objeto base que sirve de plantilla para cada elemento del resultado.
   * @param data Objeto con datos complementarios necesarios para completar el payload.
   *
   * @returns Un nuevo arreglo que contiene los objetos combinados y mapeados
   *          con la información de los dos arreglos de entrada.
   *
   * @example
   * const socios = buildSociosAccionistas(listaA, listaB, BASE, datos);
   */
  buildSociosAccionistas(
    arr1: unknown[],
    arr2: unknown[],
    base: Record<string, unknown> = {}
  ): Record<string, unknown>[] {
    const BASE_OBJECT = Array.isArray(base) ? base[0] : base;
    const CLONED_BASE = typeof structuredClone === 'function'
      ? structuredClone(BASE_OBJECT)
      : JSON.parse(JSON.stringify(BASE_OBJECT));
    const MAP_TO_PAYLOAD = (
      item: Record<string, unknown>
    ): Record<string, unknown> => ({
      ...CLONED_BASE,
      nombre: item['nombre'] ?? '',
      apellidoPaterno: item['apellidoPaterno'] ?? '',
      apellidoMaterno: item['apellidoMaterno'] ?? '',
      rfc: item['rfc'] ?? '',
      correoElectronico: item['correoElectronico'] ?? '',
      razonSocial: item['razonSocial'] ?? '',
      estadoEvaluacionEntidad: item['estado'] ?? '',
      estadoEntidad: item['estado'] ?? '',
      cvePaisOrigen: item['pais'] ?? '',
      rfcExtranjero: item['taxId'] ?? '',
      domicilio: {
        codigoPostal: item['codigoPostal'] ?? '',
      },
    });

    return [
      ...arr1.map((item) => MAP_TO_PAYLOAD(item as Record<string, unknown>)),
      ...arr2.map((item) => MAP_TO_PAYLOAD(item as Record<string, unknown>))
    ];
  }

  /**
   * Construye un arreglo de objetos de plantas basado en una estructura base común.
   *
   * @param arr Arreglo de datos de entrada para cada planta.
   * @param base Objeto base que se combina con los datos específicos de cada planta.
   * @returns Un nuevo arreglo de objetos con la información estructurada de cada planta.
   */
  buildPlantas(array: unknown[], base: unknown[], data: unknown = {}): unknown {
    const MAP_CAPACIDAD_INSTALADA = (item: CapacidadInstaladaItem): unknown => ({
      fraccion: item.FRACCION_ARANCELARIA_PRODUCTO_TERMINADO_CATLOGO ?? "",
      umt: item.UMT ?? "",
      descripcion: item.DESCRIPCION_COMERCIAL_PRODUCTO_TERMINADO ?? "",
      capacidadEfectiva: item.CAPACIDAD_EFECTIVAMENTE_UTILIZADA ?? "",
      calculo: item.CALCULO_CAPACIDAD_INSTALADA ?? "",
      turnos: (item.TURNOS ?? "").toString(),
      horasTurno: (item.HORAS_POR_TURNO ?? "").toString(),
      cantidadEmpleados: (item.CANTIDAD_EMPLEADOS ?? "").toString(),
      cantidadMaquinaria: (item.CANTIDAD_MAQUINARIA ?? "").toString(),
      descripcionMaquinaria: item.DESCRIPCION_MAQUINARIA ?? "",
      capacidadMensual: (item.CAPACIDAD_INSTALADA_MENSUAL ?? "").toString(),
      capacidadAnual: item.CAPACIDAD_INSTALADA_ANUAL ?? "",
      testado: "1",
    });

    const MAP_MONTOS_INVERSION = (item: MontoInversionItem): unknown => ({
      idPlantaM: item.PLANTA ?? "",
      idMonto: (item.MONTO ?? "").toString(),
      tipo: item.TIPO ?? "",
      descTipo: item.DESC_TIPO ?? "",
      cantidad: (item.CANTIDAD ?? "").toString(),
      descripcion: item.DESCRIPCION ?? "",
      monto: (item.MONTO ?? "").toString(),
      testado: item.TESTADO ?? "",
      descTestado: item.DESC_TESTADO ?? "",
    })

    const MAP_EMPLEADOS = (item: EmpleadoItem): unknown => ({
      idPlantaE: item.PLANTA ?? '',
      idEmpleados: item.ID_EMPLEADOS ?? '',
      totalEmpleados: (item.TOTAL ?? '').toString(),
      directos: item.DIRECTOS ?? '',
      cedula: item.CEDULA_DE_CUOTAS ?? '',
      fechaCedula: formatearFechaYyyyMmDd(item.FECHA_DE_CEDULA ?? ''),
      indirectos: item.INDIRECTOS_TEST ?? '',
      contrato: item.CONTRATO ?? '',
      objetoContrato: item.OBJETO_DEL_CONTRATO_DEL_SERVICIO ?? '',
      fechaFirma: formatearFechaYyyyMmDd(item.FECHA_FIRMA ?? ''),
      fechaFinVigencia: formatearFechaYyyyMmDd(item.FECHA_FIN_VIGENCIA ?? ''),
      rfcEmpresa: item.RFC ?? '',
      razonEmpresa: item.RAZON_SOCIAL ?? '',
      testado: item.TESTADO ?? '',
      descTestado: item.DESC_TESTADO ?? '',
    })

    const MAP_COMPLEMENTAR = (item: ComplementarItem): unknown => ({
      idPlantaC: item.PLANTA ?? '' ,
      idDato: item.DATO ?? '',
      amparoPrograma: item.PERMANECERA_MERCANCIA_PROGRAMA ?? '',
      tipoDocumento: item.TIPO_DOCUMENTO ?? '',
      descDocumento: item.DESCRIPCION_DOCUMENTO ?? '',
      descripcionOtro: item.DESCRIPCION_OTRO ?? '',
      documentoRespaldo: item.DOCUMENTO_RESPALDO ?? '',
      descDocRespaldo: item.DESC_DOCUMENTO_RESPALDO ?? '',
      respaldoOtro: item.RESPALDO_OTRO ?? '',
      fechaFirma: formatearFechaYyyyMmDd(item.FECHA_DE_FIRMA ?? ''),
      fechaVigencia: formatearFechaYyyyMmDd(item.FECHA_DE_FIN_DE_VIGENCIA ?? ''),
      fechaFirmaRespaldo: item.FECHA_DE_FIRMA_DOCUMENTO ?? '',
      fechaVigenciaRespaldo: item.FECHA_DE_FIN_DE_VIGENCIA_DOCUMENTO ?? ''
    })


    const MAP_FIRMANTES = (item: FirmanteItem): unknown => ({
      idPlantaF: item.planta ?? '',
      tipoFirmante: item.tipoFirmante ?? '',
      descTipoFirmante: item.descTipoFirmante ?? '',
    })
 
    const LISTA_CAPACIDAD = ((data as { tablaDatosCapacidadInstalada?: CapacidadInstaladaItem[] }).tablaDatosCapacidadInstalada || []).map(MAP_CAPACIDAD_INSTALADA);
    const MONTOS = ((data as { montosDeInversionTablaDatos?: MontoInversionItem[] }).montosDeInversionTablaDatos || []).map(MAP_MONTOS_INVERSION);
    const DATOS_EMPLEADOS = ((data as { empleadosTablaDatos?: EmpleadoItem[] }).empleadosTablaDatos || []).map(MAP_EMPLEADOS);
    const DATOS_COMPLEMENTARIOS = ((data as { complementarPlantaDatos?: ComplementarItem[] }).complementarPlantaDatos || []).map(MAP_COMPLEMENTAR);
    const FIRMANTES = ((data as { complementarFirmanteDatos?: FirmanteItem[] }).complementarFirmanteDatos || []).map(MAP_FIRMANTES);
 
    const RESULT: unknown[] = [];
    array.forEach(arr => {
      const PLANTA_OBJ = arr as { 
        planta?: string; 
        calle?: string; 
        numeroExterior?: string; 
        numeroInterior?: string; 
        codigoPostal?: string; 
        localidad?: string; 
        colonia?: string; 
        delegacionMunicipio?: string; 
        entidadFederativa?: string; 
        pais?: string; 
        registroFederalDeContribuyentes?: string; 
        domicilioDelSolicitante?: string; 
        razonSocial?: string;
      };
      base.forEach(item => {
        const ITEM = (item && typeof item === 'object') ? item : {};
        RESULT.push({
          ...ITEM,
          idPlanta: PLANTA_OBJ.planta ?? '',
          calle: PLANTA_OBJ.calle ?? '',
          numeroExterior: PLANTA_OBJ.numeroExterior ?? '',
          numeroInterior: PLANTA_OBJ.numeroInterior ?? '',
          codigoPostal: PLANTA_OBJ.codigoPostal ?? '',
          localidad: PLANTA_OBJ.localidad ?? '',
          colonia: PLANTA_OBJ.colonia ?? '',
          delegacionMunicipio: PLANTA_OBJ.delegacionMunicipio ?? '',
          entidadFederativa: PLANTA_OBJ.entidadFederativa ?? '',
          pais: PLANTA_OBJ.pais ?? '',
          rfc: PLANTA_OBJ.registroFederalDeContribuyentes ?? '',
          domicilioFiscal: PLANTA_OBJ.domicilioDelSolicitante ?? '',
          razonSocial: PLANTA_OBJ.razonSocial ?? '',
        });
      });
    });
    const RESULT_DATA = { ...(typeof RESULT[0] === 'object' && RESULT[0] !== null ? RESULT[0] : {}), LISTA_CAPACIDAD, MONTOS, DATOS_EMPLEADOS, DATOS_COMPLEMENTARIOS, FIRMANTES };
    return RESULT_DATA;
  }

  /**
   * Construye un arreglo de objetos con los datos de plantas submanufactureras a partir de un arreglo de entrada.
   *
   * @param arr Arreglo de objetos con datos de entrada (opcional).
   * @param base Objeto base que se fusiona con los datos específicos de cada planta.
   * @returns Un arreglo con los objetos estructurados de plantas submanufactureras.
   */
  buildPlantasSubmanufactureras(base: unknown[], array: PlantasSubfabricante[] = []): unknown[] {
    const RESULT: unknown[] = [];
    array.forEach((arr) => {
      base.forEach((item) => {
        const ITEM = item && typeof item === 'object' ? item : {};
        RESULT.push({
          ...ITEM,
          empresaCalle: arr.calle ?? '',
          empresaNumeroInterior: arr.numInterior ?? '',
          empresaNumeroExterior: arr.numExterior ?? '',
          empresaCodigoPostal: arr.codigoPostal ?? '',
          localidad: arr.colonia ?? '',
          empresaDelegacionMunicipio: arr.municipio ?? '',
          empresaEntidadFederativa: arr.entidadFederativa ?? '',
          empresaPais: arr.pais ?? '',
          rfc: arr.rfc ?? '',
          domicilioFiscal: arr.domicilioFiscal ?? '',
          razonSocial: arr.razonSocial ?? '',
          datosComplementarios: Array.isArray(
            (ITEM as { datosComplementarios?: unknown[] })?.datosComplementarios
          )
            ? (ITEM as { datosComplementarios?: unknown[] }).datosComplementarios?.map((dc: unknown) => {
                const COMPLEMENTO = dc as { idPlantaC?: string; idDato?: string; amparoPrograma?: string };
                return {
                  idPlantaC: COMPLEMENTO.idPlantaC ?? '',
                  idDato: COMPLEMENTO.idDato ?? '',
                  amparoPrograma: COMPLEMENTO.amparoPrograma ?? '',
                };
              })
            : [],
        });
      });
    });
    return RESULT;
  }

  /**
   * Build plantasControladoras by taking the base array
   * and appending the length of each key in empresasSeleccionadas
   * to every planta item.
   *
   * @param array  Object with keys whose values are arrays
   * @param base            Existing plantasControladoras array
   */
 buildComplementosTablaPayload(array: unknown[], base: unknown[]): unknown[] {
    const RESULT: unknown[] = [];

    array.forEach((arr) => {
      const OBJ = arr as { rfc?: string; taxId?: string; correoElectronico?: string; razonSocial?: string; nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string; codigoPostal?: string; cp?: string; estado?: string };
      base.forEach((item) => {
        const ITEM = item && typeof item === 'object' ? item : {};
        RESULT.push({
          ...ITEM,
          rfc: OBJ.rfc || OBJ.taxId,
          correoElectronico: OBJ.correoElectronico,
          razonSocial: OBJ.razonSocial,
          nombre: OBJ.taxId,
          apellidoPaterno: OBJ.apellidoPaterno,
          apellidoMaterno: OBJ.apellidoMaterno,
          domicilioSolicitud: {
            codigoPostal: OBJ.codigoPostal || OBJ.cp,
            informacionExtra: OBJ.estado,
          },
        });
      });
    });
    return RESULT;
  }

  /**
   * Genera un arreglo de objetos con los datos de fedatarios a partir de un arreglo de entrada.
   *
   * @param arr Arreglo de objetos con datos de entrada (opcional).
   * @param base Objeto base que se fusiona con los datos específicos de cada fedatario.
   * @returns Un arreglo de objetos estructurados con la información de los fedatarios.
   */
  buildDatosFederatarios(base: unknown[], array: unknown[] = []): unknown[] {
    const RESULT: unknown[] = [];
    array.forEach((arr) => {
      const FEDATARIO = arr as { nombre?: string; segundoApellido?: string; primerApellido?: string; numeroDeActa?: string; fechaInicioInput?: string; numeroDeNotaria?: string; entidadFederativa?: string; estadoOptions?: string };
      base.forEach((item) => {
        const ITEM = item && typeof item === 'object' ? item : {};
        RESULT.push({
          ...ITEM,
          nombreNotario: FEDATARIO.nombre ?? '',
          apellidoMaterno: FEDATARIO.segundoApellido ?? '',
          apellidoPaterno: FEDATARIO.primerApellido ?? '',
          numeroActa: FEDATARIO.numeroDeActa ?? '',
          fechaActa: formatearFechaYyyyMmDd(FEDATARIO.fechaInicioInput ?? ''),
          numeroNotaria: FEDATARIO.numeroDeNotaria ?? '',
          entidadFederativa: FEDATARIO.entidadFederativa ?? '',
          delegacionMunicipio: FEDATARIO.estadoOptions ?? '',
        });
      });
    });
    return RESULT;
  }

  /**
   * Construye el objeto `anexo` a partir de los datos proporcionados.
   *
   * @param data - Objeto de entrada que contiene la información necesaria para construir los anexos y sus tablas asociadas.
   * @returns Un objeto con la estructura de los anexos, incluyendo ANEXOII, ANEXOIII, proveedorCliente y datosParaNavegar.
   *
   * - `ANEXOII` y `ANEXOIII`: Listas construidas a partir de los elementos de `anexoDosTablaLista` y `anexoTresTablaLista` respectivamente.
   * - `proveedorCliente`: Lista de proveedores y clientes obtenida de `proveedorClienteDatosTabla`.
   * - `datosParaNavegar`: Información adicional para navegación, construida desde `datosParaNavegar`.
   *
   * Cada subestructura se construye utilizando funciones auxiliares para mapear y transformar los datos de entrada.
   */
  buildAnexo(data: unknown): { anexo: Record<string, unknown> } {
    const BUILD_ANEXO_ITEM = (item: Anexo1): unknown => ({
      descripcion: item.encabezadoFraccion,
      idTipoBien: 0,
      idBienComercial: 0,
      testado: true,
      contadorGrid: null,
      descripcionTestado: item.encabezadoDescripcion,
    });
 
    const BUILD_PROVEEDOR_CLIENTE = (item: ProveedorClienteDatosTabla): unknown => ({
      idProveedor: item.idProveedor,
      paisOrigen: item.paisOrigen,
      rfcProveedor: item.rfcProveedor,
      razonProveedor: item.razonProveedor,
      paisDestino: item.paisDestino,
      rfcCliente: item.rfcClinte,
      razonCliente: item.razonSocial,
      domicilio: item.domicilio,
      testado: item.testado,
      idProductoP: item.idProductoP,
      descTestado: item.descTestado,
    });

    const BUILD_DATOS_PARA_NAVEGAR = (datos: DatosParaNavegar): unknown => ({
      anexoII: datos?.encabezadoAnexoII,
      tipo: datos?.encabezadoTipo,
      unidadMedida: datos?.encabezadoAnexoII,
      categoria: datos?.encabezadoCategoria,
      descripcion: datos?.encabezadoDescripcionComercial,
      valorMensual: datos?.encabezadoVolumenMensual,
      valorAnual: datos?.encabezadoVolumenAnual,
      volumenMensual: datos?.encabezadoValorEnMonedaMensual,
      volumenAnual: datos?.encabezadoValorEnMonedaAnual,
      testado: true,
      fecFinVigencia: null,
      volumenAnualSolicitado: null,
    });

    const BUILD_ANEXO_DOS = (item: AnexoDosItem): unknown => ({
      fraccionExportacion: item.encabezadoFraccionExportacion,
      fraccionImportacion: item.encabezadoFraccionImportacion,
      descFraccionImpo: item.encabezadoDescripcionComercial,
      claveFraccionAnexo: item.encabezadoAnexoII,
      idProducto: item.encabezadoIdProducto,
      fraccionDescripcionAnexo: item.encabezadoFraccionDescripcionAnexo,
      fraccionValorMonedaAI: item.encabezadoValorEnMonedaAnual,
      fraccionValorProdMI: item.encabezadoValorEnMonedaMensual,
      fraccionVolumenMensual: item?.encabezadoValorEnMonedaMensual,
      fraccionVolumenAnual: item?.encabezadoVolumenAnual,
      categoriaFraccion: item.encabezadoCategoria,
      tipoFraccion: item.encabezadoTipo,
      umt: item.encabezadoUmt,
    });
 
    const PROYECTO_IMMEX_DATOS = (item: ProyectoImmexEncabezado): unknown => ({
      tipoDocumento: item.encabezadoTipoDocument,
      descripcion: item.encabezadoDescripcionOtro,
      fechaFirma: item.encabezadoFechaFirma,
      fechaVigencia: item.encabezadoFechaVigencia,
      rfcFirmante: item.encabezadoRfc,
      razonFirmante: item.encabezadoRazonFirmante,
      testado: true,
      fecFinVigencia: item.encabezadoFechaVigencia,
    });
 
    /**
     * Construye un objeto con los datos del proveedor y cliente a partir de un elemento de tipo `ProveedorClienteDatosTabla`.
     *
     * @param item - Objeto que contiene la información del proveedor y cliente.
     * @returns Un objeto con las propiedades: paisOrigen, rfcProveedor, razonProveedor, paisDestino, rfcCliente, razonCliente, domicilio y descTestado.
     */
    const BUILD_PROVEEDOR_CLIENTE_DOS = (item: ProveedorClienteDatosTabla): unknown => ({
      paisOrigen: item.paisOrigen,
      rfcProveedor: item.rfcProveedor,
      razonProveedor: item.razonProveedor,
      paisDestino: item.paisDestino,
      rfcCliente: item.rfcClinte,
      razonCliente: item.razonSocial,
      domicilio: item.domicilio,
      descTestado: item.descTestado,
    });
 
    return {
      anexo: {
        ANEXOII: ((data as { annexoDosTres?: { anexoDosTablaLista?: Anexo1[] } }).annexoDosTres?.anexoDosTablaLista || []).map(BUILD_ANEXO_ITEM),
        ANEXOIII: ((data as { annexoDosTres?: { anexoTresTablaLista?: Anexo1[] } }).annexoDosTres?.anexoTresTablaLista || []).map(BUILD_ANEXO_ITEM),
        proveedorCliente: ((data as { annexoUno?: { proveedorClienteDatosTabla?: ProveedorClienteDatosTabla[] } }).annexoUno?.proveedorClienteDatosTabla || []).map(BUILD_PROVEEDOR_CLIENTE),
        datosParaNavegar: BUILD_DATOS_PARA_NAVEGAR((data as { annexoUno?: { importarDatosTabla?: unknown[] } })?.annexoUno?.importarDatosTabla?.[0] || {}),
        tableDos: (((data as { annexoUno?: { exportarDatosTabla?: unknown[] } })?.annexoUno?.exportarDatosTabla || []) as AnexoDosItem[]).map(BUILD_ANEXO_DOS),
        proyectoimex: ((data as { proyectoImmexTablaLista?: ProyectoImmexEncabezado[] }).proyectoImmexTablaLista || []).map(PROYECTO_IMMEX_DATOS),
        proveedorClienteDos: ((data as { annexoUno?: { proveedorClienteDatosTablaDos?: ProveedorClienteDatosTabla[] } }).annexoUno?.proveedorClienteDatosTablaDos || []).map(BUILD_PROVEEDOR_CLIENTE_DOS),
      },
    };
  }

  reverseBuildComplimentos(payload: unknown): DatosComplimentos {
    const PAYLOAD = payload as {
      solicitud: {
        notario: {
          rfc: string;
          numeroActa: string;
          numeroNotario: string;
          entidadFederativa: string;
          fechaActa: string;
        };
        nomOficialAutorizado: string;
        modalidad: string;
        booleanGenerico: boolean;
        descripcionSistemasMedicion: string;
        descripcionLugarEmbarque: string;
        numeroPermiso: string;
        fechaOperacion: string;
      };
      declaracionSolicitudEntities?: { acepto?: number }[];
    };

    return {
        formaModificaciones: {
          rfc: PAYLOAD.solicitud.notario.rfc,
          nombreDeActa: PAYLOAD.solicitud.notario.numeroActa,
          nombreDeNotaria: PAYLOAD.solicitud.notario.numeroNotario,
          estado: PAYLOAD.solicitud.notario.entidadFederativa,
          fechaDeActa: formatearFechaDdMmYyyy(PAYLOAD.solicitud.notario.fechaActa),
          nombreDelFederatario: PAYLOAD.solicitud.nomOficialAutorizado,
        },
        modalidad: PAYLOAD.solicitud.modalidad,
        programaPreOperativo: String(PAYLOAD.solicitud.booleanGenerico),
        datosGeneralis: {
          paginaWWeb: PAYLOAD.solicitud.descripcionSistemasMedicion,
          localizacion: PAYLOAD.solicitud.descripcionLugarEmbarque,
        },
        obligacionesFiscales: {
          opinionPositiva: PAYLOAD.solicitud.numeroPermiso === 'SI' ? '' : '',
          fechaExpedicion: formatearFechaDdMmYyyy(PAYLOAD.solicitud.fechaOperacion),
          aceptarObligacionFiscal: PAYLOAD.declaracionSolicitudEntities?.[0]?.acepto === 1 ? 'Si' : 'No'
        }
    };
  }

  reverseBuildSociosAccionistas(payload: unknown[]): { ARR1: SociaoAccionistas[]; ARR2: SociaoAccionistas[] } {
    const ARR1: SociaoAccionistas[] = [];
    const ARR2: SociaoAccionistas[] = [];
    for (const ELE of payload as Array<{ rfc?: string; rfcExtranjero?: string; nombre?: string; apellidoPaterno?: string; apellidoMaterno?: string; correoElectronico?: string; razonSocial?: string; estadoEntidad?: string; estadoEvaluacionEntidad?: string; cvePaisOrigen?: string; domicilio?: { codigoPostal?: string } }>) {
      if (ELE?.rfc && String(ELE.rfc).trim() !== '') {
        ARR1.push({
          rfc: ELE.rfc
        });
      } else if (ELE?.rfcExtranjero && String(ELE.rfcExtranjero).trim() !== '') {
        ARR2.push({
          nombre: ELE.nombre,
          apellidoPaterno: ELE.apellidoPaterno,
          apellidoMaterno: ELE.apellidoMaterno,
          taxId: ELE.rfcExtranjero,
          correoElectronico: ELE.correoElectronico,
          razonSocial: ELE.razonSocial,
          estado: ELE.estadoEntidad ?? ELE.estadoEvaluacionEntidad,
          pais: ELE.cvePaisOrigen,
          codigoPostal: ELE.domicilio?.codigoPostal,
        });
      }
    }
    return { ARR1, ARR2 };
  }

  reverseBuildDatosFederatarios(payload: unknown[]): FederatariosEncabezado[] {
    const RESULT: FederatariosEncabezado[] = [];
    for (const ELE of payload) {
      const ELE_OBJ = ELE as {
        nombreNotario?: string;
        apellidoPaterno?: string;
        apellidoMaterno?: string;
        numeroActa?: string;
        fechaActa?: string;
        numeroNotaria?: string;
        entidadFederativa?: string;
        delegacionMunicipio?: string;
      };
      RESULT.push({
        nombre: ELE_OBJ.nombreNotario ?? '',
        primerApellido: ELE_OBJ.apellidoPaterno ?? '',
        segundoApellido: ELE_OBJ.apellidoMaterno ?? '',
        numeroDeActa: ELE_OBJ.numeroActa ?? '',
        fechaDelActa: ELE_OBJ.fechaActa ?? '',
        numeroDeNotaria: ELE_OBJ.numeroNotaria ?? '',
        estado: ELE_OBJ.entidadFederativa ?? '',
        estadoOptions: ELE_OBJ.delegacionMunicipio ?? '',
        entidadFederativa: ELE_OBJ.entidadFederativa ?? '',
        municipioODelegacion: ELE_OBJ.delegacionMunicipio ?? '',
        estadoUno: '',
        estadoDos: '',
        estadoTres: ''
      });
    }
    return RESULT;
  }

  // Turn the merged payload back into the original array of plant objects
  reverseBuildPlantas(payload: unknown[]): PlantasImmex[] {
    const RESULT: PlantasImmex[] = [];
    for (const ELE of payload) {
      const ELE_OBJ = ELE as {
        idPlanta?: string;
        calle?: string;
        numeroExterior?: string;
        numeroInterior?: string;
        codigoPostal?: string;
        localidad?: string;
        colonia?: string;
        delegacionMunicipio?: string;
        entidadFederativa?: string;
        pais?: string;
        rfc?: string;
        domicilioFiscal?: string;
        razonSocial?: string;
      };
      RESULT.push({
        planta: ELE_OBJ.idPlanta ?? '',
        calle: ELE_OBJ.calle ?? '',
        numeroExterior: ELE_OBJ.numeroExterior ?? '',
        numeroInterior: ELE_OBJ.numeroInterior ?? '',
        codigoPostal: ELE_OBJ.codigoPostal ?? '',
        localidad: ELE_OBJ.localidad ?? '',
        colonia: ELE_OBJ.colonia ?? '',
        delegacionMunicipio: ELE_OBJ.delegacionMunicipio ?? '',
        entidadFederativa: ELE_OBJ.entidadFederativa ?? '',
        pais: ELE_OBJ.pais ?? '',
        registroFederalDeContribuyentes: ELE_OBJ.rfc ?? '',
        domicilioDelSolicitante: ELE_OBJ.domicilioFiscal ?? '',
        razonSocial: ELE_OBJ.razonSocial ?? '',
      });
    }
    return RESULT;
  }

  reverseBuildPlantasSubmanufactureras(payload: unknown[]): PlantasSubfabricante[] {
    const RESULT: PlantasSubfabricante[] = [];
    for (const ELE of payload) {
      const ELE_OBJ = ELE as {
        empresaCalle?: string;
        empresaNumeroInterior?: string;
        empresaNumeroExterior?: string;
        empresaCodigoPostal?: string;
        localidad?: string;
        empresaDelegacionMunicipio?: string;
        empresaEntidadFederativa?: string;
        empresaPais?: string;
        rfc?: string;
        domicilioFiscal?: string;
        razonSocial?: string;
      };
      RESULT.push({
        calle: ELE_OBJ.empresaCalle ?? '',
        numInterior: ELE_OBJ.empresaNumeroInterior !== undefined && ELE_OBJ.empresaNumeroInterior !== null && ELE_OBJ.empresaNumeroInterior !== ''
          ? Number(ELE_OBJ.empresaNumeroInterior)
          : 0,
        numExterior: ELE_OBJ.empresaNumeroExterior !== undefined && ELE_OBJ.empresaNumeroExterior !== null && ELE_OBJ.empresaNumeroExterior !== ''
          ? Number(ELE_OBJ.empresaNumeroExterior)
          : 0,
        codigoPostal: ELE_OBJ.empresaCodigoPostal !== undefined && ELE_OBJ.empresaCodigoPostal !== null && ELE_OBJ.empresaCodigoPostal !== ''
          ? Number(ELE_OBJ.empresaCodigoPostal)
          : 0,
        colonia: ELE_OBJ.localidad ?? '',
        municipio: ELE_OBJ.empresaDelegacionMunicipio ?? '',
        entidadFederativa: ELE_OBJ.empresaEntidadFederativa ?? '',
        pais: ELE_OBJ.empresaPais ?? '',
        rfc: ELE_OBJ.rfc ?? '',
        domicilioFiscal: ELE_OBJ.domicilioFiscal ?? '',
        razonSocial: ELE_OBJ.razonSocial ?? '',
      });
    }
    return RESULT;
  }

  reverseBuildAnexoDos(items: unknown[]): AnexoDosEncabezado[] {
    return items.map((built) => {
      const ITEM = built as {
        fraccionExportacion?: string;
        fraccionImportacion?: string;
        descFraccionImpo?: string;
        claveFraccionAnexo?: string;
        idProducto?: string;
        fraccionDescripcionAnexo?: string;
        fraccionValorMonedaAI?: string | number;
        fraccionValorProdMI?: string | number;
        categoriaFraccion?: string;
        tipoFraccion?: string;
        umt?: string;
        fraccion?: string;
        descripcionComercialImportacion?: string;
        estatus?: boolean;
      };
      return {
        encabezadoFraccionExportacion: ITEM.fraccionExportacion ?? '',
        encabezadoFraccionImportacion: ITEM.fraccionImportacion ?? '',
        encabezadoDescripcionComercial: ITEM.descFraccionImpo ?? '',
        encabezadoAnexoII: ITEM.claveFraccionAnexo ?? '',
        encabezadoIdProducto: ITEM.idProducto ?? '',
        encabezadoFraccionDescripcionAnexo: ITEM.fraccionDescripcionAnexo ?? '',
        encabezadoValorEnMonedaAnual: typeof ITEM.fraccionValorMonedaAI === 'string'
          ? Number(ITEM.fraccionValorMonedaAI)
          : ITEM.fraccionValorMonedaAI ?? 0,
        encabezadoValorEnMonedaMensual: typeof ITEM.fraccionValorProdMI === 'string'
          ? Number(ITEM.fraccionValorProdMI)
          : ITEM.fraccionValorProdMI ?? 0,
        encabezadoCategoria: ITEM.categoriaFraccion ?? '',
        encabezadoTipo: ITEM.tipoFraccion ?? '',
        encabezadoUmt: ITEM.umt ?? '',
        encabezadoFraccion: ITEM.fraccion ?? '',
        encabezadoDescripcionComercialImportacion: ITEM.descripcionComercialImportacion ?? '',
        estatus: ITEM.estatus ?? true,
      };
    });
  }

  reverseBuildAnexoDosTres(items: unknown[]): AnexoEncabezado[] {
    return items.map((built) => ({
      encabezadoFraccion: (built as { descripcion?: string }).descripcion ?? '',
      encabezadoDescripcion: (built as { descripcionTestado?: string }).descripcionTestado ?? '',
      estatus: (built as { estatus?: boolean }).estatus ?? true,
    }));
  }

  reverseBuildProveedorCliente(items: unknown[]): ProveedorClienteDatosTabla[] {
    return items.map((built) => ({
      idProveedor: (built as { idProveedor?: number }).idProveedor ?? 0,
      paisOrigen: (built as { paisOrigen?: string }).paisOrigen ?? '',
      rfcProveedor: (built as { rfcProveedor?: string }).rfcProveedor ?? '',
      razonProveedor: (built as { razonProveedor?: string }).razonProveedor ?? '',
      paisDestino: (built as { paisDestino?: string }).paisDestino ?? '',
      rfcClinte: (built as { rfcCliente?: string }).rfcCliente ?? '',
      razonSocial: (built as { razonCliente?: string }).razonCliente ?? '',
      domicilio: (built as { domicilio?: string }).domicilio ?? '',
      testado: (built as { testado?: boolean }).testado ?? false,
      idProductoP: (built as { idProductoP?: number }).idProductoP ?? 0,
      descTestado: (built as { descTestado?: string }).descTestado ?? '',
    }));
  }

reverseProveedoresClientDos(items: unknown[]): ProveedorClienteTabla[] {
  return items.map((built) => ({
    idProveedor: (built as { idProveedor?: number }).idProveedor ?? 0,
    paisOrigen: (built as { paisOrigen?: string }).paisOrigen ?? '',
    rfcProveedor: (built as { rfcProveedor?: string }).rfcProveedor ?? '',
    razonProveedor: (built as { razonProveedor?: string }).razonProveedor ?? '',
    paisDestino: (built as { paisDestino?: string }).paisDestino ?? '',
    rfcClinte: (built as { rfcCliente?: string }).rfcCliente ?? '',
    razonSocial: (built as { razonCliente?: string }).razonCliente ?? '',
    domicilio: (built as { domicilio?: string }).domicilio ?? '',
    descTestado: (built as { descTestado?: string }).descTestado ?? '',
    testado: (built as { testado?: boolean }).testado ?? false,
    idProductoP: (built as { idProductoP?: number }).idProductoP ?? 0,
  }));
}

  reverseProyectoIMMEX(items: unknown[]): ProyectoImmexEncabezado[] {
    return items.map((built) => ({
      encabezadoTipoDocument: (built as { tipoDocumento?: string }).tipoDocumento ?? '',
      encabezadoDescripcionOtro: (built as { descripcion?: string }).descripcion ?? '',
      encabezadoFechaFirma: (built as { fechaFirma?: string }).fechaFirma ?? '',
      encabezadoFechaVigencia: (built as { fechaVigencia?: string }).fechaVigencia ?? '',
      encabezadoRfc: (built as { rfcFirmante?: string }).rfcFirmante ?? '',
      encabezadoRazonFirmante: (built as { razonFirmante?: string }).razonFirmante ?? '',
      testado: (built as { testado?: boolean }).testado ?? false,
      encabezadoFraccion: (built as { encabezadoFraccion?: string }).encabezadoFraccion ?? '',
      estatus: (built as { estatus?: boolean }).estatus ?? true
    }));
  }

  reverseBuildDatosParaNavegar(items: unknown): AnexoUnoEncabezado[] {
    return [
      {
        encabezadoAnexoII: (items as { anexoII?: string }).anexoII ?? '',
        encabezadoTipo: (items as { tipo?: string }).tipo ?? '',
        encabezadoCategoria: (items as { categoria?: string }).categoria ?? '',
        encabezadoDescripcionComercial: (items as { descripcion?: string }).descripcion ?? '',
        encabezadoVolumenMensual: (items as { valorMensual?: number }).valorMensual ?? 0,
        encabezadoVolumenAnual: (items as { valorAnual?: number }).valorAnual ?? 0,
        encabezadoValorEnMonedaMensual: (items as { volumenMensual?: number }).volumenMensual ?? 0,
        encabezadoValorEnMonedaAnual: (items as { volumenAnual?: number }).volumenAnual ?? 0,
        encabezadoFraccion: (items as { fraccion?: string }).fraccion ?? '',
        encabezadoFraccionArancelaria: (items as { fraccionArancelaria?: string }).fraccionArancelaria ?? '',
        encabezadoUmt: (items as { umt?: string }).umt ?? '',
        estatus: (items as { estatus?: boolean }).estatus ?? true,
      },
    ];
  }

  /**
   * Realiza una solicitud para obtener información de fracción arancelaria del anexo tres.
   * @param {DatosAnexotressUno} payload - Cuerpo de la solicitud con los parámetros necesarios.
   * @returns {Observable<JSONResponse>} - Observable con la respuesta de la API.
   */
  anexoTresFraccionArancelaria(payload: any): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(
      API_ROUTES('/sat-t80101', '80101').anexoTresFraccionArancelaria,
      payload
    ).pipe(
      map((response) => response),
      catchError((error) => {
        const ERROR = new Error(`Error al obtener información de fracción arancelaria del anexo tres: ${error.message}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Agrega una nueva fracción arancelaria al anexo dos.
   * @param payload - Datos de la fracción arancelaria a agregar
   * @returns {Observable<JSONResponse>} Observable con la respuesta de la API
   */
  anexoDosFraccionArancelaria(payload: any): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(
      API_ROUTES('/sat-t80101', '80101').anexoDosFraccionArancelaria,
      payload
    ).pipe(
      map((response) => response),
      catchError((error) => {
        const ERROR = new Error(`Error al obtener información de fracción arancelaria del anexo tres: ${error.message}`);
        return throwError(() => ERROR);
      })
    );
  }

}