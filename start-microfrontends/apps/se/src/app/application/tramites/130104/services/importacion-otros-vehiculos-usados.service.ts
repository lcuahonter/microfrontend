/**
 * ImportacionOtrosVehiculosUsadosService
 */
import { Catalogo, CatalogoServices, HttpCoreService, JSONResponse, JsonResponseCatalogo, MERCANCIAS_DATA } from '@ng-mf/data-access-user';
import { Observable, map } from 'rxjs';
import { Tramite130104State, Tramite130104Store } from '../../../estados/tramites/tramite130104.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PROC_130104 } from '../servers/api-route';
import { Tramite130104Query } from '../../../estados/queries/tramite130104.query';

/**
 * ImportacionOtrosVehiculosUsadosService
 **/

@Injectable({
  providedIn: 'root',
})
export class ImportacionOtrosVehiculosUsadosService {
  constructor(private http: HttpClient,
    private tramite130104Store: Tramite130104Store,
    private tramite130104Query: Tramite130104Query,
    public httpService: HttpCoreService,
    private catalogoServices: CatalogoServices
  ) {
    //
  }

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
      },
      mostrarPartidas: [],
      cantidadTotal: TOTAL_CANTIDAD.toString(),
      valorTotalUSD: TOTAL_VALOR_USD.toString(),
      fechasSeleccionadas: DATOS?.['listaPaises'] as unknown as string[] || [],
      tableBodyData: PARTIDAS_MERCANCIA_DATOS || [],
    }
    this.tramite130104Store.actualizarEstado(JSON_MOSTRAR);

  }

  /**
   *  Construye el estado del formulario a partir de los datos obtenidos.
   * @param DATOS Datos obtenidos de la solicitud.
   * @returns Estado del formulario mapeado.
   */
  reverseBuildSolicitud130104(DATOS: Record<string, unknown[]>): Record<string, unknown> {
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
  * Obtiene los datos de la solicitud.
  * @returns Observable con los datos de la solicitud.
  */
  getDatosDeLaSolicitud(solicitud_id: string): Observable<JSONResponse> {
    const ENDPOINT = PROC_130104.MOSTAR + solicitud_id;
    return this.http.get<JSONResponse>(ENDPOINT);
  }

  /**
    * Obtiene todos los datos del estado almacenado en el store.
    * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
    */
  getAllState(): Observable<Tramite130104State> {
    return this.tramite130104Query.selectSolicitud$;
  }

  /**
   * Obtiene el catálogo de estados desde el servidor.
   *
   * Realiza una petición HTTP GET al endpoint `/api/catalogo/estados` y retorna la respuesta
   * como un observable de tipo `JsonResponseCatalogo`.
   *
   * @returns Observable que emite la respuesta del catálogo de estados.
   */
  getTipoFactura(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_130104.TIPO_FACTURA,
      {},
      false
    );
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
   * Obtiene la lista completa de países desde el servidor.
   * @param tramite Identificador del trámite o tipo de operación para la consulta del catálogo.
   * @returns Observable con un arreglo de elementos del catálogo de países.
   */
  getPaisesTodoService(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.todosPaisesSeleccionados(tramite)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
  * Obtiene la lista de entidades federativas desde un archivo JSON.
  * @returns {Observable<Catalogo[]>}
  */
  getEntidadFederativa(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.entidadesFederativasCatalogo(tramite).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON.
   * @returns {Observable<Catalogo[]>}
   */
  getRepresentacionFederal(tramite: string, _cveEntidad: string): Observable<Catalogo[]> {
    return this.catalogoServices.representacionFederalCatalogo(tramite, "MEX").pipe(
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
   * Obtiene el catálogo de clasificaciones de régimen asociado a un trámite.
   * @param tramitesID Identificador del trámite
   * @returns Observable con un arreglo de clasificaciones de régimen (o vacío si no hay datos)
   */
  getClasificacionRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    const PAYLOAD_DATOS = { tramite: 'TITPEX.130108', id: tramitesID };
    return this.catalogoServices.clasificacionRegimenCatalogo('130104', PAYLOAD_DATOS)
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
    return this.catalogoServices.fraccionesArancelariasCatalogo(ID, 'TITPEX.130104')
      .pipe(
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
   *  Obtiene el catálogo de mostrar partidas asociado a un trámite e identificador.
   * @param tramite Identificador del trámite
   * @param ID Identificador para obtener las mostrar partidas
   * @returns Observable con un arreglo de mostrar partidas (o vacío si no hay datos)
   */
  getMostrarPartidasService(solicitud_id: number): Observable<BaseResponse<MostrarPartidas[]>> {
    const ENDPOINT = PROC_130104.MOSTAR_PARTIDAS + solicitud_id;
    return this.http.get<BaseResponse<MostrarPartidas[]>>(ENDPOINT);
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
    return this.http.post<Record<string, unknown>>(PROC_130104.GUARDAR, body);
  }

  /**
   * Genera el payload de datos para el trámite 130104 basado en la información proporcionada.
   *
   * @param {Tramite130104State} item - Objeto que contiene la información del trámite,
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
  getPayloadDatos(item: Tramite130104State): unknown {
    const ROWS = Array.isArray(item.tableBodyData) ? item.tableBodyData : [];
    return ROWS.map((row: any) => ({
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
      unidadMedidaDescripcion: "Pieza"
    }));
  }

  /**
   * Genera el payload de mercancia para el trámite 130104 basado en la información proporcionada.
   */
  getPayloadMercancia(item: Tramite130104State): unknown {
    return {
      "cantidadComercial": 0,
      "cantidadTarifaria": Number(item.cantidad),
      "valorFacturaUSD": Number(item.valorFacturaUSD),
      "condicionMercancia": item.producto,
      "descripcion": item.descripcion,
      "usoEspecifico": item.usoEspecifico,
      "justificacionImportacionExportacion": item.justificacionImportacionExportacion,
      "observaciones": item.observaciones,
      "unidadMedidaTarifaria": {
        "clave": item.unidadMedida
      },
      "fraccionArancelaria": {
        "cveFraccion": item.fraccion
      },
      "partidasMercancia": this.getPayloadDatos(item),
    };
  }

  /**
   * Genera el payload de productor para el trámite 130104.
   */
  getPayloadProductor(): unknown {
    return {
      "tipo_persona": true,
      "nombre": "Juan",
      "apellido_materno": "López",
      "apellido_paterno": "Norte",
      "razon_social": "Aceros Norte",
      "descripcion_ubicacion": "Calle Acero, No. 123, Col. Centro",
      "rfc": "AAL0409235E6",
      "pais": "SIN"
    };
  }

  /**
   * Genera el payload de solicitante para el trámite 130104.
   */
  getPayloadSolicitante(): unknown {
    return {
      "rfc": "AAL0409235E6",
      "nombre": "Juan Pérez",
      "es_persona_moral": true,
      "certificado_serial_number": "string"
    };
  }

  /**
   * Genera el payload de representación federal para el trámite 130104.
   */
  getPayloadRepresentacionFederal(item: Tramite130104State): unknown {
    return {
      "cve_entidad_federativa": item.entidad,
      "cve_unidad_administrativa": item.representacion
    };
  }

  /**
   * Genera el payload de entidad federativa para el trámite 130104.
   */
  getPayloadEntidadFederativa(item: Tramite130104State): unknown {
    return {
      "cveEntidad": item.entidad
    };
  }

}
