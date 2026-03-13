import { BUSCAR_CONSULTAR, BUSCAR_INSTRUMENTOS, GUARDAR_API, GUARDAR_PARTIAL_API, MOSTAR_API, MOSTAR_DETALE_API } from '../../../shared/servers/api-route';
import { BuscarApiResponse, BuscarDetalleApiResponse, Dato, InsumosTabla, SolicitudTPLCANR } from '../models/insumos.model';
import { Catalogo, HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { SolicitudDeRegistroTpl120101State, Tramite120101Store } from '../../../estados/tramites/tramite120101.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RespuestaCuposTabla } from '../../120201/models/cupos.model';
import { Tramite120101Query } from '../../../estados/queries/tramite120101.query';

/**
 * @Injectable
 * @description
 * Marca la clase `SolicitudDeRegistroTplService` como un servicio inyectable en Angular.
 * @providedIn 'root' - Indica que el servicio está disponible en el inyector raíz.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudDeRegistroTplService {
  /**
 * @property tablaInsumosTemp
 * @description
 * Almacena temporalmente los datos de la tabla de insumos en el servicio `SolicitudDeRegistroTplService`.
 * @type {InsumosTabla[]}
 */
  private tablaInsumosTemp: InsumosTabla[] = [];

  /**
   * @constructor
   * @description
   * Inicializa el servicio con una instancia de HttpClient para realizar solicitudes HTTP.
   * @param {HttpClient} http - Cliente HTTP para realizar las solicitudes.
   */
  constructor(
    private http: HttpClient,
    private tramite120101Store: Tramite120101Store,
    private tramite120101Query: Tramite120101Query,
    public httpService: HttpCoreService,
  ) {
    //
  }

  /**
   * @method getClasificacionRegimenData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de monedas.
   */
  getClasificacionRegimenData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      'assets/json/120101/clasificacion-del-regimen.json'
    );
  }

  /**
   * @method getPaisData
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de monedas.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/120101/pais.json');
  }

  /**
   * Método para obtener datos de solicitud de tabla de cupos.
   * @returns Observable<ResquestaCatalogos> - Observable que emite la resquesta del cupos.
   * @description Método para obtener el tablón de cupos.
   */
  obtenerTablaDatos(): Observable<RespuestaCuposTabla> {
    return this.http.get<RespuestaCuposTabla>(
      'assets/json/120201/tabla-cupos.json'
    );
  }

  /**
   * @method getEstadosDatos
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de monedas.
   */
  getEstadosDatos(): Observable<Catalogo> {
    return this.http.get<Catalogo>('assets/json/120101/estados.json');
  }

  /**
   * @method getRepresentacionFederalDatos
   * @description
   * Obtiene los datos del catálogo de monedas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable que emite una lista de datos de monedas.
   */
  getRepresentacionFederalDatos(): Observable<Catalogo> {
    return this.http.get<Catalogo>(
      'assets/json/120101/representacion-federal.json'
    );
  }

  /**
 * @method obtenerDatosTablaInsumos
 * @description
 * Obtiene los datos de la tabla de insumos desde un archivo JSON.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos de insumos.
 * - Devuelve un observable que emite una lista de objetos `InsumosTabla`.
 * 
 * @returns {Observable<InsumosTabla[]>} - Un observable que emite los datos de la tabla de insumos.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerDatosTablaInsumos().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerDatosTablaInsumos(): Observable<InsumosTabla[]> {
    return this.http.get<InsumosTabla[]>(
      'assets/json/120101/insumos-tabla.json'
    );
  }

  /**
 * @method obtenerDatosFraccionArancelaria
 * @description
 * Obtiene los datos del catálogo de fracciones arancelarias desde un archivo JSON.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos de fracciones arancelarias.
 * - Devuelve un observable que emite una lista de objetos `Catalogo`.
 * 
 * @returns {Observable<Catalogo[]>} - Un observable que emite los datos del catálogo de fracciones arancelarias.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerDatosFraccionArancelaria().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerDatosFraccionArancelaria(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/120101/pais.json');
  }

  /**
 * @method obtenerDatosEstados
 * @description
 * Obtiene los datos del catálogo de estados desde un archivo JSON.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos de estados.
 * - Devuelve un observable que emite una lista de objetos `Catalogo`.
 * 
 * @returns {Observable<Catalogo[]>} - Un observable que emite los datos del catálogo de estados.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerDatosEstados().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerDatosEstados(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/120101/estados.json');
  }

  /**
 * @method obtenerIndicarData
 * @description
 * Obtiene los datos del catálogo de opciones para el control de tipo radio en el formulario de proceso productivo.
 * 
 * Funcionalidad:
 * - Realiza una solicitud HTTP GET para obtener los datos desde un archivo JSON.
 * - Devuelve un observable que emite una lista de objetos con propiedades `label` y `value`.
 * 
 * @returns {Observable<{ label: string; value: string }[]>} - Un observable que emite los datos del catálogo.
 * 
 * @example
 * this.solicitudDeRegistroTplService.obtenerIndicarData().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  obtenerIndicarData(): Observable<{ label: string; value: string }[]> {
    return this.http.get<{ label: string; value: string }[]>(
      'assets/json/120101/proceso-productivo.json'
    );
  }

  /**
 * @method establecerTablaInsumos
 * @description
 * Establece los datos de la tabla de insumos en el servicio `SolicitudDeRegistroTplService`.
 * 
 * Funcionalidad:
 * - Actualiza la propiedad `tablaInsumosTemp` con los datos proporcionados.
 * - Permite almacenar temporalmente los datos de la tabla de insumos para su uso en otros componentes o servicios.
 * 
 * @param {InsumosTabla[]} data - Lista de objetos `InsumosTabla` que representan los datos de la tabla de insumos.
 * 
 * @example
 * const insumos = [
 *   { descripcionFraccionArancelaria: 'Textiles', fraccionArancelaria: '5201.00.00', paisDeOrigen: 'México' },
 * ];
 * this.solicitudDeRegistroTplService.establecerTablaInsumos(insumos);
 */
  establecerTablaInsumos(data: InsumosTabla[]): void {
    this.tablaInsumosTemp = data;
  }

  /**
 * @method obtenerTablaInsumos
 * @description
 * Obtiene los datos almacenados temporalmente de la tabla de insumos en el servicio `SolicitudDeRegistroTplService`.
 * 
 * Funcionalidad:
 * - Devuelve el contenido de la propiedad `tablaInsumosTemp`, que contiene los datos de la tabla de insumos.
 * 
 * @returns {InsumosTabla[]} - Lista de objetos `InsumosTabla` que representan los datos de la tabla de insumos.
 * 
 * @example
 * const insumos = this.solicitudDeRegistroTplService.obtenerTablaInsumos();
 * console.log(insumos);
 */
  obtenerTablaInsumos(): InsumosTabla[] {
    return this.tablaInsumosTemp;
  }

  /**
 * @method getSolicitudRegistroData
 * @description
 * Obtiene los datos de la solicitud de registro TPL para el trámite 120101 desde un archivo JSON local.
 * 
 * Detalles:
 * - Realiza una petición HTTP GET para recuperar la información de la solicitud de registro almacenada en el archivo `solicitud-de-registro-tpl.json`.
 * - Devuelve un observable que emite un objeto de tipo `SolicitudDeRegistroTpl120101State` con los datos obtenidos.
 * 
 * @returns {Observable<SolicitudDeRegistroTpl120101State>} Observable con los datos de la solicitud de registro TPL.
 * 
 * @example
 * this.solicitudDeRegistroTplService.getSolicitudRegistroData().subscribe(data => {
 *   console.log(data);
 * });
 */
  getSolicitudRegistroData(): Observable<SolicitudDeRegistroTpl120101State> {
    return this.http.get<SolicitudDeRegistroTpl120101State>('assets/json/120101/solicitud-de-registro-tpl.json');
  }

  /**
 * @method actualizarEstadoFormulario
 * @description
 * Actualiza el valor de un campo específico en el store `Tramite120101Store` de manera dinámica.
 * 
 * Detalles:
 * - Utiliza el método `setDynamicFieldValue` del store para modificar el valor del campo indicado.
 * - Permite mantener sincronizado el estado global del trámite con los cambios realizados en el formulario.
 * 
 * @param {string} campo - Nombre del campo que se desea actualizar en el store.
 * @param {unknown} valor - Valor que se asignará al campo especificado.
 * 
 * @example
 * this.actualizarEstadoFormulario('pais', 'México');
 * // Actualiza el campo 'pais' en el store con el valor 'México'.
 */
  actualizarEstadoFormulario(campo: string, valor: unknown): void {
    this.tramite120101Store.setDynamicFieldValue(campo, valor);
  }



      /**
       * Consulta el monto disponible para un trámite específico.
       *
       * @param tramite - Identificador del trámite a consultar.
       * @param body - Objeto de tipo `SolicitudTPLCANR` que contiene los datos necesarios para la consulta.
       * @returns Un observable que emite la respuesta en formato `JSONResponse`.
       */
      getElMontoDisponible(tramite:string, body: SolicitudTPLCANR): Observable<JSONResponse> {
        return this.http.post<JSONResponse>(BUSCAR_CONSULTAR(tramite), body).pipe(
          map((response) => response)
        );
      }
 /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<SolicitudDeRegistroTpl120101State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<SolicitudDeRegistroTpl120101State> {
    return this.tramite120101Query.allStoreData$;
  }


