import { Catalogo, CatalogoServices, HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { Solicitud130106State, Tramite130106Store } from '../../../estados/tramites/tramite130106.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130106 } from '../servers/api-routes';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';
import { Tramite130106Query } from '../../../estados/queries/tramite130106.query';

@Injectable({
  providedIn: 'root',
})
/** Servicio responsable de la lógica del trámite 130106
 *.  
 *  Maneja la comunicación con APIs y gestión de estado relacionada. */
export class Solocitud130106Service {
  /**
   * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
   */
  urlServer = ENVIRONMENT.URL_SERVER;
  // URL base para consumir los catálogos auxiliares desde el servidor.
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
  // Identificador del trámite 130106.
  tramiteId: string = '130106';

  /** Constructor que inyecta servicios HTTP y el store del trámite 130106.  
   *  Utilizado para inicializar dependencias necesarias en el componente. */
  constructor(private http: HttpClient, private tramite130106Store: Tramite130106Store,
    private catalogoServices: CatalogoServices, private tramite130106Query: Tramite130106Query, public httpService: HttpCoreService,) {
    // Lógica de inicialización si es necesario
  }
  /** Actualiza el estado del formulario en el store con los datos proporcionados.  
   *  Establece el régimen seleccionado desde el objeto de estado.
   *  */
  actualizarEstadoFormulario(DATOS: Solicitud130106State): void {
    this.tramite130106Store.setRegimen(DATOS.regimen);
    this.tramite130106Store.setClasificacion(DATOS.clasificacion);
    this.tramite130106Store.setSolicitudDescripcion(DATOS.solicitudDescripcion);
    this.tramite130106Store.setFraccion(DATOS.fraccion);
    this.tramite130106Store.setCantidad(DATOS.cantidad);
    this.tramite130106Store.setFactura(DATOS.factura);
    this.tramite130106Store.setUmt(DATOS.umt);
    this.tramite130106Store.setMercanciaCantidad(DATOS.mercanciaCantidad);
    this.tramite130106Store.setMercanciaFactura(DATOS.mercanciaFactura);
    this.tramite130106Store.setDescripcion(DATOS.descripcion);
    this.tramite130106Store.setEspecifico(DATOS.especifico);
    this.tramite130106Store.setJustificacion(DATOS.justificacion);
    this.tramite130106Store.setObservaciones(DATOS.observaciones);
    this.tramite130106Store.setEntidad(DATOS.entidad);
    this.tramite130106Store.setRepresentacion(DATOS.representacion);
    this.tramite130106Store.setBloque(DATOS.bloque);
    this.tramite130106Store.setDisponible(DATOS.disponible);
    this.tramite130106Store.setSeleccionado(DATOS.seleccionado);
    this.tramite130106Store.setSolicitud(DATOS.solicitud);
    this.tramite130106Store.setProducto(DATOS.producto);
    this.tramite130106Store.updateSelectRangoDias(DATOS.selectRangoDias);
  }
  /** Obtiene los datos simulados del registro de toma de muestras de mercancías  
   *  desde un archivo JSON local para el trámite 130106. */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud130106State> {
    return this.http.get<Solicitud130106State>('assets/json/130106/serviciosExtraordinarios.json');
  }

  /** Obtiene el catálogo de regímenes para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de regímenes.
   */
  getRegimenes(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices.regimenesCatalogo(tramitesID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /** Obtiene el catálogo de clasificaciones de régimen para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - An observable that emits a list of classification catalogs for the regime.
   */
  getClasificacionRegimen(tramitesID: string): Observable<Catalogo[]> {
    const PAYLOAD_DATOS = { tramite: 'TITPEX.130106', id: tramitesID };
   return this.catalogoServices.clasificacionRegimenCatalogo('130106', PAYLOAD_DATOS)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /** Obtiene el catálogo de fracciones arancelarias para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de fracciones arancelarias.
   */
  getFraccionesArancelarias(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.getFraccionesCatalogo(tramite).pipe(
      map(res => res?.datos ?? [])
    );
  }
  /** Obtiene el catálogo de unidades de medida para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de unidades de medida.
   */
  getUMTCatalogo(ID: string, FRACCION_ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.unidadesMedidaTarifariaCatalogo(ID, FRACCION_ID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /** Obtiene el catálogo de bloques para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de bloques.
   */
  getBloque(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.tratadosAcuerdoCatalogo(tramite, "TITRAC.TA").pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
    * Obtiene las opciones de solicitud desde un archivo JSON.
    * @returns {Observable<ProductoResponse>}
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130106/solicitude-options.json'
    );
  }

  /**
   * Obtiene las opciones de producto desde un archivo JSON.
   * @returns {Observable<ProductoResponse>}
   */
  getProductoOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130106/producto-otions.json'
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
  getRepresentacionFederal(ID: string, cveEntidad: string): Observable<Catalogo[]> {
    return this.catalogoServices.representacionFederalCatalogo(ID, cveEntidad).pipe(
      map(res => res?.datos ?? [])
    );
  }
   /**
   * Obtiene la lista de países por bloque desde un archivo JSON.
   * @param {number} _bloqueId - El ID del bloque.
   * @returns {Observable<Catalogo[]>}
   */
  getPaisesPorBloque(tramite: string, ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.getpaisesBloqueCatalogo(tramite, ID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
     * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
     *
     * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
     * @returns Observable con la respuesta de la solicitud POST.
     */

//  guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
//     return this.httpService.post<Record<string, unknown>>(PROC_130106.GUARDAR, { body: body });
//   }
   guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(PROC_130106.GUARDAR, body);
    }
  /**
      * Obtiene todos los datos del estado almacenado en el store.
      * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
      */
  getAllState(): Observable<Solicitud130106State> {
    return this.tramite130106Query.selectSolicitud$;
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
    * Genera el payload de datos para el trámite 130106 basado en la información proporcionada.
    *
    * @param {Tramite130106State} item - Objeto que contiene la información del trámite,
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
  getPayloadDatos(item: Solicitud130106State): unknown {
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

}