import {
  Catalogo,
  CatalogoServices,
  ENVIRONMENT,
  HttpCoreService,
  JSONResponse,
  MostrarPartidas,
} from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DatosDeLaSolicitud } from '../models/partidas.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130107 } from '../servers/api-route';
import { Tramite130107Query } from '../../../estados/queries/tramite130107.query';
import { Tramite130107State } from '../../../estados/tramites/tramite130107.store';

/**
 * @service ImportacionesAgropecuariasService
 * @description
 * Servicio encargado de gestionar las operaciones relacionadas con las importaciones agropecuarias
 * en el trámite 130107. Este servicio incluye métodos para obtener datos de la solicitud y realizar
 * operaciones auxiliares con el servidor.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Clase ImportacionesAgropecuariasService
 * Proporciona métodos para gestionar las importaciones agropecuarias en el trámite 130107.
 * Incluye operaciones para obtener datos de la solicitud y realizar consultas auxiliares.
 */
export class ImportacionesAgropecuariasService {
  /**
   * @property urlServer
   * @description
   * La URL del servidor utilizada para operaciones auxiliares con JSON.
   * Este valor se obtiene de la configuración del entorno.
   *
   * @type {string}
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * @constructor
   * @description
   * Constructor del servicio que inyecta el cliente HTTP para realizar solicitudes al servidor.
   *
   * @param http Cliente HTTP para realizar solicitudes a recursos externos.
   * @param catalogoServices Servicio para gestionar catálogos auxiliares.
   * @param httpService Servicio HTTP centralizado para realizar solicitudes.
   * @param tramite130107Query Query para consultar el estado del trámite 130107.
   */
  constructor(
    private http: HttpClient,
    private catalogoServices: CatalogoServices,
    private httpService: HttpCoreService,
    private tramite130107Query: Tramite130107Query
  ) {}

