/**
 * retorno-importacion-temporal.service.ts
 * servicio para gestionar solicitudes relacionadas con el trámite 630303.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Tramite630303State, Tramite630303Store } from '../estados/tramite630303.store';

/**
 * Servicio que gestiona las solicitudes relacionadas con el trámite 630303.
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
  constructor(private http: HttpClient,
              private tramite630303Store: Tramite630303Store,) {}

  /**
   * Obtiene la lista de secciones aduaneras desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getSeccionAduanera(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630303/seccion-aduanera.json');
  }

  /**
   * Obtiene la lista de aduanas de ingreso desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getAduanaDeIngreso(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630303/aduana-de-ingreso.json');
  }

  /**
   * Obtiene la lista de prórrogas desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getProrroga(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630303/prorroga.json');
  }

  /**
   * Obtiene la lista de propietarios desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getPropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630303/propietario.json');
  }

  /**
   * Obtiene la lista de tipos de propietarios desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getTipoDePropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630303/tipo-de-propietario.json');
  }
  /**
   * Obtiene la lista de países desde un archivo JSON local.
   **/

  getPais(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630303/pais.json');
  }

  /**
   * Obtiene la lista de documentos seleccionados desde un archivo JSON local.
   * Este método proporciona los documentos que han sido previamente seleccionados
   * para el trámite de retorno de importación temporal.
   * 
   * @returns {Observable<RespuestaCatalogos>} Observable que emite un objeto RespuestaCatalogos
   * conteniendo los documentos seleccionados para el trámite 630303.
   * @memberof RetornoImportacionTemporalService
   */
  obtenerDocumentosSeleccionados(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/630303/documentos-seleccionados.json');
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * Itera sobre todas las propiedades del objeto de datos y actualiza cada campo
   * individualmente en el store del trámite 630303.
   * 
   * @param {Tramite630303State} DATOS - Objeto que contiene los datos del estado del trámite
   * a actualizar en el store. Cada propiedad del objeto se establecerá como un campo
   * individual en el estado del trámite.
   * 
   * @description Este método utiliza Object.entries() para iterar sobre todas las
   * propiedades del objeto DATOS y actualiza el store utilizando setTramite630303State
   * para cada par clave-valor encontrado.
   * 
   * @returns {void}
   * @memberof RetornoImportacionTemporalService
   */
  actualizarEstadoFormulario(DATOS:Tramite630303State): void {
     Object.entries(DATOS).forEach(([key, value]) => {
     this.tramite630303Store.setTramite630303State(key, value);
    });
  }

  /**
   * Obtiene los datos de registro de toma de muestras de mercancías desde un archivo JSON local.
   * Este método proporciona información específica sobre el registro de muestras
   * tomadas de las mercancías en el proceso de retorno de importación temporal.
   * 
   * @returns {Observable<Tramite630303State>} Observable que emite un objeto Tramite630303State
   * conteniendo los datos de registro de toma de muestras de mercancías.
   * @memberof RetornoImportacionTemporalService
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite630303State> {
    return this.http.get<Tramite630303State>('assets/json/630303/registro_toma_muestras_mercancias.json');
  }
}