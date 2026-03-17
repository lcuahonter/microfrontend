import { Catalogo } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartidasDeLaMercanciaModelo } from '../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';


/**
 * Servicio que maneja la exportación de datos relacionados con minerales de hierro.
 * Proporciona métodos para obtener información sobre países, ciudades, bloques, estados,
 * representación federal, y opciones de productos.
 * 
 * @export
 * @class ExportacionMineralesDeHierroService
 */
@Injectable({
  providedIn: 'root',
})
export class ExportacionMineralesDeHierroService {

  /**
   * Crea una instancia del servicio `ExportacionMineralesDeHierroService`.
   * @param {HttpClient} http - El cliente HTTP que se usa para realizar solicitudes.
   */
  constructor(private http: HttpClient) {
    // Constructor del servicio, inyecta HttpClient para realizar peticiones HTTP.
  }

  /**
   * Obtiene la lista de países disponibles desde un archivo JSON.
   * 
   * @description Método para cargar la lista de países desde un archivo local en formato JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de objetos Catalogo.
   */
  getListaDePaisesDisponibles(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130108/pais-procenia.json');
  }

  /**
   * Obtiene la lista de todas las ciudades disponibles desde un archivo JSON.
   * 
   * @description Método para cargar la lista de ciudades desde un archivo local en formato JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de objetos Catalogo.
   */
  obtenerListaDeCiudades(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130108/todas-las-ciudades.json');
  }

  /**
   * Obtiene la lista de países por bloque, basada en el ID de bloque proporcionado.
   * 
   * @description Método que permite obtener los países que pertenecen a un bloque específico,
   * usando un archivo JSON local.
   * 
   * @param {number} _bloqueId - El ID del bloque cuyo país se desea obtener.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de países en el bloque.
   */
  getPaisesPorBloque(_bloqueId: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130108/paises-por-bloque.json');
  }

  /**
   * Obtiene el estado actual desde un archivo JSON.
   * 
   * @description Método para cargar el estado desde un archivo local en formato JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de objetos Catalogo
   * que representan los estados.
   */
  getEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130108/estado.json');
  }

  /**
   * Obtiene la representación federal desde un archivo JSON.
   * 
   * @description Método para cargar la representación federal desde un archivo local en formato JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de objetos Catalogo
   * que representan las representaciones federales.
   */
  getRepresentacionFederal(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130108/representacion-federal.json');
  }

  /**
   * Obtiene las opciones de solicitud disponibles desde un archivo JSON.
   * 
   * @description Método para cargar las opciones de solicitud desde un archivo local en formato JSON.
   * @returns {Observable<ProductoResponse>} Observable que emite las opciones de solicitud disponibles.
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>('assets/json/130108/solicitude-options.json');
  }

  /**
   * Obtiene las opciones de producto disponibles desde un archivo JSON.
   * 
   * @description Método para cargar las opciones de productos desde un archivo local en formato JSON.
   * @returns {Observable<ProductoResponse>} Observable que emite las opciones de producto disponibles.
   */
  getProductoOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>('assets/json/130108/producto-otions.json');
  }

  /**
 * @description
 * Método para obtener los datos de la tabla de partidas de la mercancía desde un archivo JSON local.
 * Este método realiza una solicitud HTTP para cargar los datos y los emite como un observable.
 *
 * @returns {Observable<PartidasDeLaMercanciaModelo[]>} Observable que emite un arreglo de objetos
 * de tipo `PartidasDeLaMercanciaModelo`, representando las partidas de la mercancía.
 *
 * @example
 * // Ejemplo de uso:
 * this.exportacionMineralesDeHierroService.getTablaDatos().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  getTablaDatos(): Observable<PartidasDeLaMercanciaModelo[]> {
    return this.http.get<PartidasDeLaMercanciaModelo[]>(
          'assets/json/130108/partidas-de-la.json'
        );
  }
}
