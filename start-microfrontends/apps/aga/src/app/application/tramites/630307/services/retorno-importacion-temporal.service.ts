/**
 * retorno-importacion-temporal.service.ts
 * servicio para gestionar solicitudes relacionadas con el trámite 630307.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Catalogo,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src';
import { Tramite630307State, Tramite630307Store } from '../estados/tramite630307.store';
/**
 * Servicio que gestiona las solicitudes relacionadas con el trámite 630307.
 * Proporciona métodos para obtener datos desde archivos JSON locales, como aduanas, prórrogas, propietarios y tipos de propietarios.
 */
@Injectable({
  providedIn: 'root',
})
export class RetornoImportacionTemporalService {
  /**
   * Constructor del servicio.
   *
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient,private tramite630307store: Tramite630307Store) {}

  /**
   * Obtiene la lista de secciones aduaneras desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getSeccionAduanera(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/630307/seccion-aduanera.json'
    );
  }

  /**
   * Obtiene la lista de aduanas de ingreso desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getAduanaDeIngreso(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/630307/aduana-de-ingreso.json'
    );
  }

  /**
   * Obtiene la lista de prórrogas desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getProrroga(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630307/prorroga.json');
  }

  /**
   * Obtiene la lista de propietarios desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getPropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630307/propietario.json');
  }

  /**
   * Obtiene la lista de tipos de propietarios desde un archivo JSON local.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getTipoDePropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/630307/tipo-de-propietario.json'
    );
  }
  /**
   * Obtiene la lista de países desde un archivo JSON local.
   **/

  getPais(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630307/pais.json');
  }
  /**
   * Obtiene los datos del documentos seleccionados.
   * @returns Observable con los datos del documentos seleccionados.
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/630307/documentos-seleccionados.json'
    );
  }

  getDatosDeLaSolicitud(): Observable<Tramite630307State> {
    return this.http.get<Tramite630307State>(
      'assets/json/630307/datos.json'
    );
  }

  /**
* Actualiza el estado del formulario en el store.
* @param DATOS Estado actualizado del trámite.
*/
actualizarEstadoFormulario(DATOS: Tramite630307State): void {
  Object.entries(DATOS).forEach(([key, value]) => {
    this.tramite630307store.setTramite630307State(key, value);
   });
}
}
