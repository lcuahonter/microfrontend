import { AvisoTablaDatos, CatalogoLista, DatosSolicitante } from '../models/avios-model';
import { Solicitud32505State, Tramite32505Store } from '../../../estados/tramites/trimite32505.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';

@Injectable({
  providedIn: 'any'
})
export class AvisoService {

  /**
   * Constructor del servicio.
   * Se utiliza para la inyección de dependencias.
   *
   * @param http Cliente HTTP para realizar solicitudes a servicios externos.
   */
  constructor(
    private http: HttpClient, private tramite32505Store: Tramite32505Store
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /**
     * Actualiza el estado global del formulario con los datos proporcionados.
     * @param DATOS Objeto con los datos del formulario de tipo Solicitud32505State.
     */
  actualizarEstadoFormulario(DATOS: Solicitud32505State): void {
    this.tramite32505Store.setAdace(DATOS.adace);
    this.tramite32505Store.setPais(DATOS.pais);
    this.tramite32505Store.setAnio(DATOS.anio);
    this.tramite32505Store.setTipoBusqueda(DATOS.tipoBusqueda);
  }
  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consulta_11201.json`.
   * 
   * @returns {Observable<Solicitud32505State>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<Solicitud32505State> {
    return this.http.get<Solicitud32505State>('assets/json/32505/consulta_32505.json');
  }
  /**
    * Obtiene los datos del solicitante.
    * 
    * @returns {Observable<DatosSolicitante>} Un observable con los datos del solicitante.
    */
  obtenerDatosSolicitante(): Observable<DatosSolicitante> {
    return this.http.get<DatosSolicitante>(`assets/json/32505/datosSolicitante.json`);
  }

  /**
  * Obtiene los datos de la tabla de aviso.
  * 
  * @returns {Observable<AvisoTablaDatos>} Un observable con los datos de la tabla de aviso.
  */
  obtenerAvisoTabla(): Observable<AvisoTablaDatos> {
    return this.http.get<AvisoTablaDatos>(`assets/json/32505/aviso-tabla.json`);
  }

  /**
   * Obtiene la lista de columnas para la tabla de aviso.
   * 
   * @returns {Observable<ColumnasTabla>} Un observable con la lista de columnas.
   */
  obtenerAduana(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/32505/aduana.json');
  }

  /**
   * Obtiene la lista de combustibles.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de combustibles.
   */
  obtenerCombustible(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/32505/combustible.json');
  }

  /**
   * Obtiene la lista de cilindros.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de cilindros.
   */
  obtenerCilindros(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/32505/cilindros.json');
  }

  /**
   * Obtiene la lista de años modelo.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de años modelo.
   */
  obtenerAnoModelo(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/32505/ano-modelo.json');
  }

  /**
   * Obtiene la lista de países emitidos.
   * 
   * @returns {Observable<CatalogoLista>} Un observable con la lista de países emitidos.
   */
  obtenerPaisIssued(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/32505/pais-issued.json');
  }


  /**
 * Obtiene la lista de países disponibles.
 * 
 * Este método realiza una solicitud HTTP para obtener los datos de países desde un archivo JSON.
 * 
 * @returns {Observable<CatalogoLista>} Un observable que emite la lista de países.
 */
  obtenerPais(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/32505/pais.json');
  }

  /**
   * Obtiene la lista de años disponibles.
   * @returns {Observable<CatalogoLista>} Un observable que emite la lista de países.
   */
  obtenerAnio(): Observable<CatalogoLista> {
    return this.http
      .get<CatalogoLista>('assets/json/32505/years.json');
  }

  /**
  * Obtiene la lista de tipos de documentos.
  * @returns {Observable<CatalogoLista>} Un observable que emite la lista de tipos de documentos.
  * */
  getFraccionArancelariaCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32502/fraccion-arancelaria-catalogo.json');
  }
  /**
     * Obtiene la lista de tipos de documentos.
     * @returns {Observable<CatalogoLista>} Un observable que emite la lista de tipos de documentos.
     * */
  getFraccionReglaCatalogo(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32502/fraccion-regla-catalogo.json');
  }
  /**
     * Obtiene la lista de tipos de documentos.
     * @returns {Observable<CatalogoLista>} Un observable que emite la lista de tipos de documentos.
     * */
  getTipoDocumento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/32502/tipoDocumento.json');
  }


}
