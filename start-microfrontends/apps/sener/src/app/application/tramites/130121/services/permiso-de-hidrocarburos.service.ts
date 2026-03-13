import { Catalogo } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartidasDeLaMercanciaModelo } from '../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';

/**
 * Servicio para gestionar las operaciones relacionadas con permisos de hidrocarburos.
 * Proporciona métodos para obtener datos desde archivos JSON.
 */
@Injectable({
  providedIn: 'root',
})
export class PermisoDeHidrocarburosService {
  /**
   * Constructor del servicio.
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {
    //
  }

  /**
   * Obtiene la lista de países disponibles desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de países disponibles.
   */
  getListaDePaisesDisponibles(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130121/pais-procenia.json');
  }

  /**
 * @description
 * Método para obtener la lista de todas las ciudades disponibles desde un archivo JSON local.
 * Este método realiza una solicitud HTTP para cargar los datos y los emite como un observable.
 *
 * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos
 * de tipo `Catalogo`, representando las ciudades disponibles.
 *
 * @example
 * // Ejemplo de uso:
 * this.permisoDeHidrocarburosService.obtenerListaDeCiudades().subscribe((ciudades) => {
 *   console.log(ciudades);
 * });
 */
  obtenerListaDeCiudades (): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130121/todas-las-ciudades.json');
  }

  /**
   * Obtiene la lista de países por bloque desde un archivo JSON.
   * @param {number} _bloqueId - El ID del bloque.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de países por bloque.
   */
  getPaisesPorBloque(_bloqueId: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130121/paises-por-bloque.json'
    );
  }

  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de entidades federativas.
   */
  getEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130121/estado.json'
    );
  }

  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de representaciones federales.
   */
  getRepresentacionFederal(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130121/representacion-federal.json'
    );
  }

  /**
   * Obtiene las opciones de solicitud desde un archivo JSON.
   * @returns {Observable<ProductoResponse>} Observable que emite las opciones de solicitud.
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130121/solicitude-options.json'
    );
  }

  /**
   * Obtiene las opciones de producto desde un archivo JSON.
   * @returns {Observable<ProductoResponse>} Observable que emite las opciones de producto.
   */
  getProductoOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130121/plazo-options.json'
    );
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
 * this.permisoDeHidrocarburosService.getTablaDatos().subscribe((datos) => {
 *   console.log(datos);
 * });
 */
  getTablaDatos(): Observable<PartidasDeLaMercanciaModelo[]> {
    return this.http.get<PartidasDeLaMercanciaModelo[]>(
          'assets/json/130121/partidas-de-la.json'
        );
  }
}