
import { Catalogo, CatalogoServices, JSONResponse } from '@ng-mf/data-access-user';
import { Observable, map } from 'rxjs';
import { Tramite130105State, Tramite130105Store } from '../../../estados/tramites/tramites130105.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PROC_130105 } from '../servers/api-route';
import { Tramite130105Query } from '../../../estados/queries/tramite130105.query';

/**
 * Servicio para gestionar la importación de vehículos.
 * Este servicio proporciona métodos para obtener datos relacionados con la importación de vehículos,
 * como listas de países, entidades federativas, representaciones federales y opciones de productos.
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionVehiculosUsadosDonacionService {
  /**
   * Constructor del servicio.
   * Servicio HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient, private tramite130105Store: Tramite130105Store, private tramite130105Query: Tramite130105Query, private catalogoServices: CatalogoServices) {
    //
  }

  /**
     * Obtiene todos los datos del estado almacenado en el store.
     * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
     */
  getAllState(): Observable<Tramite130105State> {
    return this.tramite130105Query.selectSolicitud$;
  }


  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Tramite130105State): void {
    this.tramite130105Store.actualizarEstado(DATOS);
  }
  
  /**
   * Obtiene los datos de la solicitud desde la API.
   * 
   * @param id_solicitud - Identificador de la solicitud.
   * @returns Observable con la respuesta JSON de la solicitud.
   */
  getDatosDeLaSolicitud(id_solicitud: number): Observable<JSONResponse> {
    const ENDPOINT = PROC_130105.MOSTRAR + id_solicitud;
    return this.http.get<JSONResponse>(ENDPOINT);
  }

  /**
     * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
     *
     * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
     * @returns Observable con la respuesta de la solicitud POST.
     */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130105.GUARDAR, body);
  }

  /**
    * Obtiene el catálogo de tratados/acuerdos asociados a un trámite.
    * @param tramitesID - Identificador del trámite
    * @param tratadoAsociado - Clave del tratado asociado
    * @returns Observable con un arreglo de tratados (o vacío si no hay datos)
    */
  getRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices.regimenesCatalogo(tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene el catálogo de clasificaciones de régimen asociado a un trámite.
   * @param tramitesID Identificador del trámite
   * @returns Observable con un arreglo de clasificaciones de régimen (o vacío si no hay datos)
   */
  getClasificacionRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices.getClasificacionRegimen('130105', tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de fracciones arancelarias asociado a un identificador.
   * @param ID Identificador para obtener las fracciones arancelarias
   * @returns Observable con un arreglo de fracciones arancelarias (o vacío si no hay datos)
   */
  getFraccionCatalogoService(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.fraccionesArancelariasCatalogo(ID, 'TITPEX.130105')
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de unidades de medida tarifaria asociado a un identificador y fracción arancelaria.
   * @param ID Identificador para obtener las unidades de medida tarifaria
   * @param FRACCION_ID Identificador de la fracción arancelaria
   * @returns Observable con un arreglo de unidades de medida tarifaria (o vacío si no hay datos)
   */
  getUMTService(ID: string, FRACCION_ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.unidadesMedidaTarifariaCatalogo(ID, FRACCION_ID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de entidades federativas asociado a un identificador.
   * @param ID Identificador para obtener las entidades federativas
   * @returns Observable con un arreglo de entidades federativas (o vacío si no hay datos)
   */
  getEntidadesFederativasCatalogo(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.entidadesFederativasCatalogo(ID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   *  Obtiene el catálogo de representación federal asociado a un identificador y clave de entidad.
   * @param ID Identificador para obtener la representación federal
   * @param cveEntidad Clave de la entidad para filtrar la representación federal
   * @returns Observable con un arreglo de representación federal (o vacío si no hay datos)
   */
  getRepresentacionFederalCatalogo(ID: string, cveEntidad: string): Observable<Catalogo[]> {
    return this.catalogoServices.representacionFederalCatalogo(ID, cveEntidad).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   *  Obtiene el catálogo de todos los países seleccionados asociado a un identificador.
   * @param ID Identificador para obtener los países seleccionados
   * @returns Observable con un arreglo de países seleccionados (o vacío si no hay datos)
   */
  getTodosPaisesSeleccionados(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.todosPaisesSeleccionados(ID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene la lista de bloques comerciales (tratados o acuerdos) según el trámite proporcionado.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación para la consulta del catálogo.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de elementos del catálogo de bloques.
   */
  getBloqueService(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.tratadosAcuerdoCatalogo(tramite, 'TITRAC.TA')
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de mostrar partidas asociado a un trámite e identificador.
   * @param tramite Identificador del trámite
   * @param ID Identificador para obtener las mostrar partidas
   * @returns Observable con un arreglo de mostrar partidas (o vacío si no hay datos)
   */
  getMostrarPartidasService(solicitud_id: number): Observable<BaseResponse<MostrarPartidas[]>> {
    const ENDPOINT = PROC_130105.MOSTAR_PARTIDAS + solicitud_id;
    return this.http.get<BaseResponse<MostrarPartidas[]>>(ENDPOINT);
  }

  /**
   * Obtiene la lista de países asociados a un bloque comercial según el trámite y el identificador proporcionado.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación que se está realizando.
   * @param {string} ID - Identificador del bloque o parámetro necesario para la consulta.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de elementos del catálogo de países.
   */
  getPaisesPorBloqueService(tramite: string, ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.getpaisesBloqueCatalogo(tramite, ID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }


  /**
   * Genera el payload de datos para el trámite 130105 basado en la información proporcionada.
   *
   * @param {Tramite130105State} item - Objeto que contiene la información del trámite,
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
  getPayloadDatos(item: Tramite130105State): unknown {
    const ROWS = Array.isArray(item.tableBodyData) ? item.tableBodyData : [];
    return ROWS.map(row => ({
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
      unidadMedidaClave: item.unidadMedida
    }));
  }

  /**
   * Transforma un objeto construido en el formato requerido para el trámite 130105.
   *
   * @param {Record<string, unknown>} built - Objeto que contiene los datos construidos.
   */
  reverseBuildSolicitud130105(built: Record<string, unknown>
  ): Record<string, unknown> {
    const MERCANCIA = built['mercancia'] as Record<string, unknown> ?? {};
    const PARTIDAS_MERCANCIA = MERCANCIA?.['partidasMercancia'] as Record<string, unknown>[] ?? [];
    const REPRESENTACION_FEDERAL = built['representacionFederal'] as Record<string, unknown> ?? {};

    const TOTAL_CANTIDAD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['unidadesSolicitadas']) || 0);
    }, 0);

    const TOTAL_VALOR_USD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['importeTotalUSDAutorizado']) || 0);
    }, 0);

    return {
      defaultSelect: built['tipo_solicitud_pexim'],
      regimen: built['cve_regimen'],
      clasificacion: built['cve_clasificacion_regimen'],
      producto: MERCANCIA?.['condicionMercancia'],
      descripcion: MERCANCIA?.['descripcion'],
      fraccion: (MERCANCIA?.['fraccionArancelaria'] as Record<string, unknown>)?.['cveFraccion'],
      cantidad: MERCANCIA?.['cantidadTarifaria'],
      valorFacturaUSD: MERCANCIA?.['valorFacturaUSD'],
      unidadMedida: (MERCANCIA?.['unidadMedidaTarifaria'] as Record<string, unknown>)?.['clave'],
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      tableBodyData: this.reverseMapPartidasDeLaMercancia(PARTIDAS_MERCANCIA),
      cantidadTotal: TOTAL_CANTIDAD.toString() ?? '',
      valorTotalUSD: TOTAL_VALOR_USD.toString() ?? '',
      bloque: '',
      fechasSeleccionadas: built['listaPaises'] ?? [],
      usoEspecifico: MERCANCIA?.['usoEspecifico'] ?? '',
      justificacionImportacionExportacion: MERCANCIA?.['justificacionImportacionExportacion'] ?? '',
      observaciones: MERCANCIA?.['observaciones'] ?? '',
      entidad: REPRESENTACION_FEDERAL?.['cve_entidad_federativa'] ?? '',
      representacion: REPRESENTACION_FEDERAL?.['cve_unidad_administrativa'] ?? '',
    }
  }

  /**
   * Transforma un arreglo de datos de partidas de la mercancía en el formato requerido.
   *
   * @param {Record<string, unknown>[]} datos - Arreglo de objetos que representan las partidas de la mercancía.
   */
  reverseMapPartidasDeLaMercancia(datos: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    const PARTIDAS_MERCANCIAS = datos?.map((item: Record<string, unknown>, index: number) => ({
      id: index.toString() ?? '',
      cantidad: (item['unidadesSolicitadas'] as string) ?? '',
      unidadDeMedida: (item['unidadMedidaDescripcion'] as string) ?? '',
      fraccionFrancelaria: (item['fraccionArancelariaDescripcion'] as string) ?? '',
      descripcion: (item['descripcionSolicitada'] as string) ?? '',
      precioUnitarioUSD: (item['importeUnitarioUSDAutorizado'] as string) ?? '',
      totalUSD: (item['importeTotalUSDAutorizado'] as string) ?? '',
      fraccionTigiePartidasDeLaMercancia: (item['unidadesAutorizadas'] as string) ?? '',
      fraccionDescripcionPartidasDeLaMercancia: (item['descripcionAutorizada'] as string) ?? '',
    })) ?? [];

    return PARTIDAS_MERCANCIAS;
  }
}