import { Catalogo, CatalogoServices, JSONResponse } from '@ng-mf/data-access-user';
import { Observable, map } from 'rxjs';
import { Tramite130113State, Tramite130113Store } from '../estados/tramites/tramites130113.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PROC_130113 } from '../servers/api-route';
import { Tramite130113Query } from '../estados/queries/tramite130113.query';


/**
 * 
 * Servicio que proporciona métodos para obtener datos relacionados con el trámite de importación
 * de material de investigación científica. Este servicio realiza solicitudes HTTP para obtener
 * datos desde archivos JSON estáticos.
 *
 * @decorador @Injectable
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionEquipoAnticontaminanteService {
  /**
   * 
   * Constructor del servicio. Inyecta el cliente HTTP para realizar solicitudes.
   * {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient, public tramite130113Query: Tramite130113Query, private tramite130113Store: Tramite130113Store, private catalogoServices: CatalogoServices) {
    /**
     * Constructor vacío.
     */
  }

  /**
   * Actualiza el estado del formulario en el store.
   * @param DATOS Estado actualizado del trámite.
   */
  /**
    * Actualiza el estado del formulario en el store.
    * @param DATOS Estado actualizado del trámite.
    */
  actualizarEstadoFormulario(DATOS: Record<string, unknown[]>): void {
    const REPRESENTACION_FEDERAL = DATOS['representacionFederal'] as unknown as Record<string, unknown>;
    const MERCANCIAS_DATA = DATOS['mercancia'] as unknown as Record<string, unknown>;
    const PARTIDAS_MERCANCIA = (MERCANCIAS_DATA?.['partidasMercancia'] as Record<string, unknown>[] | undefined) ?? [];

    const PARTIDAS_MERCANCIA_DATOS = PARTIDAS_MERCANCIA?.map((item: Record<string, unknown>, index: number) => ({
      id: index.toString(),
      cantidad: (item['unidadesSolicitadas'] as string),
      unidadDeMedida: (item['unidadMedidaDescripcion'] as string),
      fraccionFrancelaria: (item['fraccionArancelariaClave'] as string),
      descripcion: (item['descripcionSolicitada'] as string),
      precioUnitarioUSD: (item['importeUnitarioUSDAutorizado'] as string),
      totalUSD: (item['importeTotalUSDAutorizado'] as string),
      fraccionTigiePartidasDeLaMercancia: (item['unidadesAutorizadas'] as string),
      fraccionDescripcionPartidasDeLaMercancia: (item['descripcionAutorizada'] as string),
    })) ?? [];

    const TOTAL_CANTIDAD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['unidadesSolicitadas']) || 0);
    }, 0);

    const TOTAL_VALOR_USD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['importeTotalUSDAutorizado']) || 0);
    }, 0);

    const JSON_MOSTRAR = {
      idSolicitud: DATOS?.['idSolicitud'] as unknown as number || 0,
      filaSeleccionada: [],
      mostrarTabla: false,
      solicitud: (DATOS?.['tipo_solicitud_pexim'] as unknown as string) || '',
      fraccion: (MERCANCIAS_DATA?.['fraccionArancelaria'] as Record<string, unknown>)?.['cveFraccion'] as string || '',
      producto: (MERCANCIAS_DATA?.['condicionMercancia'] as unknown as string) || '',
      descripcion: PARTIDAS_MERCANCIA[0]['descripcionSolicitada'] as string || '',
      cantidad: PARTIDAS_MERCANCIA[0]['unidadesAutorizadas'] as string || '',
      valorPartidaUSD: 0,
      unidadMedida: PARTIDAS_MERCANCIA[0]['unidadMedidaClave'] as string || '',
      regimen: (DATOS?.['cve_regimen'] as unknown as string) || '',
      clasificacion: (DATOS?.['cve_clasificacion_regimen'] as unknown as string) || '',
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      valorFacturaUSD: PARTIDAS_MERCANCIA[0]['importeTotalUSD'] as string || '',
      bloque: '',
      usoEspecifico: MERCANCIAS_DATA?.["usoEspecifico"] as string || '',
      justificacionImportacionExportacion: MERCANCIAS_DATA?.["justificacionImportacionExportacion"] as string || '',
      observaciones: MERCANCIAS_DATA?.["observaciones"] as string || '',
      entidad: REPRESENTACION_FEDERAL['cve_entidad_federativa'] as string || '',
      representacion: REPRESENTACION_FEDERAL['cve_unidad_administrativa'] as string || '',
      modificarPartidasDelaMercanciaForm: {
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
        fraccionTigiePartidasDeLaMercancia: '',
        fraccionDescripcionPartidasDeLaMercancia: '',
      },
      mostrarPartidas: [],
      cantidadTotal: TOTAL_CANTIDAD.toString(),
      valorTotalUSD: TOTAL_VALOR_USD.toString(),
      fechasSeleccionadas: DATOS?.['listaPaises'] as unknown as string[] || [],
      tableBodyData: PARTIDAS_MERCANCIA_DATOS || [],
    }
    this.tramite130113Store.actualizarEstado(JSON_MOSTRAR);

  }

  /**
   * Construye el estado del trámite a partir de los datos proporcionados.
   * @param DATOS Datos obtenidos del servicio.
   * @returns Estado del trámite construido.
   */
  reverseBuildSolicitud130113(DATOS: Record<string, unknown[]>): Record<string, unknown> {
    const REPRESENTACION_FEDERAL = DATOS['representacionFederal'] as unknown as Record<string, unknown>;
    const MERCANCIAS_DATA = DATOS['mercancia'] as unknown as Record<string, unknown>;
    const PARTIDAS_MERCANCIA = (MERCANCIAS_DATA?.['partidasMercancia'] as Record<string, unknown>[] | undefined) ?? [];

    const PARTIDAS_MERCANCIA_DATOS = PARTIDAS_MERCANCIA?.map((item: Record<string, unknown>, index: number) => ({
      id: index.toString(),
      cantidad: (item['unidadesSolicitadas'] as string),
      unidadDeMedida: (item['unidadMedidaDescripcion'] as string),
      fraccionFrancelaria: (item['fraccionArancelariaClave'] as string),
      descripcion: (item['descripcionSolicitada'] as string),
      precioUnitarioUSD: (item['importeUnitarioUSDAutorizado'] as string),
      totalUSD: (item['importeTotalUSDAutorizado'] as string),
      fraccionTigiePartidasDeLaMercancia: (item['unidadesAutorizadas'] as string),
      fraccionDescripcionPartidasDeLaMercancia: (item['descripcionAutorizada'] as string),
    })) ?? [];

    const TOTAL_CANTIDAD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['unidadesSolicitadas']) || 0);
    }, 0);

    const TOTAL_VALOR_USD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['importeTotalUSDAutorizado']) || 0);
    }, 0);

    return {
      idSolicitud: DATOS?.['idSolicitud'] as unknown as number || 0,
      filaSeleccionada: [],
      mostrarTabla: false,
      solicitud: (DATOS?.['tipo_solicitud_pexim'] as unknown as string) || '',
      fraccion: (MERCANCIAS_DATA?.['fraccionArancelaria'] as Record<string, unknown>)?.['cveFraccion'] as string || '',
      producto: (MERCANCIAS_DATA?.['condicionMercancia'] as unknown as string) || '',
      descripcion: PARTIDAS_MERCANCIA[0]['descripcionSolicitada'] as string || '',
      cantidad: PARTIDAS_MERCANCIA[0]['unidadesAutorizadas'] as string || '',
      valorPartidaUSD: 0,
      unidadMedida: PARTIDAS_MERCANCIA[0]['unidadMedidaClave'] as string || '',
      regimen: (DATOS?.['cve_regimen'] as unknown as string) || '',
      clasificacion: (DATOS?.['cve_clasificacion_regimen'] as unknown as string) || '',
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      valorFacturaUSD: PARTIDAS_MERCANCIA[0]['importeTotalUSD'] as string || '',
      bloque: '',
      usoEspecifico: MERCANCIAS_DATA?.["usoEspecifico"] as string || '',
      justificacionImportacionExportacion: MERCANCIAS_DATA?.["justificacionImportacionExportacion"] as string || '',
      observaciones: MERCANCIAS_DATA?.["observaciones"] as string || '',
      entidad: REPRESENTACION_FEDERAL['cve_entidad_federativa'] as string || '',
      representacion: REPRESENTACION_FEDERAL['cve_unidad_administrativa'] as string || '',
      modificarPartidasDelaMercanciaForm: {
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
      },
      mostrarPartidas: [],
      cantidadTotal: TOTAL_CANTIDAD.toString(),
      valorTotalUSD: TOTAL_VALOR_USD.toString(),
      fechasSeleccionadas: DATOS?.['listaPaises'] as unknown as string[] || [],
      tableBodyData: PARTIDAS_MERCANCIA_DATOS || [],
    };
  }
  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite130113State> {
    return this.tramite130113Query.selectSolicitud$;
  }

  /**
   * Genera el payload de datos a partir del estado del trámite 130113.
   *
   * Este método toma la información contenida en el estado (`Tramite130113State`)
   * y construye un arreglo de objetos con los valores necesarios para enviar al
   * backend, principalmente para las partidas de la mercancía.  
   *
   * Si `tableBodyData` no es un arreglo válido, se utiliza un arreglo vacío para
   * evitar errores.
   *
   * @param {Tramite130113State} item - Estado actual del trámite con la información
   *        capturada y calculada por el usuario.
   *
   * @returns {unknown} Arreglo de objetos con el payload listo para enviarse.
   */
  getPayloadDatos(item: Tramite130113State): unknown {
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
      unidadMedidaClave: item.unidadMedida,
      unidadMedidaDescripcion: row.unidadDeMedida
    }));
  }

  /**
   * Obtiene los datos de la solicitud.
   * @returns Observable con los datos de la solicitud.
   */
  getDatosDeLaSolicitud(): Observable<Tramite130113State> {
      return this.http.get<Tramite130113State>('assets/json/130113/datos-de-la-solicitud.json');
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
    const PAYLOAD_DATOS = { tramite: 'TITPEX.130113', id: tramitesID };
    return this.catalogoServices.clasificacionRegimenCatalogo('130113', PAYLOAD_DATOS)
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
    return this.catalogoServices.fraccionesArancelariasCatalogo(ID, 'TITPEX.130113')
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
    return this.catalogoServices.unidadesMedidasTarifariasCatalogo(ID, FRACCION_ID)
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
  getMostrarPartidasService(solicitud_id: number): Observable<JSONResponse> {
    const ENDPOINT = PROC_130113.MOSTAR_PARTIDAS + solicitud_id;
    return this.http.get<JSONResponse>(ENDPOINT);
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
   * Obtiene las descripciones de las fracciones arancelarias correspondientes
   * al trámite especificado y las devuelve en forma de catálogo.
   *
   * Este método consume el servicio `getFraccionesArancelariasAutoCompleteCatalogo`,
   * el cual retorna un objeto que contiene la propiedad `datos`.  
   * Si la respuesta no contiene datos válidos, se retorna un arreglo vacío.
   *
   * @param {string} tramite - Identificador del trámite para el cual se realiza la consulta.
   * @param {string} ID - Clave o término que se utilizará para filtrar la fracción arancelaria.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de elementos del catálogo.
   */
  getFraccionDescripcionPartidasDeLaMercanciaService(tramite: string, ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.getFraccionesArancelariasAutoCompleteCatalogo(tramite, ID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130113.GUARDAR, body);
  }
}