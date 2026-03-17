import {
  Catalogo,
  CatalogoServices,
  HttpCoreService,
  JSONResponse,
} from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import {
  Tramite130116State,
  Tramite130116Store,
} from '../../../estados/tramites/tramites130116.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130116 } from '../servers/api-route';
import { Tramite130116Query } from '../../../estados/queries/tramite130116.query';

/**
 * Servicio para gestionar la importación de vehículos.
 * Este servicio proporciona métodos para obtener datos relacionados con la importación de vehículos,
 * como listas de países, entidades federativas, representaciones federales y opciones de productos.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudImportacionAmbulanciaService {
  /**
   * Constructor del servicio.
   * Servicio HttpClient para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private httpService: HttpCoreService,
    private tramite130116Store: Tramite130116Store,
    private catalogoServices: CatalogoServices,
    private tramite130116Query: Tramite130116Query
  ) {
    //
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
   * Actualiza el estado del formulario en el store.
   * @param DATOS Estado actualizado del trámite.
   */
  actualizarEstadoFormulario(DATOS: Tramite130116State): void {
    this.tramite130116Store.actualizarEstado(DATOS);
  }

  /**
   * Obtiene los datos de la solicitud.
   * @returns Observable con los datos de la solicitud.
   */
  getDatosDeLaSolicitud(): Observable<Tramite130116State> {
    return this.http.get<Tramite130116State>(
      'assets/json/130116/datos-de-la-solicitud.json'
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
      .getClasificacionRegimen('130116', tramitesID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   *  Obtiene el catálogo de fracciones arancelarias asociado a un identificador.
   * @param ID Identificador para obtener las fracciones arancelarias
   * @returns Observable con un arreglo de fracciones arancelarias (o vacío si no hay datos)
   */
  getFraccionCatalogoService(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .fraccionesArancelariasCatalogo(ID, 'TITPEX.130116')
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Obtiene el catálogo de unidades de medida tarifaria asociado a un identificador y fracción arancelaria.
   * @param ID Identificador para obtener las unidades de medida tarifaria
   */
  getUMTService(ID: string, FRACCION_ID: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .unidadesMedidasTarifariasCatalogo(ID, FRACCION_ID)
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Obtiene la lista de bloques comerciales (tratados o acuerdos) según el trámite proporcionado.
   * @param {string} tramite - Identificador del trámite o tipo de operación para la consulta del catálogo.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de elementos del catálogo de bloques.
   */
  getBloqueService(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices
      .tratadosAcuerdoCatalogo(tramite, 'TITRAC.TA')
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
        PROC_130116.REPRESENTACION_FEDERAL_CATALOGO + cveEntidad
      )
      .pipe(map((res) => res?.datos ?? []));
  }

  /**
   * Guarda los datos del trámite en el servidor.
   * @param body - Objeto con los datos a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  guardarDatos(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130116.GUARDAR, body);
  }

  /**
   * @property getAllState
   * @description
   * Obtiene todos los datos del estado almacenado en el store.
   *
   * @returns Observable<Tramite130116State> Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite130116State> {
    return this.tramite130116Query.selectSolicitud$;
  }

  /**
   * Genera el payload de datos transformando la información del trámite para el envío al servidor.
   * Mapea los datos de la tabla del estado del trámite a un formato estandarizado que incluye
   * @param {Tramite130116State} item - Estado del trámite que contiene los datos de la tabla y información adicional
   */
  getPayloadDatos(item: Tramite130116State): unknown {
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