import { Catalogo, CatalogoServices, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { Tramite130203State, Tramite130203Store } from '../estados/tramites/tramites130203.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130203 } from '../servers/api-route';
import { PartidasDeLaMercanciaModelo } from '../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';
import { Tramite130203Query } from '../estados/queries/tramite130203.query';

@Injectable({
  providedIn: 'root',
})
export class ExportacionDeDiamantesEnBrutoService {
  constructor(private http: HttpClient, private tramite130203Store: Tramite130203Store, private tramite130203Query: Tramite130203Query, private catalogoServices: CatalogoServices) {
    //
  }

  /**
   * Obtiene la lista de países disponibles desde un archivo JSON.
   * @returns {Observable<Catalogo[]>}
   */
  getListaDePaisesDisponibles(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.tratadosAcuerdoCatalogo(tramite, 'TITRAC.TA')
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene la lista de países por bloque desde un archivo JSON.
   * @param {string} tramite - El trámite asociado.
   * @param {string} bloqueId - El ID del bloque.
   * @returns {Observable<Catalogo[]>}
   */

  getPaisesPorBloque(tramite: string, bloqueId: string): Observable<Catalogo[]> {
    return this.catalogoServices.getpaisesBloqueCatalogo(tramite, bloqueId)
      .pipe(
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
   *  Obtiene el catálogo de fracciones arancelarias asociado a un identificador.
   * @param ID Identificador para obtener las fracciones arancelarias
   * @returns Observable con un arreglo de fracciones arancelarias (o vacío si no hay datos)
   */
  getFraccionCatalogoService(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.getFraccionesCatalogo(ID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>}
   */
  getEntidadFederativa(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.estadosCatalogo(ID).pipe(map(res => res?.datos ?? []));
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
   * Obtiene la lista de representaciones federales desde un archivo JSON.
   * @returns {Observable<Catalogo[]>}
   */
  getRepresentacionFederal(tramite: string, cveEntidad: string): Observable<Catalogo[]> {
    return this.catalogoServices.representacionFederalCatalogo10(tramite, cveEntidad).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene las opciones de solicitud desde un archivo JSON.
   * @returns {Observable<ProductoResponse>}
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130203/solicitude-options.json'
    );
  }

  /**
   * Obtiene las opciones de producto desde un archivo JSON.
   * @returns {Observable<ProductoResponse>}
   */
  getProductoOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130203/producto-options.json'
    );
  }

  getRegimenOptions(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.regimenesCatalogo(tramite).pipe(map(res => res?.datos ?? []));
  }

getClasificacionRegimenCatalogo(regimenId: string): Observable<Catalogo[]> {
  const ENDPOINT = PROC_130203.CLASIFICACION_REGIMEN(regimenId);
  return this.http.get<{ datos: Catalogo[] }>(ENDPOINT).pipe(
    map(res => res?.datos ?? [])
  );
}

  /**
   * Obtiene la lista de países emisores desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable con el catálogo de países emisores.
   */
  getPaisesEmisores(tramites: string): Observable<Catalogo[]> {
    return this.catalogoServices.paisesCatalogo(tramites)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  getPaisesEmisor(pais: string): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${PROC_130203.PAISES_EMISOR}${pais}`);
  }

  /**
  * Obtiene los nombres en inglés desde un archivo JSON local.  
  */
  getNombresIngles(): Observable<string[]> {
    return this.http.get<string[]>(
      'assets/json/130203/nomber-en-ingles-del.json'
    );
  }

  /**
   * Obtiene la tabla de datos de partidas de la mercancía desde un archivo JSON.
   * @returns {Observable<PartidasDeLaMercanciaModelo[]>} Un observable con las partidas de mercancía.
   */
  getTablaDatos(): Observable<PartidasDeLaMercanciaModelo[]> {
    return this.http.get<PartidasDeLaMercanciaModelo[]>(
      'assets/json/130203/partidas-de-la.json'
    );
  }

  /**
   * Obtiene el nombre del exportador desde un archivo JSON.
   * @returns {Observable<string>} Un observable con el nombre del exportador.
  */
  getNombreExporter(): Observable<string> {
    return this.http
      .get<{ nombreExportador: string }>(
        'assets/json/130203/nombre-exporter.json'
      )
      .pipe(map((response) => response.nombreExportador));
  }

  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Tramite130203State): void {
    this.tramite130203Store.actualizarEstado(DATOS);
  }

  /**
  * Obtiene los datos de la solicitud.
  * @returns Observable con los datos de la solicitud.
  */
  getDatosDeLaSolicitud(): Observable<Tramite130203State> {
    return this.http.get<Tramite130203State>('assets/json/130203/datos-de-la-solicitud.json');
  }

  /**
       * Obtiene todos los datos del estado almacenado en el store.
       * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
       */
  getAllState(): Observable<Tramite130203State> {
    return this.tramite130203Query.selectSolicitud$;
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
    getPayloadDatos(item: Tramite130203State): unknown {
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
         * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
         *
         * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
         * @returns Observable con la respuesta de la solicitud POST.
         */
      guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
        return this.http.post<JSONResponse>(PROC_130203.GUARDAR, body);
      }
}
