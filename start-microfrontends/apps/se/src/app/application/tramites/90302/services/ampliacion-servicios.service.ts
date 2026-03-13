/**
 * @fileoverview
 * El `AmpliacionServiciosService` es un servicio de Angular diseñado para gestionar las operaciones relacionadas con la ampliación de servicios.
 * Proporciona métodos para obtener datos desde archivos JSON y gestionar la visibilidad de ciertos elementos en la interfaz de usuario.
 *
 * @module AmpliacionServiciosService
 * @description
 * Este servicio utiliza el cliente HTTP de Angular para realizar solicitudes a archivos JSON locales y expone observables para manejar datos y eventos.
 */

import {
  BitacoraRespuesta,
  DatosDelModificacion,
  DatosResponse,
  MercanciasRespuesta,
  PlantasRespuesta,
  ProductorIndirectoRespuesta,
  SectorRespuesta,
} from '../models/datos-info.model';
import { Observable, map } from 'rxjs';
import { AmpliacionServiciosState } from '../estados/tramite90302.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Tramite90302Store} from '../estados/tramite90302.store';

@Injectable({
  providedIn: 'root',
})
export class AmpliacionServiciosService {
  /**
   * @description
   * URL base para acceder a los archivos JSON que contienen los datos.
   */
  private apiUrl = 'assets/json/90302/';

  /**
   * Constructor del servicio.
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar solicitudes.
   */
  constructor(private readonly http: HttpClient, private tramiteStore: Tramite90302Store) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @method getDatos
   * @returns {Observable<DatosResponse[]>} - Observable con los datos obtenidos.
   */
  getDatos(): Observable<DatosResponse[]> {
    return this.http
      .get<DatosResponse[]>(`${this.apiUrl}info-registro-datos.json`)
      .pipe(map((res) => res));
  }

  /**
   * @descripcion Obtiene la bitácora Prosec desde el servidor.
   * @retorna Un observable que emite la respuesta de la bitácora Prosec.
   */
  getBitacoraProsec(): Observable<BitacoraRespuesta> {
    return this.http
      .get<BitacoraRespuesta>(`${this.apiUrl}bitacora.json`)
      .pipe(map((res) => res));
  }

  /**
   * @descripcion Obtiene la lista de sectores PROSEC desde un archivo JSON.
   * @retorno Un observable que emite la respuesta del tipo `SectorRespuesta`.
   * @ejemplo
   * this.ampliacionServiciosService.getSectoresProsec().subscribe((sectores) => {
   *   console.log(sectores);
   * });
   */
  getSectoresProsec(): Observable<SectorRespuesta> {
    return this.http
      .get<SectorRespuesta>(`${this.apiUrl}sectores.json`)
      .pipe(map((res) => res));
  }

  /**
   * @method getPlantasProsec
   * @description Obtiene la lista de plantas Prosec desde un archivo JSON remoto.
   * @returns {Observable<PlantasRespuesta>} Un observable que emite la respuesta con la lista de plantas Prosec.
   * @example
   * this.ampliacionServiciosService.getPlantasProsec().subscribe((respuesta) => {
   *   console.log(respuesta);
   * });
   */
  getPlantasProsec(): Observable<PlantasRespuesta> {
    return this.http
      .get<PlantasRespuesta>(`${this.apiUrl}plantas.json`)
      .pipe(map((res) => res));
  }

  /**
   * @method getMercanciasProsec
   * @description Obtiene las mercancías Prosec desde un archivo JSON en el servidor.
   * @returns {Observable<MercanciasRespuesta>} Un observable que emite la respuesta con las mercancías Prosec.
   *
   * @example
   * this.ampliacionServiciosService.getMercanciasProsec().subscribe((respuesta) => {
   *   console.log(respuesta);
   * });
   */
  getMercanciasProsec(): Observable<MercanciasRespuesta> {
    return this.http
      .get<MercanciasRespuesta>(`${this.apiUrl}mercancias.json`)
      .pipe(map((res) => res));
  }

  /**
   * @method getProductorIndirectoProsec
   * @description Obtiene los datos del productor indirecto desde el endpoint especificado.
   * @returns {Observable<ProductorIndirectoRespuesta>} Un observable que emite la respuesta del productor indirecto.
   * @example
   * this.ampliacionServiciosService.getProductorIndirectoProsec().subscribe((respuesta) => {
   *   console.log(respuesta);
   * });
   */
  getProductorIndirectoProsec(): Observable<ProductorIndirectoRespuesta> {
    return this.http
      .get<ProductorIndirectoRespuesta>(`${this.apiUrl}productor.json`)
      .pipe(map((res) => res));
  }

  /**
   * Obtener datos de la tabla
   *
   * @returns {Observable<RespuestaCatalogos[]>} Un observable con la respuesta de los datos de la tabla.
   */
  getModificacionTableData(): Observable<DatosDelModificacion[]> {
    return this.http.get<DatosDelModificacion[]>(
      `${this.apiUrl}modificacion-tabla-datos.json`
    );
  }
  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @method actualizarEstadoFormulario
   * @param {AmpliacionServiciosState} DATOS - Datos de ampliación de servicios.
   */
  actualizarEstadoFormulario(DATOS:AmpliacionServiciosState): void {
    this.tramiteStore.setInfoRegistro(DATOS.infoRegistro);
  }
    
  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @returns {Observable<AmpliacionServiciosState>} - Observable con el estado de ampliación de servicios.
   */
  getServiciosData(): Observable<AmpliacionServiciosState> {
    return this.http.get<AmpliacionServiciosState>('assets/json/90302/datos-prefill.json')}
}