/**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(body['insumos'] ? GUARDAR_API('sat-t120101') : GUARDAR_PARTIAL_API('sat-t120101'), { body: body });
  }

/**
 * Realiza una solicitud HTTP POST para guardar parcialmente los datos proporcionados en el cuerpo.
 *
 * @param body Un objeto que contiene los datos a guardar parcialmente.
 * @returns Un Observable que emite la respuesta JSON del servidor.
 */
 guardarPartialPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>( GUARDAR_PARTIAL_API('sat-t120101'), { body: body });
  }

/**
 * Realiza una solicitud POST al API para obtener el detalle de una solicitud específica.
 *
 * @param body - Objeto con los parámetros necesarios para la consulta del detalle.
 * @returns Un observable que emite la respuesta JSON del API con la información solicitada.
 */
 getMostrarDetalle(body: Dato): Observable<BuscarDetalleApiResponse> {
    return this.httpService.post<BuscarDetalleApiResponse>(MOSTAR_DETALE_API('sat-t120101'), { body: body });
  }

  /**
   * Obtiene los datos a mostrar para una solicitud específica.
   *
   * @param idSolicitud - El identificador numérico de la solicitud.
   * @returns Un Observable que emite la respuesta JSON con los datos de la solicitud.
   */
   getMostrarDatos(idSolicitud: string | null): Observable<JSONResponse> {
    return this.httpService.get<JSONResponse>(MOSTAR_API('sat-t120101',idSolicitud));
  }

  /**
   * Realiza una solicitud POST para buscar datos relacionados con instrumentos del trámite "120101".
   *
   * @param body - Objeto que contiene los parámetros de búsqueda requeridos por la API.
   * @returns Un observable que emite la respuesta de la API con los datos encontrados.
   */
   getBuscarDatos(body: any): Observable<BuscarApiResponse> {
    return this.http.post<BuscarApiResponse>(BUSCAR_INSTRUMENTOS("120101"), body).pipe(
      map((response) => response)
    );
  }
}
