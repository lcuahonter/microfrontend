/**
 * retorno-importacion-temporal.service.ts
 * servicio para gestionar solicitudes relacionadas con el trámite 630103.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Tramite630103State, Tramite630103Store } from '../estados/tramite630103.store';
/**
 * Servicio que gestiona las solicitudes relacionadas con el trámite 630103.
 * Proporciona métodos para obtener datos desde archivos JSON locales, como aduanas, prórrogas, propietarios y tipos de propietarios.
 */
@Injectable({
  providedIn: 'root',
})
export class AutorizacionImportacionTemporalService {
  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient, private tramite630103Store: Tramite630103Store,) {}

  /**
   * Obtiene la lista de secciones aduaneras desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getSeccionAduanera(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630103/seccion-aduanera.json');
  }

  /**
   * Obtiene la lista de aduanas de ingreso desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getAduanaDeIngreso(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630103/aduana-de-ingreso.json');
  }

  /**
   * Obtiene la lista de propietarios desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getPropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630103/propietario.json');
  }

  /**
   * Obtiene la lista de tipos de propietarios desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getTipoDePropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630103/tipo-de-propietario.json');
  }
  /**
   * Obtiene la lista de países desde un archivo JSON local.
   **/

  getPais(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630103/pais.json');
  }
  
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/630103/documentos-seleccionados.json');
  }

  actualizarEstadoFormulario(DATOS:Tramite630103State): void {
     Object.entries(DATOS).forEach(([key, value]) => {
     this.tramite630103Store.setTramite630103State(key, value);
    });
  }
  
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite630103State> {
    return this.http.get<Tramite630103State>('assets/json/630103/registro_toma_muestras_mercancias.json');
  }
}