  /**
   * @property getAllState
   * @description
   * Obtiene todos los datos del estado almacenado en el store.
   * 
   * @returns Observable<Tramite130107State> Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite130107State> {
    return this.tramite130107Query.selectSolicitud$;
  }

  /**
   * @method obtenerTramite
   * @description
   * Método para obtener los datos de un trámite específico desde el servidor.
   * Realiza una solicitud GET a la URL del servidor con el ID del trámite.
   *
   * @param id ID del trámite a obtener.
   * @returns Observable<JSONResponse> Respuesta en formato JSON con los datos del trámite.
   */
  obtenerTramite(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * @method datosDeLaSolicitud
   * @description
   * Método para obtener los datos de la solicitud desde un archivo JSON local.
   * Este método se utiliza para cargar datos estáticos relacionados con el trámite.
   *
   * @returns Observable<DatosDeLaSolicitud> Datos de la solicitud en formato JSON.
   */
  datosDeLaSolicitud(): Observable<DatosDeLaSolicitud> {
    return this.http.get<DatosDeLaSolicitud>(
      'assets/json/130107/datos-de-la-solicitud.json'
    );
  }

  /**
   * Obtiene el catálogo de tratados/acuerdos asociados a un trámite.
   * @param tramitesID - Identificador del trámite
   * @param tratadoAsociado - Clave del tratado asociado
   * @returns Observable con un arreglo de tratados (o vacío si no hay datos)
   */
  getRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .regimenesCatalogo(tramitesID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Obtiene el catálogo de clasificaciones de régimen asociado a un trámite.
   * @param tramitesID Identificador del trámite
   * @returns Observable con un arreglo de clasificaciones de régimen (o vacío si no hay datos)
   */
  getClasificacionRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .getClasificacionRegimen('130107', tramitesID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   *  Obtiene el catálogo de fracciones arancelarias asociado a un identificador.
   * @param ID Identificador para obtener las fracciones arancelarias
   * @returns Observable con un arreglo de fracciones arancelarias (o vacío si no hay datos)
   */
  getFraccionCatalogoService(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .fraccionesArancelariasCatalogo(ID, 'TITPEX.130107')
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   *  Obtiene el catálogo de unidades de medida tarifaria asociado a un identificador y fracción arancelaria.
   * @param ID Identificador para obtener las unidades de medida tarifaria
   * @param FRACCION_ID Identificador de la fracción arancelaria
   * @returns Observable con un arreglo de unidades de medida tarifaria (o vacío si no hay datos)
   */
  getUMTService(ID: string, FRACCION_ID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .unidadesMedidasTarifariasCatalogo(ID, FRACCION_ID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   *  Obtiene el catálogo de entidades federativas asociado a un identificador.
   * @param ID Identificador para obtener las entidades federativas
   * @returns Observable con un arreglo de entidades federativas (o vacío si no hay datos)
   */
  getEntidadesFederativasCatalogo(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .entidadesFederativasCatalogo(ID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   *  Obtiene el catálogo de representación federal asociado a un identificador y clave de entidad.
   * @param cveEntidad Clave de la entidad para filtrar la representación federal
   * @returns Observable con un arreglo de representación federal (o vacío si no hay datos)
   */
  getRepresentacionFederalCatalogo(cveEntidad: string): Observable<Catalogo[]> {
    return this.httpService
      .get<BaseResponse<Catalogo[]>>(
        PROC_130107.REPRESENTATION_FEDERAL + cveEntidad
      )
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   *  Obtiene el catálogo de todos los países seleccionados asociado a un identificador.
   * @param ID Identificador para obtener los países seleccionados
   * @returns Observable con un arreglo de países seleccionados (o vacío si no hay datos)
   */
  getTodosPaisesSeleccionados(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .todosPaisesSeleccionados(ID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Obtiene la lista de bloques comerciales (tratados o acuerdos) según el trámite proporcionado.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación para la consulta del catálogo.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de elementos del catálogo de bloques.
   */
  getBloqueService(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .tratadosAcuerdoCatalogo(tramite, 'TITRAC.TA')
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   *  Obtiene el catálogo de mostrar partidas asociado a un trámite e identificador.
   * @param tramite Identificador del trámite
   * @param ID Identificador para obtener las mostrar partidas
   * @returns Observable con un arreglo de mostrar partidas (o vacío si no hay datos)
   */
  getMostrarPartidasService(
    solicitud_id: number
  ): Observable<BaseResponse<MostrarPartidas[]>> {
    const ENDPOINT = PROC_130107.MOSTAR_PARTIDAS + solicitud_id;
    return this.http.get<BaseResponse<MostrarPartidas[]>>(ENDPOINT);
  }

  /**
   * Obtiene la lista de países asociados a un bloque comercial según el trámite y el identificador proporcionado.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación que se está realizando.
   * @param {string} ID - Identificador del bloque o parámetro necesario para la consulta.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de elementos del catálogo de países.
   */
  getPaisesPorBloqueService(
    tramite: string,
    ID: string
  ): Observable<Catalogo[]> {
    return this.catalogoServices
      .getpaisesBloqueCatalogo(tramite, ID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param body - Objeto con los datos a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  guardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(PROC_130107.GUARDAR, body);
  }

  /**
   * Genera el payload de datos para el trámite 130107 basado en la información proporcionada.
   *
   * @param {Tramite130107State} item - Objeto que contiene la información del trámite,
   * incluyendo datos de tabla y valores autorizados.
   *
   * @returns {any[]} Arreglo de objetos con los datos transformados para ser enviados
   * en el payload del trámite.
   *
   * @description
   * Este método toma las filas de `tableBodyData` dentro del objeto `item` y construye un
   * arreglo de objetos con los valores solicitados y autorizados.
   * Convierte valores numéricos, extrae descripciones y agrega claves arancelarias y de unidad de medida.
   */
  getPayloadDatos(item: Tramite130107State): unknown {
    const ROWS = Array.isArray(item.tableBodyData) ? item.tableBodyData : [];
    return ROWS.map((row) => ({
      unidadesSolicitadas: Number(row.cantidad),
      unidadesAutorizadas: Number(item.cantidad),
      descripcionSolicitada: row.descripcion,
      descripcionAutorizada: item.descripcion,
      importeUnitarioUSD: Number(row.precioUnitarioUSD),
      importeTotalUSD: Number(row.totalUSD),
      autorizada: true,
      importeUnitarioUSDAutorizado: Number(row.precioUnitarioUSD),
      importeTotalUSDAutorizado: Number(item.valorFacturaUSD),
      fraccionArancelariaClave: item.fraccion,
      unidadMedidaClave: item.unidadMedida,
    }));
  }
}
